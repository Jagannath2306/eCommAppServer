const ProductVariant = require('../models/productvariant.model');
const Product = require('../models/product.model');
const Color = require('../models/color.model');
const Size = require('../models/size.model');
const Joi = require('joi');
const { default: mongoose } = require('mongoose');

const saveProductVariant = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user'
        });
    }

    const Schema = Joi.object({
        productId: Joi.string().hex().length(24).required(),
        colorId: Joi.string().hex().length(24).required(),
        sizeId: Joi.string().hex().length(24).required(),
        price: Joi.number().positive().required(),
        stock: Joi.number().integer().min(0).required()
    });

    const result = Schema.validate(req.body);

    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const { productId, colorId, sizeId, price, stock } = result.value;

    // Fetch codes for SKU
    const product = await Product.findById(productId).select('code');
    const color = await Color.findById(colorId).select('code');
    const size = await Size.findById(sizeId).select('code');

    if (!product || !color || !size) {
        return res.status(400).json({
            success: false,
            message: 'Invalid product / color / size'
        });
    }

    const sku = `${product.code}-${color.code}-${size.code}`.toUpperCase();

    // Prevent duplicate variant
    const exists = await ProductVariant.findOne({
        productId,
        colorId,
        sizeId
    });

    if (exists) {
        return res.status(400).json({
            success: false,
            message: 'Variant already exists'
        });
    }

    const variant = await ProductVariant.create({
        productId,
        colorId,
        sizeId,
        sku,
        price,
        stock,
        createdBy: loggedInUser.id
    });

    res.status(201).json({
        success: true,
        message: 'Product Variant created successfully',
        data: variant
    });
};

const updateProductVariant = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user'
        });
    }

    const Schema = Joi.object({
        id: Joi.string().hex().length(24).required(),
        price: Joi.number().positive().required(),
        stock: Joi.number().integer().min(0).required(),
    });

    const result = Schema.validate(req.body);

    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }
    const { id, ...updateData } = result.value;

    const variant = await ProductVariant.findById(id);
    if (!variant) {
        return res.status(404).json({
            success: false,
            message: 'Product Variant not found'
        });
    }

    await ProductVariant.findByIdAndUpdate(
        id,
        {
            ...updateData,
            updatedBy: loggedInUser.id
        },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: 'Product Variant updated successfully'
    });
};

const getAllProductVariant = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user'
        });
    }
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

    const rows = await ProductVariant.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    let count = 0;
    count = await ProductVariant.countDocuments({ isActive: true });
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

const getProductVariantById = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user'
        });
    }

    const schema = Joi.object({
        id: Joi.string().required()
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }
    const { id } = result.value;

    const variant = await ProductVariant.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id), isActive: true } },

        // Join with Products
        {
            $lookup: {
                from: 'products', // ensure this matches your DB collection name
                localField: 'productId',
                foreignField: '_id',
                as: 'productData'
            }
        },
        { $unwind: '$productData' },

        // Join with Colors
        {
            $lookup: {
                from: 'colors',
                localField: 'colorId',
                foreignField: '_id',
                as: 'colorData'
            }
        },
        { $unwind: { path: '$colorData', preserveNullAndEmptyArrays: true } },

        {
            $lookup: {
                from: 'sizes',
                localField: 'sizeId',
                foreignField: '_id',
                as: 'sizeData'
            }
        },
        { $unwind: { path: '$sizeData', preserveNullAndEmptyArrays: true } },

        {
            $lookup: {
                from: 'usermasters',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'userData'
            }
        },
        { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },

        // 1. "Flatten" the fields to the top level
        {
            $project: {
                _id: 1,
                price: 1,
                stock: 1,
                isActive: 1,
                sku: 1,
                updatedOn: 1,
                createdOn: 1,
                productName: '$productData.name',
                imagePath: { $arrayElemAt: ['$productData.imagePaths', 0] },
                productPrice: '$productData.price',
                productSalePrice: '$productData.salePrice',
                productShortDetails: '$productData.shortDetails',
                productDetails: '$productData.description',
                productTitle: '$productData.title',
                colorName: '$colorData.name',
                colorValue: '$colorData.color',
                size: '$sizeData.name',
               createdBy: { $concat: ["$userData.firstName", " ", "$userData.lastName"] },
            }
        }
    ]);
    if (variant) {
        res.status(200).json({ success: true, data: variant[0], message: "Product Variant fetched successfully" });
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}

const deleteProductVariant = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user'
        });
    }

    const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const variantId = result.value.id;

    let isExists = await ProductVariant.findOne({ _id: variantId, isActive: true }, { name: 1 });
    if (isExists) {
        await ProductVariant.findOneAndUpdate({ _id: variantId }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "Color Deleted Successfully !!" });
    } else {
        res.status(402).json({ success: false, message: `Record not found to delete !!` });
        return;
    }
}

const getVariants = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user'
        });
    }

    const rows = await ProductVariant.aggregate([
        { $match: { isActive: true } },

        // Join with Products
        {
            $lookup: {
                from: 'products', // ensure this matches your DB collection name
                localField: 'productId',
                foreignField: '_id',
                as: 'productData'
            }
        },
        { $unwind: '$productData' },

        // Join with Colors
        {
            $lookup: {
                from: 'colors',
                localField: 'colorId',
                foreignField: '_id',
                as: 'colorData'
            }
        },
        { $unwind: { path: '$colorData', preserveNullAndEmptyArrays: true } },

        {
            $lookup: {
                from: 'sizes',
                localField: 'sizeId',
                foreignField: '_id',
                as: 'sizeData'
            }
        },
        { $unwind: { path: '$sizeData', preserveNullAndEmptyArrays: true } },

        // 1. "Flatten" the fields to the top level
        {
            $project: {
                _id: 1,
                price: 1,
                stock: 1,
                isActive: 1,
                sku: 1,
                productName: '$productData.name',
                imagePath: { $arrayElemAt: ['$productData.imagePaths', 0] },
                discount: '$productData.discount',
                colorName: '$colorData.name',
                colorValue: '$colorData.color',
                size: '$sizeData.name'
            }
        }
    ]);
    return res.status(200).json({
        success: true,
        data: rows,
        message: "Variant fetched successfully"
    });
}
module.exports = {
    saveProductVariant,
    updateProductVariant,
    getAllProductVariant,
    getProductVariantById,
    deleteProductVariant,
    getVariants
}