const Color = require('../models/color.model');
const Joi = require('joi');

const saveColor = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        code: Joi.string().min(2).max(10).required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    const name = value.name.trim().toLowerCase();
    const code = value.code.trim().toUpperCase();

    const exists = await Color.isExists(name, code);
    if (exists) {
        return res.status(400).json({
            success: false,
            message: `Color name '${name}' or code '${code}' already exists`
        });
    }

    const color = new Color({
        name,
        code,
        createdBy: loggedInUser.id
    });

    await color.save();

    return res.status(201).json({
        success: true,
        message: "Color saved successfully"
    });
};

const updateColor = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const schema = Joi.object({
        id: Joi.string().hex().length(24).required(),
        name: Joi.string().min(3).max(20).required(),
        code: Joi.string().min(2).max(10).required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    const name = value.name.trim().toLowerCase();
    const code = value.code.trim().toUpperCase();
    const colorId = value.id;

    const color = await Color.findById(colorId);
    if (!color) {
        return res.status(404).json({
            success: false,
            message: "Color not found"
        });
    }

    const exists = await Color.isExists(name, code, colorId);
    if (exists) {
        return res.status(400).json({
            success: false,
            message: `Color name '${name}' or code '${code}' already exists`
        });
    }

    await Color.findByIdAndUpdate(
        colorId,
        {
            name,
            code,
            updatedBy: loggedInUser.id
        }
    );

    return res.status(200).json({
        success: true,
        message: "Color updated successfully"
    });
};


const getAllColors = async (req, res) => {
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

    const rows = await Color.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    let count = 0;
    count = await Color.countDocuments({ isActive: true });
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

const getColorById = async (req, res) => {
    const id = req.params.id;

    const color = await Color.findOne({ _id: id, isActive: true })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (color) {
        res.status(200).json({ success: true, data: color });
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}

const deleteColor = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const colorId = result.value.id;

    let isExists = await Color.findOne({ _id: colorId, isActive: true }, { name: 1 });
    if (isExists) {
        await Color.findOneAndUpdate({ _id: colorId }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "Color Deleted Successfully !!" });
    } else {
        res.status(402).json({ success: false, message: `Record not found to delete !!` });
        return;
    }
}

module.exports = { saveColor, updateColor, deleteColor, getColorById, getAllColors }