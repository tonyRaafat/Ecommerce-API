import { nanoid } from "nanoid";
import { Brand } from "../../../database/models/brand.model.js";
import { Category } from "../../../database/models/category.model.js";
import { Product } from "../../../database/models/product.model.js";
import { SubCategory } from "../../../database/models/subCategory.model.js";
import { throwError } from "../../utils/throwerror.js";
import slugify from "slugify";
import { ApiFeatures } from "../../utils/apiFeatuers.js";
import cloudinary from "../../utils/cloudinary.js";

export const createProduct = async (req, res, next) => {
    try {
        const { title, description, category, subCategory, brand, price, discount, stock } = req.body;
        const categoryExist = await Category.findById(category)
        if (!categoryExist) throw throwError("Category does not exist", 404);

        const subCategoryExist = await SubCategory.findOne({ _id: subCategory, category })
        if (!subCategoryExist) throw throwError("SubCategory does not exist", 404);

        const brandExist = await Brand.findById(brand)
        if (!brandExist) throw throwError("Brand does not exist", 404);

        const productExist = await Product.findOne({ title: title.toLowerCase() })
        if (productExist) throw throwError("product already exist", 400);

        const subPrice = price - (price * (discount || 0) / 100)

        if (!req.files) throw throwError("image file is required", 400);
        const customId = nanoid(5)

        let list = []
        for (const file of req.files.coverImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                folder: `Ecommerce/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/product/${customId}`
            })
            list.push({ secure_url, public_id })
        }
        const { secure_url, public_id } = req.files.image[0]

        const product = await Product.create({
            title: title.toLowerCase(),
            slug: slugify(title, {
                lower: true,
                replacement: "_"
            }),
            description: description.toLowerCase(),
            price,
            // discount,
            stock,
            category,
            subCategory,
            brand,
            image: { secure_url, public_id },
            coverImages: list,
            customId,
            subPrice,
            createdBy: req.user._id,

        })
        res.status(201).json({ msg: "done", product })

    } catch (error) {
        next(error)
    }
}
export const updateProduct = async (req, res, next) => {
    try {
        const {
            stock,
            discount,
            price,
            brand,
            subCategory,
            category,
            description,
            name,
        } = req.body;
        const { id } = req.params;

        const categoryExist = await Category.findById(category);
        if (!categoryExist) {
            throw throwError("category doesn't exist", 404);
        }

        const subCategoryExist = await SubCategory.findOne({
            _id: subCategory,
            category,
        });
        if (!subCategoryExist) {
            throw throwError("subCategory doesn't exist", 404);
        }

        const brandExist = await Brand.findById(brand);
        if (!brandExist) {
            throw throwError("brand doesn't exist", 404);
        }

        const product = await Product.findOne({
            _id: id,
            createdBy: req.user._id,
        });
        if (!product) {
            throw throwError("product doesn't exist", 404);
        }

        if (name) {
            if (name.toLowerCase() == product.name) {
                throw throwError("name must be different than old name", 409);
            }
            if (await Product.findOne({ name: name.toLowerCase() })) {
                throw throwError("name already exist", 409);
            }
            product.name = name.toLowerCase();
            product.slug = slugify(name, {
                lower: true,
                replacement: "_",
            });
        }

        if (description) {
            product.description = description;
        }

        if (stock) {
            product.stock = stock;
        }

        if (price && discount) {
            product.subPrice = price - (price * (discount || 0)) / 100;
            product.price = price;
            product.discount = discount;
        } else if (price) {
            product.subPrice = price - (price * (discount || 0)) / 100;
            product.price = price;
        } else if (discount) {
            product.subPrice = price - (price * (discount || 0)) / 100;
            product.discount = discount;
        }
        
        if (req.files) {
            if (req.files?.image?.length) {
                await cloudinary.uploader.destroy(product.image.public_id);
                const { secure_url, public_id } = await cloudinary.uploader.upload(
                    req.files.image[0].path,
                    {
                        folder: `Ecommerce/categories/${categoryExist.customeId}/subCategories/${subCategoryExist.customeId}/products/${product.customeId}/mainImage`,
                    }
                );
                product.image = { secure_url, public_id };
            }

            if (req.files?.coverImages?.length) {
                await cloudinary.api.delete_resources_by_prefix(
                    `Ecommerce/categories/${categoryExist.customeId}/subCategories/${subCategoryExist.customeId}/products/${product.customeId}/coverImages`
                );
                let list = [];
                for (const file of req.files.coverImages) {
                    const { secure_url, public_id } = await cloudinary.uploader.upload(
                        file.path,
                        {
                            folder: `Ecommerce/categories/${categoryExist.customeId}/subCategories/${subCategoryExist.customeId}/products/${product.customeId}/coverImages`,
                        }
                    );
                    list.push({ secure_url, public_id });
                }
                product.coverImages = list;
            }
        }
        await product.save()
        res.status(201).json({ msg: "done", product });
    } catch (error) {
        next(error);
    }
};
export const getProducts = async (req, res, next) => {
    try {
        const apiFeatures = new ApiFeatures(Product.find(), req.query)
            .pagination()
            .filter()
            .search()
            .sort()
            .select();
        const products = await apiFeatures.query;

        res.status(200).json({ msg: "done", page: apiFeatures.page, products });
    } catch (error) {
        next(error)
    }
};