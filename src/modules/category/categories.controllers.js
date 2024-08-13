import { nanoid } from "nanoid";
import { Category } from "../../../database/models/category.model.js";
import { throwError } from "../../utils/throwerror.js";
import slugify from "slugify";
import cloudinary from "../../utils/cloudinary.js";

export const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const categoryExist = await Category.findOne({ name: name.toLowerCase() })
        if (categoryExist !== null) throw throwError("Category already exists");
        if (!req.file) throw throwError("Image is required");
        const customId = nanoid(5);
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `Ecommerce/categories/${customId}`
        })
        const category = await Category.create({
            name,
            slug: slugify(name, {
                replacement: "_",
                lower: true
            }),
            image: { secure_url, public_id },
            customId,
            createdBy: req.user._id
        })

        res.status(201).json({ msg: "category created", category })
    } catch (error) {
        next(error)
    }
}

export const updateCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await Category.findOne({ _id: id, createdBy: req.user._id });
        if (!category) throw throwError("Category not found");
        if (name) {
            if (name.toLowerCase() === category.name) throw throwError("name should be diffrent");
            if (await Category.findOne({ name: name.toLowerCase() })) throw throwError("name already exist");
            category.name = name.toLowerCase();
            category.slug = slugify(name, {
                replacement: "_",
                lower: true
            })
        }

        if (req.file) {
            await cloudinary.uploader.destroy(category.image.public_id)
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
                folder: `Ecommerce/categories/${customId}`
            })
            category.image = { secure_url, public_id }
        }
        await category.save()
        res.json({ msg: "done" })
    } catch (error) {
        next(error)
    }
}

export const getCategories = async (req, res, next) => {
    try{
        const categories = await Category.find().populate('subCategory')
    if (categories.length === 0) {
        next(new appError("No categories found!!!", 404))
    }
    return res.status(200).json({ msg: "done", categories })
    }catch(error){
        next(error)
    }
}

export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await Category.findOneAndDelete({
            _id: id,
            createdBy: req.user._id,
        });
        if (!category) {
            next(new appError("category dosen't exists", 404));
        }
        await cloudinary.uploader.destroy(category.image.public_id);
        return res.json({ msg: "done" })
    } catch (error) {
        next(error)
    }
}