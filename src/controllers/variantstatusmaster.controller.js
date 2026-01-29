const VariantStatusMaster = require('../models/variantstatusmaster.model');
const Joi = require('joi');

const saveVariantStatusMaster = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        code: Joi.string()
            .uppercase()
            .trim()
            .min(3)
            .max(20)
            .required(),
        name: Joi.string()
            .trim()
            .min(2)
            .max(50)
            .required(),
        color: Joi.string()
            .pattern(/^#([0-9A-Fa-f]{6})$/)
            .required(),
        description: Joi.string()
            .max(200)
            .required(),
        isSelectable: Joi.boolean().required(),
        isSellable: Joi.boolean().required(),
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }
    if (!loggedInUser || !loggedInUser.id) {
        return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const statusLength = await VariantStatusMaster.countDocuments() || 0;

    const name = result.value.name;

    let isExist = await VariantStatusMaster.isExists(name);
    if (!isExist) {
        let variantstatusmaster = await new VariantStatusMaster({ ...result.value, sortOrder: statusLength + 1, createdBy: loggedInUser.id }).save();
        res.status(201).json({ success: true, message: "Variant Status Master  Saved Successfully !!" });
    } else {
        return res.status(400).json({ success: false, message: `Variant Status Master  Name ${name} already exists !!` });
    }
}


const updateVariantStatusMaster = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        id: Joi.string().required(),
        code: Joi.string()
            .uppercase()
            .trim()
            .min(3)
            .max(20)
            .required(),
        name: Joi.string()
            .trim()
            .min(2)
            .max(50)
            .required(),
        color: Joi.string()
            .pattern(/^#([0-9A-Fa-f]{6})$/)
            .required(),
        description: Joi.string()
            .max(200)
            .required(),
        isSelectable: Joi.boolean().required(),
        isSellable: Joi.boolean().required(),
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
    const status = await VariantStatusMaster.findOne({ _id: id });

    let isExists = await VariantStatusMaster.isExists(name, id);
    if (!isExists) {
        await VariantStatusMaster.findOneAndUpdate({ _id: id }, { ...result.value, sortOrder: status.sortOrder, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "Variant Status Master  Updated Successfully !!" });
    } else {
        return res.status(400).json({ success: false, message: `Variant Status Master  Name ${name} already exists !!` });
    }
}

const getAllVariantStatusMaster = async (req, res) => {
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

    const rows = await VariantStatusMaster.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    let count = 0;
    count = await VariantStatusMaster.countDocuments({ isActive: true });
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


const getVariantStatusMasterById = async (req, res) => {
    const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }
    const id = result.value.id;

    const variantstatusmaster = await VariantStatusMaster.findOne({ _id: id, isActive: true })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (variantstatusmaster) {
        res.status(200).json({ success: true, data: variantstatusmaster });
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}

const deleteVariantStatusMaster = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const id = result.value.id;

    let isExists = await VariantStatusMaster.findOne({ _id: id, isActive: true }, { name: 1 });
    if (isExists) {
        await VariantStatusMaster.findOneAndUpdate({ _id: id }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "Variant Status Master  Deleted Successfully !!" });
    } else {
        return res.status(402).json({ success: false, message: `Record not found to delete !!` });
    }
}

const getVariantStatusList = async (req, res) => {
    try {
        const loggedInUser = req.session.user;

        if (!loggedInUser) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized user'
            });
        }

        const rows = await VariantStatusMaster.find({ isActive: true })
        return res.status(200).json({
            success: true,
            data: rows,
            message: "Status list fetched successfully"
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

module.exports = {
    saveVariantStatusMaster,
    updateVariantStatusMaster,
    getAllVariantStatusMaster,
    getVariantStatusMasterById,
    deleteVariantStatusMaster,
    getVariantStatusList
};