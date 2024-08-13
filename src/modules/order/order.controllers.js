import Stripe from "stripe";
import { cartModel } from "../../../database/models/cart.model.js";
import { Coupon } from "../../../database/models/coupon.model.js";
import { OrderModel } from "../../../database/models/order.model.js";
import { Product } from "../../../database/models/product.model.js";

import { throwError } from '../../utils/throwerror.js'
import { payment } from "../../services/payment.js";
import sendEmail from "../../services/email.js";
import createInvoice from "../../services/invoice.js";

export const createOrder = async (req, res, next) => {
    try {
        const { productId, quantity, couponCode, paymentMethod, address, phone } = req.body;

        if (couponCode) {
            const coupon = await Coupon.findOne({
                code: couponCode.toLowerCase(),
                usedBy: { $nin: [req.user._id] },
            });

            if (!coupon || coupon.toDate < Date.now()) {
                throw throwError("Invalid coupon code or coupon already used or expired", 494);
            }

            req.body.coupon = coupon;
        }

        let products = [];
        let flag = false;

        if (productId) {
            products = [{ product: productId, quantity }];
        } else {
            const cart = await cartModel.findOne({ user: req.user._id });

            if (!cart || !cart.products.length) {
                throw throwError("Cart is empty, please select a product to order", 484);
            }

            products = cart.products;
            flag = true;
        }

        if (productId) {
            products = [{ product: productId, quantity }];
        } else {
            const cart = await cartModel.findOne({ user: req.user._id });
            if (!cart || !cart.products.length) {
                throw throwError("Cart is empty, please select a product to order", 484);
            }

            products = cart.products;
            flag = true;
        }

        const finalProducts = [];
        let subPrice = 0;

        for (let product of products) {
            const checkProduct = await Product.findOne({
                id: product.product,
                stock: { $gte: product.quantity },
            });

            if (!checkProduct) {
                throw throwError("Product not found or out of stock", 404)
            }

            if (flag) {
                product = product.toObject();
            }

            product.title = checkProduct.title;
            product.price = checkProduct.price;
            product.finalPrice = checkProduct.price * product.quantity;
            product.subPrice = checkProduct.price * product.quantity; // Add this line
            subPrice += product.finalPrice;
            
            finalProducts.push(product);
        }
        
        const order = await OrderModel.create({
            user: req.user._id,
            products: finalProducts,
            subPrice,
            couponId: req.body.coupon?._id,
            totalPrice: subPrice - (subPrice * (req.body.coupon?.amount || 0) / 100),
            paymentMethod,
            status: paymentMethod === "cash" ? "placed" : "waitPayment",
            phone,
            address,
        });
        if (req.body?.coupon) {
            await Coupon.updateOne(
                { _id: req.body.coupon._id },
                { $push: { usedBy: req.user._id } }
            );
        }

        for (const product of finalProducts) {
            await Product.findOneAndUpdate(
                { _id: product.productId },
                { $inc: { stock: -product.quantity } }
            );
        }

        

        const invoice = {
            shipping: {
                name: req.user.name,
                address: req.user.address,
                city: "San Francisco",
                state: "CA",
                country: "US",
                postal_code: 94111,
            },
            items: order.products,
            subtotal: order.subPrice,
            paid: order.totalPrice,
            invoice_nr: order._id,
            date: order.createdAt,
            coupon: req.body?.coupon?.amount || 0,
        };
        await createInvoice(invoice, "invoice.pdf");

        await sendEmail(
            req.user.email,
            "Order Placed",
            `your order has been placed successfully`,
            [
                {
                    path: "invoice.pdf",
                    contentType: "application/pdf",
                },
                {
                    path: "route.jpeg",
                    contentType: "image/pdf",
                },
            ]
        );

        if (paymentMethod == "card") {
            const stripe = new Stripe(process.env.stripe_secret);

            if (req.body?.coupon) {
                const coupon = await stripe.coupons.create({
                    percent_off: req.body.coupon.amount,
                    duration: "once",
                });
                req.body.couponId = coupon.id;
            }

            const session = await payment({
                payment_method_types: ["card"],
                mode: "payment",
                customer_email: req.user.email,
                metadata: {
                    orderId: order._id.toString(),
                },
                success_url: `${req.protocol}://${req.headers.host}/order/success/${order._id}`,
                cancel_url: `${req.protocol}://${req.headers.host}/order/cancel/${order._id}`,
                line_items: order.products.map((product) => {
                    return {
                        price_data: {
                            currency: "egp",
                            product_data: {
                                name: product.title,
                            },
                            unit_amount: product.price * 100,
                        },
                        quantity: product.quantity,
                    };
                }),
                discounts: req.body?.coupon ? [{ coupon: req.body.couponId }] : [],
            });
            if (flag) {
                await cartModel.updateOne({ user: req.user._id }, { products: [] });
            }
            return res.status(201).json({ msg: "done", order,session });
        }
    } catch (error) {
        next(error);
    }
}

export const cancelOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const order = await OrderModel.findOne({ _id: id, user: req.user._id });
        if (!order) {
            throw throwError("order not found", 404);
        }
        if (
            (order.paymentMethod === "cash" && order.status != "placed") ||
            (order.paymentMethod === "card" && order.status != "waitPayment")
        ) {
            throw throwError("cannot cancel this order", 400);
        }

        await OrderModel.updateOne(
            { _id: id },
            {
                status: "cancelled",
                cancelledBy: req.user._id,
                reason,
            }
        );

        if (order?.couponId) {
            await couponModel.updateOne(
                { _id: order.couponId },
                {
                    $pull: { usedBy: req.user._id },
                }
            );
        }

        for (const product of order.products) {
            await Product.updateOne(
                { _id: product.productId },
                {
                    $inc: { stock: product.quantity },
                }
            );
        }

        res.status(204).json({ msg: "done" });
    } catch (error) {
        next(error);
    }
};
export const webhook = async (req, res, next) => {
    try {
        const stripe = new Stripe(process.env.stripe_secret);
        const sig = req.headers["stripe-signature"];

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.endpointSecret
            );
        } catch (err) {
            throw throwError(`Webhook Error: ${err.message}`, 400);
        }

        // Handle the event
        if (event.type !== "checkout.session.completed") {
            const { orderId } = event.data.object.metadata;
            await OrderModel.findByIdAndUpdate(orderId, { status: "rejected" });
            return res.status(400).json({ msg: "fail" });
        } else {
            await OrderModel.findByIdAndUpdate(orderId, { status: "placed" });
            return res.status(200).json({ msg: "done" });
        }
    } catch (error) {
        next(error);
    }
};