import { nanoid } from "nanoid";
import { SubCategory } from "../../../database/models/subCategory.model.js";
import { throwError } from "../../utils/throwerror.js";
import slugify from "slugify";
import { Category } from "../../../database/models/category.model.js";

export const createSubCategory = async (req, res, next) => {
    try {
        const { name , categoryId} = req.body;
        const category = Category.findOne({_id:categoryId,createdBy:req.user._id});
        if(!category) throw throwError("Category not found");
        const subCategoryExist = SubCategory.findOne({ name: name.toLowerCase() })
        if (subCategoryExist) throw throwError("subCategory already exists");
        if (!req.file) throw throwError("Image is required");

        const customId = nanoid(5);
        const {secure_url, public_id} = await cloudinary.uploader(req.file.path,{
            folder:"Ecommerce/categories/"+category.customId+"subCategory/"+customId
        })
        const subCategory = await subCategory.create({
            name,
            slug: slugify(name,{
                replacement:"_",
                lower:true
            }),
            image:{secure_url,public_id}, 
            customId,
            createdBy: user._id
        })
        res.status(201).json({msg:"subCategory created",subCategory})
    } catch (error) {
        next(error)
    }
}

export const updateSubCategory = async (req,res,next)=>{
    try {
        const {name} = req.body;
        const {id} = req.params;

        const category = Category.findOne({_id:id,createdBy:req.user._id});
        if(!category) throw throwError("Category not found");

        const subCategory = SubCategory.findOne({_id:id,createdBy:req.user._id});
        if(!subCategory) throw throwError("subCategory not found");
        if(name){
            if(name.toLowerCase() === subCategory.name) throw throwError("name should be diffrent");
            if(await subCategory.findOne({name:name.toLowerCase()})) throw throwError("name already exist");
            subCategory.name = name.toLowerCase();
            subCategory.slug = slugify(name,{
                replacement:"_",
                lower:true
            })
        }

        if(req.file){
            await cloudinary.uploader.destroy(subCategory.image.public_id)
            const {secure_url, public_id} = await cloudinary.uploader(req.file.path,{
                folder:"Ecommerce/categories/"+category.customId+"subCategory/"+subCategory.customId
            })
            subCategory.image = {secure_url,public_id}
        }
        await subCategory.save()
    } catch (error) {
        next(error)
    }
}