import { nanoid } from "nanoid";
import { Category } from "../../../database/models/category.model.js";
import { throwError } from "../../utils/throwerror.js";
import slugify from "slugify";

export const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const categoryExist = Category.findOne({ name: name.toLowerCase() })
        if (categoryExist) throw throwError("Category already exists");
        if (!req.file) throw throwError("Image is required");

        const customId = nanoid(5);
        const {secure_url, public_id} = await cloudinary.uploader(req.file.path,{
            folder:"Ecommerce/categories"
        })
        const category = await Category.create({
            name,
            slug: slugify(name,{
                replacement:"_",
                lower:true
            }),
            image:{secure_url,public_id},
            customId,
            createdBy: user._id
        })
        res.status(201).json({msg:"category created",category})
    } catch (error) {
        next(error)
    }
}

export const updateCategory = async (req,res,next)=>{
    try {
        const {name} = req.body;
        const {id} = req.params;
        const category = Category.findOne({_id:id,createdBy:req.user._id});
        if(!category) throw throwError("Category not found");
        if(name){
            if(name.toLowerCase() === category.name) throw throwError("name should be diffrent");
            if(await Category.findOne({name:name.toLowerCase()})) throw throwError("name already exist");
            category.name = name.toLowerCase();
            category.slug = slugify(name,{
                replacement:"_",
                lower:true
            })
        }

        if(req.file){
            await cloudinary.uploader.destroy(category.image.public_id)
            const {secure_url, public_id} = await cloudinary.uploader(req.file.path,{
                folder:"Ecommerce/categories"
            })
            category.image = {secure_url,public_id}
        }
        await category.save()
        res.json({msg:"done"})
    } catch (error) {
        next(error)
    }
}