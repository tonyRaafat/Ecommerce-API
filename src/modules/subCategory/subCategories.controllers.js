import { nanoid } from "nanoid";
import { SubCategory } from "../../../database/models/subCategory.model.js";
import { throwError } from "../../utils/throwerror.js";
import slugify from "slugify";
import { Category } from "../../../database/models/category.model.js";
import cloudinary from "../../utils/cloudinary.js";

export const createSubCategory = async (req, res, next) => {
    try {
        const { user } = req
        const { name, categoryId } = req.body;
        const category = await Category.findOne({ _id: categoryId, createdBy: req.user._id });
        if (!category) throw throwError("Category not found");
        const subCategoryExist = await SubCategory.findOne({ name: name.toLowerCase() })
        if (subCategoryExist) throw throwError("subCategory already exists");
        if (!req.file) throw throwError("Image is required");

        const customId = nanoid(5);
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: "Ecommerce/categories/" + category.customId + "subCategory/" + customId
        })
        const subCategory = await SubCategory.create({
            name,
            slug: slugify(name, {
                replacement: "_",
                lower: true
            }),
            image: { secure_url, public_id },
            customId,
            category: categoryId,
            createdBy: user._id
        })
        res.status(201).json({ msg: "subCategory created", subCategory })
    } catch (error) {
        next(error)
    }
}

export const updateSubCategory = async (req, res, next) => {
    try {
        const { name, categoryId } = req.body;
        const { id } = req.params;


        const subCategory = await SubCategory.findOne({ _id: id, createdBy: req.user._id });
        if (!subCategory) throw throwError("subCategory not found");
        const category = await Category.findOne({ _id: subCategory.category, createdBy: req.user._id });
        if (!category) throw throwError("Category not found");
        if (name) {
            if (name.toLowerCase() === subCategory.name) throw throwError("name should be diffrent");
            if (await SubCategory.findOne({ name: name.toLowerCase() })) throw throwError("name already exist");
            subCategory.name = name.toLowerCase();
            subCategory.slug = slugify(name, {
                replacement: "_",
                lower: true
            })
        }

        if (req.file) {
            await cloudinary.uploader.destroy(subCategory.image.public_id)
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
                folder: "Ecommerce/categories/" + category.customId + "subCategory/" + subCategory.customId
            })
            subCategory.image = { secure_url, public_id }
        }
        await subCategory.save()
        res.status(200).json({ msg: "subCategory updated", subCategory })
    } catch (error) {
        next(error)
    }
}

export const getsubcategories = async (req, res, next) => {
    const subcategories = await SubCategory.find()
    if (subcategories.length === 0) {
        next(new appError("No subCategory found!!", 404))
    }
    return res.status(200).json({ msg: "done", subcategories })
}

export const deletesubcategory = async (req, res, next) => {
    const { id } = req.params;

    const subcategory = await SubCategory.findOneAndDelete({
        _id: id,
        createdBy: req.user._id,
    });
    if (!subcategory) {
        next(new appError("subcategory dosen't exists", 404));
    }
    await cloudinary.uploader.destroy(subcategory.image.public_id);

    return res.status(204).json({ msg: "done" })
}