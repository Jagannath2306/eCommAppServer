const Size = require('../models/size.model');
const Joi = require('joi');

const saveSize = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        name: Joi.string().min(2).max(20).required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success :false, message: result.error.details[0].message });
    }

    const name = result.value.name;
    const size = new Size({ name: name, createdBy: loggedInUser.id });

    let isExists = await Size.isExists(name);
    if (!isExists) {
        let result = await size.save();
        res.status(201).json({ success: true, message: "Size Saved Successfully !!" });
    } else {
return res.status(400).json({ success: false, message: `Size Name ${name} already exists !!` });
    }
}


const updateSize = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().min(2).max(20).required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const name = result.value.name;
    const userTypeId = result.value.id;


    let isExists = await Size.isExists(name, userTypeId);
    if (!isExists) {
        await Size.findOneAndUpdate({ _id: userTypeId }, { name: name, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "Size Updated Successfully !!" });
    } else {
        return res.status(400).json({ success: false, message: `Size Name ${name} already exists !!` });
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
     return res.status(402).json({ success: false, message: `Record not found to delete !!` });
    }
}

const getSizeById = async (req, res) => {
    const id = req.params.id;

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
            page : page,
            pageSize : limitVal,
            total: count
        }
    });
}

module.exports = { saveSize, updateSize, deleteSize, getSizeById, getAllSize }