const ProductMasterStatus = require('../models/productmasterstatus.model');
const Joi = require('joi');

const saveProductMasterStatus = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        name: Joi.string().min(2).max(20).required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }
    if (!loggedInUser || !loggedInUser.id) {
        return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const name = result.value.name;
    let isExist = await ProductMasterStatus.isExists(name);
    if (!isExist) {
        let productmasterstatus = await new ProductMasterStatus({ ...result.value, createdBy: loggedInUser.id }).save();
        res.status(201).json({ success: true, message: "Product Master Status Saved Successfully !!" });
    } else {
        return res.status(400).json({ success: false, message: `Product Master Status Name ${name} already exists !!` });
    }
}


const updateProductMasterStatus = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().min(2).max(20).required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    if (!loggedInUser || !loggedInUser.id) {
        return res.status(401).json({ success: false, message: "Unauthorized access" });
    }
    const name = result.value.name;
    const id = result.value.id;


    let isExists = await ProductMasterStatus.isExists(name, id);
    if (!isExists) {
        await ProductMasterStatus.findOneAndUpdate({ _id: id }, { name: name, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "Product Master Status Updated Successfully !!" });
    } else {
       return res.status(400).json({ success: false, message: `Product Master Status Name ${name} already exists !!` });
    }
}

const getAllProductMasterStatus = async (req, res) => {
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

    const rows = await ProductMasterStatus.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    let count = 0;
    count = await ProductMasterStatus.countDocuments({ isActive: true });
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


const getProductMasterStatusById = async (req, res) => {
    const id = req.body.id;

    const productmasterstatus = await ProductMasterStatus.findOne({ _id: id, isActive: true })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (productmasterstatus) {
        res.status(200).json({success: true, data: productmasterstatus});
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}

const deleteSize = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const userTypeId = result.value.id;

    let isExists = await Size.findOne({ _id: userTypeId, isActive: true }, { name: 1 });
    if (isExists) {
        await Size.findOneAndUpdate({ _id: userTypeId }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "Size Deleted Successfully !!" });
    } else {
      return  res.status(402).json({ success: false, message: `Record not found to delete !!` });
    }
}

module.exports = { saveSize, updateSize, deleteSize, getSizeById, getAllSize }