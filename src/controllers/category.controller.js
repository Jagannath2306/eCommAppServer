const Category = require('../models/category.model');
const Joi = require('joi');
const path = require('path');
const { createUploader } = require('../utils/uploader/createuploader');
const slugify = require("slugify");


const uploadCategory = createUploader({
    uploadPath: path.join(__dirname, '../', process.env.CATEGORY_IMAGE_PATH),
    fieldName: 'imagePath',
    maxCount: 1,
});

const saveCategory = (req, res) => {
    uploadCategory(req, res, async (err) => {
        try {
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Category image is required"
                });
            }

            const loggedInUser = req.session?.user;
            if (!loggedInUser) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }

            const schema = Joi.object({
                name: Joi.string().min(2).max(20).required(),
                title: Joi.string().min(2).max(20).required()
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const exists = await Category.isExists(value.name);
            if (exists) {
                return res.status(400).json({
                    success: false,
                    message: `Category '${value.name}' already exists`
                });
            }

            const imagePath = `${process.env.CATEGORY_IMAGE_PATH}/${req.file.filename}`;

            const category = new Category({
                name: value.name,
                title: value.title,
                slug: slugify(value.name, { lower: true, strict: true }),
                imagePath,
                createdBy: loggedInUser.id
            });

            await category.save();

            return res.status(201).json({
                success: true,
                message: "Category saved successfully"
            });

        } catch (error) {
            console.error("SaveCategory Error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    });
};


const updateCategory = async (req, res) => {
    uploadCategory(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }

        const loggedInUser = req.session.user;
        if (!loggedInUser) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const Schema = Joi.object({
            id: Joi.string().hex().length(24).required(),
            name: Joi.string().min(2).max(50).required(),
            title: Joi.string().min(2).max(100).required(),
            imagePath: Joi.string().required()
        });

        const filePath = `${process.env.CATEGORY_IMAGE_PATH}/${req.file.filename}`;
        const result = Schema.validate({ ...req.body, imagePath: filePath });
        if (result.error) {
            return res.status(400).send({ success: false, message: result.error.details[0].message });
        }

        const { id, name } = result.value;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const exists = await Category.isExists(name, id);
        if (exists) {
            return res.status(400).json({
                success: false,
                message: `Category '${name}' already exists`
            });
        }

        const categoryUpdate = await Category.findOneAndUpdate({ _id: id }, {
            ...result.value,
            slug: slugify(name, { lower: true, strict: true }),
            imagePath: filePath,
            updatedBy: loggedInUser.id
        });
        return res.status(200).json({
            success: true,
            message: "Category updated successfully"
        });
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

const getCategories = async (req, res) => {

    const rows = await Category.find({ isActive: true }, { _id: 1, name: 1 })
    return res.status(200).json({
        success: true,
        data: rows,
        message: "Categories fetched successfully"
    });
}
module.exports = {
    saveCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getAllCategories,
    getCategories
};