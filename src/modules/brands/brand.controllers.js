import { nanoid } from "nanoid";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";
import { throwError } from "../../utils/throwerror.js";
import { Brand } from "../../../database/models/brand.model.js";

export const createbrand = async (req, res, next) => {
  try {
    const { name } = req.body
    const brandExist = await Brand.findOne({
      name: name.toLowerCase(),
    });
    if (brandExist) throw throwError("brand already exist", 409);
    if (!req.file) {
      throw throwError("image is required", 404);
    }
    const customeId = nanoid(5);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `Ecommerce/brands/${customeId}`,
      }
    );
    const brand = await Brand.create({
      name,
      slug: slugify(name, {
        replacement: "_",
        lower: true,
      }),
      image: { secure_url, public_id },
      customeId,
      createdBy: req.user._id,
    });
    res.status(200).json({ msg: "done", brand });
  } catch (error) {
    next(error)
  }
};

export const updatebrand = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    let brand = await Brand.findOne({
      _id: id,
      createdBy: req.user._id,
    });
    if (!brand) {
      throw throwError("brand dosen't exists", 404)
    }

    if (name) {
      if (name.toLowerCase() === brand.name) {
        throw throwError("name should be diffrent", 400);
      }
      if (await Brand.findOne({ name: name.toLowerCase() })) {
        throw throwError("name already exists", 409)
      }
      brand.name = name.toLowerCase();
      brand.slug = slugify(name, {
        replacement: "_",
        lower: true,
      });
    }

    if (req.file) {
      await cloudinary.uploader.destroy(brand.image.public_id);
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: `Ecommerce/brands/${brand.customeId}`,
        }
      );
      brand.image = { secure_url, public_id };
    }

    await brand.save();
    return res.status(200).json({ msg: "done", brand });
  } catch (error) {
    next(error)
  }
};

export const getbrands = async (req, res, next) => {
  try {
    const brands = await Brand.find()
    if (brands.length === 0) {
      throw throwError("there is no categories yet", 404)
    }
    return res.status(200).json({ msg: "done", brands })
  } catch (error) {
    next(error)
  }
}

export const deletebrand = async (req, res, next) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findOneAndDelete({
      _id: id,
      createdBy: req.user._id,
    });
    if (!brand) {
      throw throwError("brand dosen't exists", 404);
    }
    await cloudinary.uploader.destroy(brand.image.public_id);
    return req.json({ msg: "done" })
  } catch (error) {
    next(error)
  }
}