"use strict";

const multer = require("multer");
const mkdirp = require("mkdirp");
const { responseData } = require("../../services/response");

const uploadImage = (type) => (req, res, next) => {
  const made = mkdirp.sync(`./public/images/${type}`);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `./public/images/${type}`);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname.split("_").pop()}`);
    },
  });

  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const isValid = new RegExp("^.*.(jpg|JPG|jpeg|JPEG|PNG|png)$").test(
        file.originalname
      );

      if (isValid) {
        cb(null, true);
      } else {
        return cb(new Error("File extension is invalid"));
      }
    },
    limits: { fileSize: 10000000 },
  });

  const uploadSingleImage = upload.single(type);

  uploadSingleImage(req, res, (err) => {
    if (err) {
      return res.status(401).send(responseData(err.message));
    }

    next();
  });
};

module.exports = { uploadImage };
