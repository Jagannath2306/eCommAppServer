const UserType = require('../models/usertype.model');
const Joi = require('joi');

const saveUserType = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        name: Joi.string().min(2).max(20).required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({success :false, message: result.error.details[0].message });
    }

    const name = result.value.name;
    const usertype = new UserType({ name: name, createdBy: loggedInUser.id });

    let isExists = await UserType.isExists(name);
    if (!isExists) {
        let result = await usertype.save();
        res.status(201).json({ success: true, data: result });
    } else {
       return res.status(400).json({ success: false, message: `UserType Name ${name} already exists !!` });
    }
}


const updateUserType = async (req, res) => {
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


    let isExists = await UserType.isExists(name, userTypeId);
    if (!isExists) {
        await UserType.findOneAndUpdate({ _id: userTypeId }, { name: name, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "UserType Updated Successfully !!" });
    } else {
       return res.status(400).json({ success: false, message: `UserType Name ${name} already exists !!` });
    }
}


const deleteUserType = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const userTypeId = result.value.id;

    let isExists = await UserType.findOne({ _id: userTypeId, isActive: true }, { name: 1 });
    if (isExists) {
        await UserType.findOneAndUpdate({ _id: userTypeId }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "UserType Deleted Successfully !!" });
    } else {
       return res.status(402).json({ success: false, message: `Record not found to delete !!` });
    }
}

const getUserTypeById = async (req, res) => {
    const id = req.params.id;

    const usertype = await UserType.findOne({ _id: id, isActive: true })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (usertype) {
        res.json({ success: true, data: usertype });
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}

const getAllUserType = async (req, res) => {
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

    const rows = await UserType.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    let count = 0;
    count = await UserType.countDocuments({ isActive: true });
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

module.exports = { saveUserType, updateUserType, deleteUserType, getUserTypeById, getAllUserType }