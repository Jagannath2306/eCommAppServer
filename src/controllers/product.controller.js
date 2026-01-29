const Product = require('../models/product.model');
const Joi = require('joi');
const path = require('path');
const { createUploader } = require('../utils/uploader/createuploader');

const uploadProduct = createUploader({
    uploadPath: path.join(__dirname, '../', process.env.PRODUCT_IMAGE_PATH),
    fieldName: 'imagePaths',
    maxCount: 3,
});

const saveProduct = async (req, res) => {
    uploadProduct(req, res, async function (err) {
        if (err) return res.status(400).send({ success: false, message: err.message });

        if (!req.files || req.files.length === 0) {
            return res.status(400).send({ success: false, message: "No File found to upload" });
        }

        // 1. Sanitize Arrays (Fixes the Mongoose CastError)
        const sanitizeArray = (data) => {
            if (!data) return [];
            let items = data;
            if (typeof data === 'string') {
                items = data.replace(/[\[\]'"]/g, '').split(',');
            } else if (Array.isArray(data) && data.length === 1 && data[0].includes(',')) {
                items = data[0].split(',');
            }
            return Array.isArray(items) ? items.map(i => i.trim()) : [items];
        };

        req.body.tagIds = sanitizeArray(req.body.tagIds);
        req.body.categoryIds = sanitizeArray(req.body.categoryIds);

        const loggedInUser = req.session.user;
        if (!loggedInUser) {
            return res.status(400).send({ success: false, message: "Unauthorized User" });
        }

        // 2. Prepare File Paths
        const filePaths = req.files.map(file => `${process.env.PRODUCT_IMAGE_PATH}/${file.filename}`);

        // 3. Joi Validation
        const Schema = Joi.object({
            name: Joi.string().trim().min(3).max(100).required(),
            code: Joi.string().trim().uppercase().min(2).max(20).required(),
            title: Joi.string().trim().min(3).max(150).required(),
            price: Joi.number().positive().required(),
            salePrice: Joi.number().positive().less(Joi.ref('price')).optional(),
            shortDetails: Joi.string().trim().min(5).max(300).required(),
            description: Joi.string().trim().min(10).required(),
            categoryIds: Joi.array().items(Joi.string()).min(1).required(),
            tagIds: Joi.array().items(Joi.string()).required(),
            statusId: Joi.string().required(),
            imagePaths: Joi.array().items(Joi.string())
        });

        const result = Schema.validate({ ...req.body, imagePaths: filePaths });
        if (result.error) {
            return res.status(400).send({ success: false, message: result.error.details[0].message });
        }

        // 4. Save to DB
        try {
            const product = new Product({
                ...result.value,
                createdBy: loggedInUser.id
            });
            await product.save();
            res.status(201).json({ success: true, message: "Product Saved Successfully !!" });
        } catch (dbErr) {
            res.status(500).send({ success: false, message: dbErr.message });
        }
    });
};

const updateProduct = async (req, res) => {
    uploadProduct(req, res, async function (err) {
        if (err) return res.status(400).send({ success: false, message: err.message });

        const sanitizeArray = (data) => {
            if (!data) return [];
            let items = data;
            if (typeof data === 'string') {
                items = data.replace(/[\[\]'"]/g, '').split(',');
            } else if (Array.isArray(data) && data.length === 1 && data[0].includes(',')) {
                items = data[0].split(',');
            }
            return Array.isArray(items) ? items.map(i => i.trim()) : [items];
        };

        req.body.tagIds = sanitizeArray(req.body.tagIds);
        req.body.categoryIds = sanitizeArray(req.body.categoryIds);

        let existingImages = [];
        try {
            existingImages = req.body.remainingImages ? JSON.parse(req.body.remainingImages) : [];
        } catch (e) {
            existingImages = sanitizeArray(req.body.remainingImages);
        }

        const loggedInUser = req.session.user;
        if (!loggedInUser) {
            return res.status(401).send({ success: false, message: "Unauthorized User" });
        }

        const newFilePaths = req.files ? req.files.map(file => `${process.env.PRODUCT_IMAGE_PATH}/${file.filename}`) : [];

        const totalImagePaths = [...existingImages, ...newFilePaths];

        if (totalImagePaths.length === 0) {
            return res.status(400).send({ success: false, message: "Product must have at least one image" });
        }

        // 3. Joi Validation (Updated for your model fields)
        const Schema = Joi.object({
            id: Joi.string().required(), // The Product ID to update
            name: Joi.string().trim().min(3).max(100).required(),
            code: Joi.string().trim().uppercase().required(),
            title: Joi.string().trim().max(150).required(),
            price: Joi.number().positive().required(),
            salePrice: Joi.number().positive().less(Joi.ref('price')).required(),
            shortDetails: Joi.string().trim().min(5).required(),
            description: Joi.string().trim().min(10).required(),
            categoryIds: Joi.array().items(Joi.string()).required(),
            tagIds: Joi.array().items(Joi.string()).required(),
            statusId: Joi.string().required(),
            imagePaths: Joi.array().items(Joi.string()).min(1).required(),
            existingImages: Joi.any().optional()
        });

        const result = Schema.validate({ ...req.body, imagePaths: totalImagePaths });
        if (result.error) {
            return res.status(400).send({ success: false, message: result.error.details[0].message });
        }

        try {
            const { id, remainingImages, ...updateData } = result.value;

            const product = await Product.findByIdAndUpdate(
                id,
                { ...updateData, updatedBy: loggedInUser.id },
                { new: true } // returns the updated document
            );

            if (!product) {
                return res.status(404).send({ success: false, message: "Product not found" });
            }

            res.status(200).json({ success: true, message: "Product Updated Successfully !!", data: product });
        } catch (err) {
            res.status(500).send({ success: false, message: err.message });
        }
    });
};



const getAllProducts = async (req, res) => {
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

    const rows = await Product.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' })
        .populate({ path: 'categoryId', select: 'name' })
        .populate({ path: 'tagId', select: 'name' })
        .populate({ path: 'colorId', select: 'name code' })
        .populate({ path: 'sizeId', select: 'name' });
    let count = 0;
    count = await Product.countDocuments({ isActive: true });
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

const getProductById = async (req, res) => {

    const schema = Joi.object({
        id: Joi.string().required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }
    const id = result.value.id;
    const product = await Product.findOne({ _id: id, isActive: true })
        .populate({ path: 'categoryIds', select: { _id: 1, name: 1 } })
        .populate({ path: 'tagIds', select: { _id: 1, name: 1 } })
        .populate({ path: 'statusId', select: { _id: 1, name: 1, code:1, description:1} })
        .populate({ path: 'createdBy', select: { _id: 1, firstName: 1, lastName: 1, email: 1 } })
    if (product) {
        res.json({ success: true, data: product });
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}

const deleteProduct = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const productId = result.value.id;

    let isExists = await Product.findOne({ _id: productId, isActive: true }, { name: 1 });
    if (isExists) {
        await Product.findOneAndUpdate({ _id: productId }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "Product Deleted Successfully !!" });
    } else {
        return res.status(402).json({ success: false, message: `Record not found to delete !!` });
    }
}

const getProductByCategoryId = async (req, res) => {
    const product = await Product.find({ categoryId: req.params.categoryId, isActive: true })
        .populate({ path: 'createdBy', select: { _id: 0, firstName: 1, lastName: 1, email: 1 } })
        .populate({ path: 'updatedBy', select: { _id: 0, firstName: 1, lastName: 1, email: 1 } })
        .populate({ path: 'categoryId', select: { _id: 0, name: 1 } })
        .populate({ path: 'tagId', select: { _id: 0, name: 1 } })
        .populate({ path: 'colorId', select: { _id: 0, name: 1, code: 1 } })
        .populate({ path: 'sizeId', select: { _id: 0, name: 1 } });
    if (product) {
        res.json({ success: true, data: product });
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}


const getProducts = async (req, res) => {
    try {
        const rows = await Product.find({ isActive: true })
        let count = 0;
        count = await Product.countDocuments({ isActive: true })
            .populate({ path: 'statusId', select: { _id: 0, name: 1, code: 1 } })
        return res.status(200).json({
            success: true,
            data: rows,
            message: "Product fetched successfully"
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

module.exports = {
    saveProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getAllProducts,
    getProductByCategoryId,
    getProducts
}