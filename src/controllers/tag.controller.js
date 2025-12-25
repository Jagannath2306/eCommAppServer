const Tag = require('../models/tag.model');
const Joi = require('joi');

const saveTag = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        name: Joi.string().min(2).max(20).required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const name = result.value.name;
    const tag = new Tag({ name: name, createdBy: loggedInUser.id });

    let isExists = await Tag.isExists(name);
    if (!isExists) {
        let result = await tag.save();
        res.status(201).json({ success: true, message: "Tag Saved Successfully !!" });
    } else {
      return res.status(400).json({ success: false, message: `Tag Name ${name} already exists !!` });
    }
}


const updateTag = async (req, res) => {
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
    const tagId = result.value.id;


    let isExists = await Tag.isExists(name, tagId);
    if (!isExists) {
        await Tag.findOneAndUpdate({ _id: tagId }, { name: name, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "Tag Updated Successfully !!" });
    } else {
        return res.status(400).json({ success: false, message: `Tag Name ${name} already exists !!` });
    }
}


const deleteTag = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const tagId = result.value.id;

    let isExists = await Tag.findOne({ _id: tagId, isActive: true }, { name: 1 });
    if (isExists) {
        await Tag.findOneAndUpdate({ _id: tagId }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "Tag Deleted Successfully !!" });
    } else {
        return res.status(402).json({ success: false, message: `Record not found to delete !!` });
    }
}

const getTagById = async (req, res) => {
    const id = req.params.id;

    const tag = await Tag.findOne({ _id: id, isActive: true })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (tag) {
        res.json({ success: true, data: tag });
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}

const getAllTags = async (req, res) => {
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

    const rows = await Tag.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    let count = 0;
    count = await Tag.countDocuments({ isActive: true });
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

module.exports = { saveTag, updateTag, deleteTag, getTagById, getAllTags }