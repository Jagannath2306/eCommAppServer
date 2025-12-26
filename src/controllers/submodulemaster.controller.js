const SubModuleMaster = require('../models/submodulemaster.model');
const Joi = require('joi');
const path = require('path');
const { createUploader } = require('../utils/uploader/createuploader');

const uploadCustomer = createUploader({
    uploadPath: path.join(__dirname, '../', process.env.MENU_ICON_IMAGE_PATH),
    fieldName: 'icon',
    maxCount: 1
});


const saveSubModuleMaster = async (req, res) => {
    //Handle File Upload 
    uploadCustomer(req, res, async function (err) {
        if (err) {
            return res.status(400).send({ success: false, message: err.message });
        }

        if (!req.file) {
            return res.status(400).send({ success: false, message: "No File found to upload" });
        }

        const loggedInUser = req.session.user;
        if (!loggedInUser) {
            return res.status(400).send({ success: false, message: "Unauthorized User not logged in !!" });
        }

        const Schema = Joi.object({
            moduleId: Joi.string().required(),
            name: Joi.string().min(2).max(20).required(),
            icon: Joi.string().required(),
            defaultActive: Joi.boolean().required(),
            menuRank: Joi.number().required(),
        });

        const filePath = `${process.env.MENU_ICON_IMAGE_PATH}/${req.file.filename}`;
        const result = Schema.validate({ ...req.body, icon: filePath });
        if (result.error) {
            return res.status(400).send({ success: false, message: result.error.details[0].message });
        }

        const submodulemaster = new SubModuleMaster({ ...result.value, createdBy: loggedInUser.id });

        let response = await submodulemaster.save();
        return res.status(201).json({ success: true, message: "SubModuleMaster Saved Successfully !!" });
    });
}

const updateSubModuleMaster = async (req, res) => {
    //Handle File Upload 
    uploadCustomer(req, res, async function (err) {
        if (err) {
            return res.status(400).send({ success: false, message: err.message });
        }

        if (!req.file) {
            return res.status(400).send({ success: false, message: "No File found to upload" });
        }

        const loggedInUser = req.session.user;
        if (!loggedInUser) {
            return res.status(400).send({ success: false, message: "Unauthorized User not logged in !!" });
        }

        const Schema = Joi.object({
            id: Joi.string().required(),
            moduleId: Joi.string().required(),
            name: Joi.string().min(2).max(20).required(),
            icon: Joi.string().required(),
            defaultActive: Joi.boolean().required(),
            menuRank: Joi.number().required(),
        });

        const filePath = `${process.env.MENU_ICON_IMAGE_PATH}/${req.file.filename}`;
        const result = Schema.validate({ ...req.body, icon: filePath });
        if (result.error) {
            return res.status(400).send({ success: false, message: result.error.details[0].message });
        }

        const submodulemaster = await SubModuleMaster.findOneAndUpdate({ _id: result.value.id }, { ...result.value, updatedBy: loggedInUser.id });

        if (!submodulemaster) {
            return res.status(400).send({ success: false, message: "Something Went Wrong while updating SubModuleMaster" });
        } else {
            return res.status(201).json({ success: true, message: "SubModuleMaster Updated Successfully !!" });
        }
    });
}

const getAllSubModuleMasters = async (req, res) => {
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

    const rows = await SubModuleMaster.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'moduleId', select: 'name icon defaultActive menuRank' })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    let count = 0;
    count = await SubModuleMaster.countDocuments({ isActive: true });
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

const getSubModuleMasterById = async (req, res) => {
const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }
    const { id } = result.value;
    const submodulemaster = await SubModuleMaster.findOne({ _id: id, isActive: true })
        .populate({ path: 'moduleId', select: 'name icon defaultActive menuRank' })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (submodulemaster) {
        res.status(200).json({ success: true, data: submodulemaster });
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}

const deleteSubModuleMaster = async (req, res) => {

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

    let isExists = await SubModuleMaster.findOne({ _id: result.value.id, isActive: true }, { name: 1 });
    if (isExists) {
        await SubModuleMaster.findOneAndUpdate({ _id: result.value.id }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "SubModuleMaster Deleted Successfully !!" });
    } else {
        res.status(402).json({ success: false, message: `Record not found to delete !!` });
        return;
    }
}

module.exports = { saveSubModuleMaster, updateSubModuleMaster, getAllSubModuleMasters, getSubModuleMasterById, deleteSubModuleMaster };