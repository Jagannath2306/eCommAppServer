const ModuleMaster = require('../models/modulemaster.model');
const Joi = require('joi');
const path = require('path');

const saveModuleMaster = async (req, res) => {
    console.log(req.body)
        const loggedInUser = req.session.user;
        if (!loggedInUser) {
            return res.status(400).send({ success: false, message: "Unauthorized User not logged in !!" });
        }
        const Schema = Joi.object({
            name: Joi.string().min(2).max(20).required(),
            icon: Joi.string().required(),
            url: Joi.string().required(),
            defaultActive: Joi.boolean().required(),
            menuRank: Joi.number().required(),
        });
        const result = Schema.validate(req.body);
        if (result.error) {
            return res.status(400).send({ success: false, message: result.error.details[0].message });
        }

        const modulemaster = new ModuleMaster({ ...result.value, createdBy: loggedInUser.id });

        let response = await modulemaster.save();
        return res.status(201).json({ success: true, message: "ModuleMaster Saved Successfully !!" });
}

const updateModuleMaster = async (req, res) => {
        const loggedInUser = req.session.user;
        if (!loggedInUser) {
            return res.status(400).send({ success: false, message: "Unauthorized User not logged in !!" });
        }

        const Schema = Joi.object({
            id: Joi.string().required(),
            name: Joi.string().min(2).max(20).required(),
            icon: Joi.string().required(),
            url: Joi.string().required(),
            defaultActive: Joi.boolean().required(),
            menuRank: Joi.number().required(),
        });

        const result = Schema.validate({...req.body});
        if (result.error) {
            return res.status(400).send({ success: false, message: result.error.details[0].message });
        }

        const modulemaster = await ModuleMaster.findOneAndUpdate({ _id: result.value.id }, { ...result.value, updatedBy: loggedInUser.id });

        if (!modulemaster) {
            return res.status(400).send({ success: false, message: "Something Went Wrong while updating ModuleMaster" });
        } else {
            return res.status(201).json({ success: true, message: "ModuleMaster Updated Successfully !!" });
        }
}

const getAllModuleMasters = async (req, res) => {
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

    const rows = await ModuleMaster.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    let count = 0;
    count = await ModuleMaster.countDocuments({ isActive: true });
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

const getModuleMasterById = async (req, res) => {
const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }
    const { id } = result.value;
    const modulemaster = await ModuleMaster.findOne({ _id: id, isActive: true })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (modulemaster) {
        res.status(200).json({ success: true, data: modulemaster });
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}

const deleteModuleMaster = async (req, res) => {

    const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }
    const loggedInUser = req.session.user;
    if (!loggedInUser) {
        return res.status(400).send({ success: false, message: "Unauthorized User not logged in !!" });
    }

    let isExists = await ModuleMaster.findOne({ _id: result.value.id, isActive: true }, { name: 1 });
    if (isExists) {
        await ModuleMaster.findOneAndUpdate({ _id: result.value.id }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "ModuleMaster Deleted Successfully !!" });
    } else {
        res.status(402).json({ success: false, message: `Record not found to delete !!` });
        return;
    }
}

module.exports = { saveModuleMaster, updateModuleMaster, getAllModuleMasters, getModuleMasterById, deleteModuleMaster };