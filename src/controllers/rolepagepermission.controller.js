const RolePermission = require('../models/rolepagepermission.modal');
const Joi = require('joi');

const saveRolePermission = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(400).send({ success: false, message: "Unauthorized User not logged in !!" });
    }

    const Schema = Joi.object({
        userTypeId: Joi.string().required(),
        pageId: Joi.string().min(2).max(50).required(),
        actions: Joi.array()
            .items(Joi.string().valid('view', 'create', 'edit', 'delete', "approve", "reject", "block", "unblock"))
            .min(1)
            .required()
    });

    const result = Schema.validate({ ...req.body });
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const rolePermission = new RolePermission({ ...result.value, createdBy: loggedInUser.id });

    let response = await rolePermission.save();
    return res.status(201).json({ success: true, message: "Role Permission Saved Successfully !!" });
}

const updateRolePermission = async (req, res) => {
    const loggedInUser = req.session.user;
    if (!loggedInUser) {
        return res.status(400).send({ success: false, message: "Unauthorized User not logged in !!" });
    }

    const Schema = Joi.object({
        id: Joi.string().required(),
        userTypeId: Joi.string().required(),
        pageId: Joi.string().min(2).max(50).required(),
        actions: Joi.array()
            .items(Joi.string().valid('view', 'create', 'edit', 'delete', "approve", "reject", "block", "unblock"))
            .min(1)
            .required()
    });

    const result = Schema.validate({ ...req.body });
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const rolePermission = await RolePermission.findOneAndUpdate({ _id: result.value.id }, { ...result.value, updatedBy: loggedInUser.id });

    if (!rolePermission) {
        return res.status(400).send({ success: false, message: "Something Went Wrong while updating Role Permission" });
    } else {
        return res.status(201).json({ success: true, message: "Role Permission Updated Successfully !!" });
    }
}

const getAllRolePermission = async (req, res) => {
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

    const rows = await RolePermission.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'userTypeId', select: 'name' })
        .populate({ path: 'pageId', select: 'name icon defaultActive menuRank, url' })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    let count = 0;
    count = await RolePermission.countDocuments({ isActive: true });
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

const getRolePermissionById = async (req, res) => {
    const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }
    const { id } = result.value;
    const rolePermission = await RolePermission.findOne({ _id: id, isActive: true })
        .populate({ path: 'userTypeId', select: 'name' })
        .populate({ path: 'pageId', select: 'name icon defaultActive menuRank, url' })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (rolePermission) {
        res.status(200).json({ success: true, data: rolePermission, message: "Role Permission fetched successfully" });
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}

const deleteRolePermission = async (req, res) => {

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

    let isExists = await RolePermission.findOne({ _id: result.value.id, isActive: true }, { name: 1 });
    if (isExists) {
        await RolePermission.findOneAndUpdate({ _id: result.value.id }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "Role Permission Deleted Successfully !!" });
    } else {
        res.status(402).json({ success: false, message: `Record not found to delete !!` });
        return;
    }
}

module.exports = { saveRolePermission, updateRolePermission, getAllRolePermission, getRolePermissionById, deleteRolePermission };