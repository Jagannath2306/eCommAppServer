const Size = require('../models/size.model');
const Joi = require('joi');

const saveSize = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user'
        });
    }

    const Schema = Joi.object({
        name: Joi.string().min(1).max(20).required(),
        code: Joi.string().min(1).max(4).required(),
    });

    const { error, value } = Schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    const name = value.name.trim().toUpperCase();
    const code = value.code.toUpperCase();

    const isExists = await Size.isExists(name);
    if (isExists) {
        return res.status(400).json({
            success: false,
            message: `Size Name ${name} already exists !!`
        });
    }

    await new Size({
        name,
        code,
        createdBy: loggedInUser.id
    }).save();

    return res.status(201).json({
        success: true,
        message: 'Size Saved Successfully !!'
    });
};

const updateSize = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user'
        });
    }

    const Schema = Joi.object({
        id: Joi.string().hex().length(24).required(),
        name: Joi.string().min(1).max(20).required(),
        code: Joi.string().min(1).max(4).required(),
    });

    const { error, value } = Schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    const sizeId = value.id;
    const name = value.name.trim().toUpperCase();
    const code = value.code.toUpperCase();

    const isExists = await Size.isExists(name, sizeId);
    if (isExists) {
        return res.status(400).json({
            success: false,
            message: `Size Name ${name} already exists !!`
        });
    }

    const updated = await Size.findOneAndUpdate(
        { _id: sizeId },
        { name, code, updatedBy: loggedInUser.id },
        { new: true }
    );

    if (!updated) {
        return res.status(404).json({
            success: false,
            message: 'Size not found'
        });
    }

    return res.status(200).json({
        success: true,
        message: 'Size Updated Successfully !!'
    });
};



const deleteSize = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user'
        });
    }

    const Schema = Joi.object({
        id: Joi.string().hex().length(24).required(),
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const id = result.value.id;

    let isExists = await Size.findOne({ _id: id, isActive: true }, { name: 1 });
    if (isExists) {
        await Size.findOneAndUpdate({ _id: id }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "Size Deleted Successfully !!" });
    } else {
        return res.status(402).json({ success: false, message: `Record not found to delete !!` });
    }
}

const getSizeById = async (req, res) => {
    const Schema = Joi.object({
        id: Joi.string().required(),
    });
    const { error, value } = Schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    const { id } = value;
    const size = await Size.findOne({ _id: id, isActive: true })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (size) {
        res.json({ success: true, data: size });
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}

const getAllSize = async (req, res) => {
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

    const rows = await Size.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    let count = 0;
    count = await Size.countDocuments({ isActive: true });
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
const getSizeList = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user'
        });
    }
    const rows = await Size.find({ isActive: true })
    return res.status(200).json({
        success: true,
        data: rows,
        message: 'Size List Fetched Successfully !!'
    });
}

module.exports = { saveSize, updateSize, deleteSize, getSizeById, getAllSize, getSizeList }