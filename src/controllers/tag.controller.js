const Tag = require('../models/tag.model');
const Joi = require('joi');

const saveTag = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user'
        });
    }

    const Schema = Joi.object({
        name: Joi.string().min(2).max(20).required()
    });

    const { error, value } = Schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    const name = value.name.trim().toLowerCase();

    const isExists = await Tag.isExists(name);
    if (isExists) {
        return res.status(400).json({
            success: false,
            message: `Tag name "${name}" already exists`
        });
    }

    const tag = new Tag({
        name,
        createdBy: loggedInUser.id
    });

    await tag.save();

    return res.status(201).json({
        success: true,
        message: 'Tag saved successfully'
    });
};


const updateTag = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
        });
    }

    const schema = Joi.object({
        id: Joi.string().hex().length(24).required(),
        name: Joi.string().min(2).max(20).required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    const tagId = value.id;
    const name = value.name.trim().toLowerCase();

    const exists = await Tag.isExists(name, tagId);
    if (exists) {
        return res.status(400).json({
            success: false,
            message: `Tag name "${name}" already exists`
        });
    }

    const updated = await Tag.findOneAndUpdate(
        { _id: tagId },
        { name, updatedBy: loggedInUser.id },
        { new: true }
    );

    if (!updated) {
        return res.status(404).json({
            success: false,
            message: "Tag not found"
        });
    }

    return res.status(200).json({
        success: true,
        message: "Tag updated successfully"
    });
};


const deleteTag = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
        });
    }

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
            page: page,
            pageSize: limitVal,
            total: count
        }
    });
}

const getTags = async (req, res) => {
    const tags = await Tag.find({ isActive: true }, { _id: 1, name: 1 })
    return res.status(200).json({
        success: true,
        data: tags,
        message: "Tags fetched successfully"
    });
}
module.exports = { saveTag, updateTag, deleteTag, getTagById, getAllTags, getTags }