const Category = require('../models/category.model');
const Joi = require('joi');
const path = require('path');
const { createUploader } = require('../utils/uploader/createuploader');

const uploadCategory = createUploader({
    uploadPath: path.join(__dirname, '../', process.env.CATEGORY_IMAGE_PATH),
    fieldName: 'imagePath',
    maxCount :1,
});


const saveCategory = async (req, res) => {
    //Handle File Upload 
    uploadCategory(req, res, async function (err) {
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
            title: Joi.string().min(2).max(20).required(),
            isSave: Joi.number().required(),
            link: Joi.string().required(),
            imagePath: Joi.string().required()
        });

        const filePath = `${process.env.CATEGORY_IMAGE_PATH}/${req.file.filename}`;
        const result = Schema.validate({ ...req.body, imagePath: filePath });
        if (result.error) {
            return res.status(400).send({ success: false, message: result.error.details[0].message });
        }

        const category = new Category({ ...result.value, imagePath: filePath, createdBy: loggedInUser.id });

        let response = await category.save();
        return res.status(201).json({ success: true, message: "Category Saved Successfully !!" });
    });
}

const updateCategory = async (req, res) => {
    //Handle File Upload 
    uploadCategory(req, res, async function (err) {
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
            title: Joi.string().min(2).max(20).required(),
            isSave: Joi.number().required(),
            link: Joi.string().required(),
            imagePath: Joi.string().required()
        });

        const filePath = `${process.env.CATEGORY_IMAGE_PATH}/${req.file.filename}`;
        const result = Schema.validate({ ...req.body, imagePath: filePath });
        if (result.error) {
            return res.status(400).send({ success: false, message: result.error.details[0].message });
        }

        const name = result.value.name;
        const categoryId = result.value.id;
        const category = await Category.findOneAndUpdate({ _id: categoryId }, { ...result.value, imagePath: filePath, updatedBy: loggedInUser.id });

        if (!category) {
            return res.status(400).send({ success: false, message: "Something Went Wrong while updating Category" });
        }

        return res.status(201).json({ success: true, message: "Category Updated Successfully !!" });
    });
}



const getAllCategories = async (req, res) => {
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

    const rows = await Category.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    let count = 0;
    count = await Category.countDocuments({ isActive: true });
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

const getCategoryById = async (req, res) => {
    const id = req.params.id;

    const category = await Category.findOne({ _id: id, isActive: true })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (category) {
        res.status(200).json({ success: true, data: category });
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}

const deleteCategory = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const categoryId = result.value.id;

    let isExists = await Category.findOne({ _id: categoryId, isActive: true }, { name: 1 });
    if (isExists) {
        await Category.findOneAndUpdate({ _id: categoryId }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "Category Deleted Successfully !!" });
    } else {
        res.status(402).json({ success: false, message: `Record not found to delete !!` });
        return;
    }
}

module.exports = { saveCategory, updateCategory, deleteCategory, getCategoryById, getAllCategories }