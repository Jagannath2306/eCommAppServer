const BrandLogo = require('../models/brandlogo.model');
const Joi = require('joi');
const multer = require('multer');
const path = require('path');

if (!process.env.BRANDLOGO_IMAGE_PATH) {
    throw new Error("BRANDLOGO_IMAGE_PATH is missing in .env");
}

const uploadFolderPath = path.join(__dirname, "../", process.env.BRANDLOGO_IMAGE_PATH);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolderPath)
    },
    filename: async function (req, file, cb) {
        // Validate file extension
        if (!file.originalname.match(/\.(png|jpg)$/i)) {
            return cb(new Error("Please Upload a valid file with ext png or jpg."));
        }

        try {
            const exists = await BrandLogo.isExists(req.body.name, req.body.id);
            if (exists) {
                return cb(new Error(`BrandLogo Name ${req.body.name} already exists.`));
            } else {
                const imageName = file.originalname.split('.')[0];
                const newFileName = `${imageName}-${Date.now()}${path.extname(file.originalname)}`;
                cb(null, newFileName);
            }
        } catch (err) {
            cb(err);
        }
    }
})
// Initialize Multer upload
const upload = multer({ storage: storage });
const uploadSingleImage = upload.single('imagePath');

module.exports = { uploadSingleImage };