const Product = require('../models/product.model');
const Joi = require('joi');
const { uploadMultipleImage } = require('../utils/multipleupload.product');
const { PRODUCT_IMAGE_PATH } = process.env;


const saveProduct = async (req, res) => {
    //Handle File Upload 
    uploadMultipleImage(req, res, async function (err) {
        if (err) {
            return res.status(400).send({ success :false,message: err.message });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).send({success :false, message: "No File found to upload" });
        }
        if (req.files.length < 5) {
            return res.status(400).send({ success :false, message: "Please Upload a maximum of 5 images per product" });
        }

        const loggedInUser = req.session.user;
        if (!loggedInUser) {
            return res.status(400).send({ success :false, message: "Unauthorized User not logged in !!" });
        }

        const Schema = Joi.object({
            name: Joi.string().min(3).max(20).required(),
            code: Joi.string().min(3).max(20).required(),
            title: Joi.string().min(3).max(100).required(),
            price: Joi.number().required(),
            salePrice: Joi.number().required(),
            shortDetails: Joi.string().min(3).max(50).required(),
            description: Joi.string().min(3).max(200).required(),
            quantity: Joi.number().required(),
            discount: Joi.number().required(),
            isNewItem: Joi.boolean(),
            isSale: Joi.boolean(),
            categoryId: Joi.string().required(),
            tagId: Joi.string().required(),
            colorId: Joi.string().required(),
            sizeId: Joi.string().required(),
            imagePaths: Joi.array().required()
        });

        // const filePaths = PRODUCT_IMAGE_PATH + "/" + req.file.filename;
        let filePaths = [];
         PRODUCT_IMAGE_PATH + "/" + req.files.map(file => filePaths.push(file.filename));

        const result = Schema.validate({ ...req.body, imagePaths: filePaths });
        if (result.error) {
            return res.status(400).send({ success: false, message: result.error.details[0].message });
        }

        const product = new Product({ ...result.value, createdBy: loggedInUser.id });

        let response = await product.save();
        res.status(201).json({ success: true, message: "Product Saved Successfully !!" });
    });
}

const updateProduct = async (req, res) => {
    //Handle File Upload 
    uploadMultipleImage(req, res, async function (err) {
        if (err) {
            return res.status(400).send({ success: false, message: err.message });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).send({ success: false, message: "No File found to upload" });
        }

        if (req.files.length < 5) {
            return res.status(400).send({ success: false, message: "Please Upload a maximum of 5 images per product" });
        }

        const loggedInUser = req.session.user;
        if (!loggedInUser) {
            return res.status(400).send({ success: false, message: "Unauthorized User not logged in !!" });
        }

        const Schema = Joi.object({
            id: Joi.string().required(),
            name: Joi.string().min(2).max(20).required(),
            code: Joi.string().min(3).max(20).required(),
            title: Joi.string().min(3).max(100).required(),
            price: Joi.number().required(),
            salePrice: Joi.number().required(),
            shortDetails: Joi.string().min(3).max(50).required(),
            description: Joi.string().min(3).max(200).required(),
            quantity: Joi.number().required(),
            discount: Joi.number().required(),
            isNewItem: Joi.boolean(),
            isSale: Joi.boolean(),
            categoryId: Joi.string().required(),
            tagId: Joi.string().required(),
            colorId: Joi.string().required(),
            sizeId: Joi.string().required(),
            imagePaths: Joi.array().required()
        });

        // const filePath = PRODUCT_IMAGE_PATH + "/" + req.file.filename;
        let filePaths = [];
        PRODUCT_IMAGE_PATH + "/" + req.files.map(file => filePaths.push(file.filename));

        const result = Schema.validate({ ...req.body, imagePaths: filePaths });
        if (result.error) {
            return res.status(400).send({ success: false, message: result.error.details[0].message });
        }

        const productId = result.value.id;
        const product = await Product.findOneAndUpdate({ _id: productId }, { ...result.value, updatedBy: loggedInUser.id });

        if (!product) {
            return res.status(400).send({ success: false, message: "Something Went Wrong while updating Product" });
        }

        return res.status(201).json({ success: true, message: "Product Updated Successfully !!" });
    });
}



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
            page : page,
            pageSize : limitVal,
            total: count
        }
    });
}

const getProductById = async (req, res) => {
    const id = req.params.id;

    const product = await Product.findOne({ _id: id, isActive: true })
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
       return  res.status(402).json({ success: false, message: `Record not found to delete !!` });
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

module.exports = { saveProduct, updateProduct, deleteProduct, getProductById, getAllProducts, getProductByCategoryId }