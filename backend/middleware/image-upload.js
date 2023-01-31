const multer = require("multer");

const fileUpload = multer({
  limits: 50000000,
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "uploads/images");
    },
    filename: (req, file, callback) => {
      console.log(file);
      const ext = file.mimetype.slice(
        file.mimetype.indexOf("/") + 1,
        file.mimetype.length
      );
      callback(null, file.originalname.split(".")[0] + "." + ext);
    },
  }),
});

module.exports = fileUpload;
