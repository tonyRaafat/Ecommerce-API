import multer from "multer";
import { throwError } from "../utils/throwerror.js";

export const validExtension = {
  image: ["image/png", "image/jpg"],
  pdf: ["application/pdf"],
};

export const multerHost = (customeValidation, cutsomPath = "uploads") => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (customeValidation.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new throwError("file not supported"), false);
  };

  const upload = multer({ storage, fileFilter });
  return upload;
};
