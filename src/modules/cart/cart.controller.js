import { cartModel } from "../../../database/models/cart.model.js"
import { Product } from "../../../database/models/product.model.js"
import { throwError } from "../../utils/throwerror.js"



export const createCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body
        const product = await Product.findOne({ _id: productId})

        if (!product) {
            throw throwError("product does not exist", 404)
        }
        if (product.stock < quantity) {
            throw throwError("product out of stock", 404)
        }
        const cartExist = await cartModel.findOne({ user: req.user._id })

        if (!cartExist) {
            const cart = await cartModel.create({
                user: req.user._id,
                products: [{
                    productId,
                    quantity
                }]
            })
            return res.status(201).json({ msg: "done", cart })
        }

        let flag = false

        for (const product of cartExist.products) {
            if (productId == product.productId) {
                product.quantity = quantity
                flag = true
            }
        }

        if (!flag) {
            cartExist.products.push({
                productId,
                quantity
            })
        }

        await cartExist.save()

        res.status(200).json({ msg: "done", cart: cartExist })
    } catch (error) {
        next(error)
    }
}



export const removeCart = async (req, res, next) => {
    try {
        const { productId } = req.body

        const cartExist = await cartModel.findOneAndUpdate({
            user: req.user._id,
            "products.productId": productId
        }, {
            $pull: { products: { productId } }
        }, {
            new: true
        })

        res.status(200).json({ msg: "done", cart: cartExist })
    } catch (error) {
        next(error)
    }

}

export const clearCart = async (req, res, next) => {
    try {
        const cartExist = await cartModel.findOneAndUpdate({
            user: req.user._id,
        }, {
            products: []
        }, {
            new: true
        })

        if(!cartExist){
            throw throwError("Cart Does Not Exist",404)
        }

        res.status(200).json({ msg: "done", cart: cartExist })
    } catch (error) {
        next(error)
    }
}