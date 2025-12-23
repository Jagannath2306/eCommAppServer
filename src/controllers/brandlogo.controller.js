const BrandLogo = require('../models/brandlogo.model');
const Joi = require('joi');
const { uploadSingleImage } = require('../utils/singleupload.brandlogo');
const { BRANDLOGO_IMAGE_PATH } = process.env;


const saveBrandLogo = async (req, res) => {
    console.log(req.body);
    //Handle File Upload 
    uploadSingleImage(req, res, async function (err) {
        if (err) {
            return res.status(400).send({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).send({ message: "No File found to upload" });
        }

        const loggedInUser = req.session.user;
        if (!loggedInUser) {
            return res.status(400).send({ message: "Unauthorized User not logged in !!" });
        }

        const Schema = Joi.object({
            name: Joi.string().min(2).max(20).required(),
            imagePath: Joi.string().required()
        });

        const filePath = BRANDLOGO_IMAGE_PATH + "/" + req.file.filename;
        const result = Schema.validate({ name : req.body.name, imagePath : filePath });
        if (result.error) {
            return res.status(400).send({ error: result.error.details[0].message });
        }

        const name = result.value.name;
        const brandLogo = new BrandLogo({ name: name, imagePath: filePath, createdBy: loggedInUser.id });

        let response = await brandLogo.save();
        res.status(201).json(response);
    });
}

const updateBrandLogo = async (req, res) => {
    //Handle File Upload 
    console.log(req.body);
    
    uploadSingleImage(req, res, async function (err) {
        if (err) {
            return res.status(400).send({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).send({ message: "No File found to upload" });
        }

        const loggedInUser = req.session.user;
        if (!loggedInUser) {
            return res.status(400).send({ message: "Unauthorized User not logged in !!" });
        }

        const Schema = Joi.object({
            id: Joi.string().required(),
            name: Joi.string().min(2).max(20).required(),
            imagePath: Joi.string().required()
        });

        const filePath = BRANDLOGO_IMAGE_PATH + "/" + req.file.filename;
        const result = Schema.validate({ id : req.body.id,name : req.body.name, imagePath : filePath  });
        if (result.error) {
            return res.status(400).send({ error: result.error.details[0].message });
        }

        const name = result.value.name;
        const brandgogoId = result.value.id;
        const brandLogo = await BrandLogo.findOneAndUpdate({ _id: brandgogoId }, { name: name, imagePath: filePath, updatedBy: loggedInUser.id });

        if (!brandLogo) {
            return res.status(400).send({ message: "Something Went Wrong while updating BrandLogo" });
        }

        return res.status(201).json({ message: "BrandLogo Updated Successfully !!" });
    });
}



const getAllBrandLogos = async (req, res) => {
    const limitVal = Number.parseInt(req.body.pageSize) || 10;
    const page = Number.parseInt(req.body.page) || 1;
    const skipCount = limitVal * (page - 1);
    const sortCol = req.body.sortCol;
    const sortBy = req.body.sort || 'asc';

    const sortObject = {};
    sortObject[sortCol] = sortBy === 'asc' ? 1 : -1;

    const rows = await BrandLogo.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    let count = 0;
    count = await BrandLogo.countDocuments({ isActive: true });
    res.json({ rows, count });
}

const getBrandLogoById = async (req, res) => {
    const id = req.params.id;

    const brandLogo = await BrandLogo.findOne({ _id: id, isActive: true })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (brandLogo) {
        res.json({ brandLogo });
    } else {
        res.status(402).json({ error: "Data not found" });
    }
}

const deleteBrandLogo = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ error: result.error.details[0].message });
    }

    const brandLogoId = result.value.id;

    let isExists = await BrandLogo.findOne({ _id: brandLogoId, isActive: true }, { name: 1 });
    if (isExists) {
        await BrandLogo.findOneAndUpdate({ _id: brandLogoId }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ message: "Brand Logo Deleted Successfully !!" });
    } else {
        res.status(402).json({ Error: `Record not found to delete !!` });
        return;
    }
}

module.exports = { saveBrandLogo, updateBrandLogo, deleteBrandLogo, getBrandLogoById, getAllBrandLogos }