const BrandLogo = require('../models/brandlogo.model');
const Joi = require('joi');
const { createUploader } = require('../utils/uploader/createuploader');
const path = require('path');

const uploadBrandLogo = createUploader({
    uploadPath: path.join(__dirname, '../', process.env.BRANDLOGO_IMAGE_PATH),
    fieldName: 'imagePath',
    maxCount: 1,
});

const saveBrandLogo = async (req, res) => {
    //Handle File Upload 
    uploadBrandLogo(req, res, async function (err) {
        if (err) {
            return res.status(400).send({ success: false, message: err.message });
        }

        if (!req.file) {
            return res.status(400).send({ success: false, message: "No File found to upload" });
        }

        const loggedInUser = req.session.user;
        if (!loggedInUser) {
            return res.status(400).send({ success: false, message: "Unauthorized User not logged in !!" });
        }

        const Schema = Joi.object({
            name: Joi.string().min(2).max(20).required(),
            imagePath: Joi.string().required()
        });

        const filePath = `${process.env.BRANDLOGO_IMAGE_PATH}/${req.file.filename}`;
        const result = Schema.validate({ name: req.body.name, imagePath: filePath });
        if (result.error) {
            return res.status(400).send({ success: false, message: result.error.details[0].message });
        }

        const exists = await BrandLogo.isExists(result.value.name,);
        if (exists) {
            return res.status(400).json({ success: false, message: 'Brand name already exists' });
        }

        const name = result.value.name;
        const brandLogo = new BrandLogo({ name: name, imagePath: filePath, createdBy: loggedInUser.id });

        let response = await brandLogo.save();
        return res.status(201).json({ success: true, message: "BrandLogo Saved Successfully !!" });
    });
}

const updateBrandLogo = async (req, res) => {
    //Handle File Upload 

    uploadBrandLogo(req, res, async function (err) {
        if (err) {
            return res.status(400).send({ success: false, message: err.message });
        }

        if (!req.file) {
            return res.status(400).send({ success: false, message: "No File found to upload" });
        }

        const loggedInUser = req.session.user;
        if (!loggedInUser) {
            return res.status(400).send({ success: false, message: "Unauthorized User not logged in !!" });
        }

        const Schema = Joi.object({
            id: Joi.string().required(),
            name: Joi.string().min(2).max(20).required(),
            imagePath: Joi.string().required()
        });

         const filePath = `${process.env.BRANDLOGO_IMAGE_PATH}/${req.file.filename}`;

        const result = Schema.validate({ id: req.body.id, name: req.body.name, imagePath: filePath });
        if (result.error) {
            return res.status(400).send({ success: false, message: result.error.details[0].message });
        }

        const name = result.value.name;
        const brandgogoId = result.value.id;
        const brandLogo = await BrandLogo.findOneAndUpdate({ _id: brandgogoId }, { name: name, imagePath: filePath, updatedBy: loggedInUser.id });

        if (!brandLogo) {
            return res.status(400).send({ success: false, message: "Something Went Wrong while updating BrandLogo" });
        }
        return res.status(201).json({ success: true, message: "BrandLogo Updated Successfully !!" });
    });
}



const getAllBrandLogos = async (req, res) => {
    const schema = Joi.object({
        pageSize: Joi.number().min(5).required(),
        page: Joi.number().min(1).required(),
        sortCol: Joi.string().required(),
        sort: Joi.string().valid('asc', 'desc').required()
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }
    const limitVal = Number.parseInt(result.value.pageSize) || 10;
    const page = Number.parseInt(result.value.page) || 1;
    const skipCount = limitVal * (page - 1);
    const sortCol = result.value.sortCol;
    const sortBy = result.value.sort || 'asc';
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
    return res.status(200).json({
        success: true,
        data: rows,
        meta: {
            page: page,
            pageSize: limitVal,
            total: count
        }
    });
}

const getBrandLogoById = async (req, res) => {
    const id = req.params.id;

    const brandLogo = await BrandLogo.findOne({ _id: id, isActive: true })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (brandLogo) {
        res.status(200).json({ success: true, data: brandLogo });
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}

const deleteBrandLogo = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const brandLogoId = result.value.id;

    let isExists = await BrandLogo.findOne({ _id: brandLogoId, isActive: true }, { name: 1 });
    if (isExists) {
        await BrandLogo.findOneAndUpdate({ _id: brandLogoId }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "Brand Logo Deleted Successfully !!" });
    } else {
        res.status(402).json({ success: false, message: `Record not found to delete !!` });
        return;
    }
}

module.exports = { saveBrandLogo, updateBrandLogo, deleteBrandLogo, getBrandLogoById, getAllBrandLogos }