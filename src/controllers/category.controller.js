const Category = require('../models/category.model');
const Joi = require('joi');
const { uploadSingleImage } = require('../utils/singleupload.category');
const { CATEGORY_IMAGE_PATH } = process.env;


const saveCategory = async (req, res) => {
    // console.log(req.body);
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
            title: Joi.string().min(2).max(20).required(),
            isSave: Joi.number().required(),
            link: Joi.string().required(),
            imagePath: Joi.string().required()
        });

        const filePath = CATEGORY_IMAGE_PATH + "/" + req.file.filename;
        const result = Schema.validate({ ...req.body, imagePath: filePath });
        if (result.error) {
            return res.status(400).send({ error: result.error.details[0].message });
        }

        const category = new Category({ ...result.value, imagePath: filePath, createdBy: loggedInUser.id });

        let response = await category.save();
        res.status(201).json(response);
    });
}

const updateCategory = async (req, res) => {
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
            id: Joi.string().required(),
            name: Joi.string().min(2).max(20).required(),
            title: Joi.string().min(2).max(20).required(),
            isSave: Joi.number().required(),
            link: Joi.string().required(),
            imagePath: Joi.string().required()
        });

        const filePath = CATEGORY_IMAGE_PATH + "/" + req.file.filename;
        const result = Schema.validate({ ...req.body, imagePath: filePath });
        if (result.error) {
            return res.status(400).send({ error: result.error.details[0].message });
        }

        const name = result.value.name;
        const categoryId = result.value.id;
        const category = await Category.findOneAndUpdate({ _id: categoryId }, { ...result.value, imagePath: filePath, updatedBy: loggedInUser.id });

        if (!category) {
            return res.status(400).send({ message: "Something Went Wrong while updating Category" });
        }

        return res.status(201).json({ message: "Category Updated Successfully !!" });
    });
}



const getAllCategories = async (req, res) => {
    const limitVal = Number.parseInt(req.body.pageSize) || 10;
    const page = Number.parseInt(req.body.page) || 1;
    const skipCount = limitVal * (page - 1);
    const sortCol = req.body.sortCol;
    const sortBy = req.body.sort || 'asc';

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
    res.json({ rows, count });
}

const getCategoryById = async (req, res) => {
    const id = req.params.id;

    const category = await Category.findOne({ _id: id, isActive: true })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (category) {
        res.json({ category });
    } else {
        res.status(402).json({ error: "Data not found" });
    }
}

const deleteCategory = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ error: result.error.details[0].message });
    }

    const categoryId = result.value.id;

    let isExists = await Category.findOne({ _id: categoryId, isActive: true }, { name: 1 });
    if (isExists) {
        await Category.findOneAndUpdate({ _id: categoryId }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ message: "Category Deleted Successfully !!" });
    } else {
        res.status(402).json({ Error: `Record not found to delete !!` });
        return;
    }
}

module.exports = { saveCategory, updateCategory, deleteCategory, getCategoryById, getAllCategories }