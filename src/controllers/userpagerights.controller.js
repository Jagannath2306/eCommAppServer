const UserPageRights = require('../models/userpagerights.model');
const Joi = require('joi');

const ModuleMaster = require('../models/modulemaster.model');
const SubModuleMaster = require('../models/submodulemaster.model');
const PageMaster = require('../models/pagemaster.model');
const User = require('../models/user.model')

const saveUserPageRights = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(400).send({ success: false, message: "Unauthorized User not logged in !!" });
    }
    const Schema = Joi.object({
        userId: Joi.string().required(),
        moduleId: Joi.string().required(),
        subModuleId: Joi.string().required(),
        pageIds: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const { userId, moduleId, subModuleId, pageIds } = result.value;
    const pageIdsArray = pageIds.split(',').map((id) => id.trim());

    if (pageIdsArray.length === 0) {
        return res.status(400).json({ success: false, message: 'pageIds required' });
    }
    let isExistsRights = await UserPageRights.find({ userId, moduleId, subModuleId, isActive: true });

    if (isExistsRights.length === 0) {
        for (let pageId of pageIdsArray) {
            const userpagerights = new UserPageRights({ userId, moduleId, subModuleId, pageIds: pageId, createdBy: loggedInUser.id });
            await userpagerights.save();
        }
        return res.status(201).json({ success: true, message: "Rights Saved Successfully !!" });
    } else {
        return res.status(400).send({ success: false, message: "Rights already assigned to this user for the selected module !!" });
    }
}

const updateUserPageRights = async (req, res) => {
    const loggedInUser = req.session.user;
    if (!loggedInUser) {
        return res.status(400).send({
            success: false,
            message: "Unauthorized User not logged in !!"
        });
    }

    const Schema = Joi.object({
        userId: Joi.string().required(),
        moduleId: Joi.string().required(),
        subModuleId: Joi.string().required(),
        pageIds: Joi.string().required() // comma separated
    });

    const { error, value } = Schema.validate(req.body);
    if (error) {
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });
    }

    const { userId, moduleId, subModuleId, pageIds } = value;
    const pageIdsArray = pageIds.split(',').map(id => id.trim());

    const existingRights = await UserPageRights.find({
        userId,
        moduleId,
        isActive: true
    });

    if (existingRights.length === 0) {
        return res.status(400).send({
            success: false,
            message: "No existing rights found to update for this user and module !!"
        });
    }

    // Remove old rights
    await UserPageRights.deleteMany({ userId, moduleId, subModuleId, isActive: true });

    // Insert new rights
    const newRights = pageIdsArray.map(pageId => ({
        userId,
        moduleId,
        subModuleId,
        pageIds: pageId,
        createdBy: loggedInUser.id
    }));

    await UserPageRights.insertMany(newRights);

    res.status(201).json({
        success: true,
        message: "User Rights Updated Successfully !!"
    });
};


const getAllUserPageRights = async (req, res) => {
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

    const rows = await UserPageRights.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'userId', select: 'firstName lastName email' })
        .populate({ path: 'moduleId', select: 'name icon defaultActive menuRank' })
        .populate({ path: 'subModuleId', select: 'name icon defaultActive menuRank' })
        .populate({ path: 'pageIds', select: 'name url icon defaultActive menuRank' })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    let count = 0;
    count = await UserPageRights.countDocuments({ isActive: true });
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

const getUserPageRightsById = async (req, res) => {
    const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }
    const { id } = result.value;
    const userpagerights = await UserPageRights.findOne({ _id: id, isActive: true })
        .populate({ path: 'userId', select: 'firstName lastName email' })
        .populate({ path: 'moduleId', select: 'name icon defaultActive menuRank' })
        .populate({ path: 'subModuleId', select: 'name icon defaultActive menuRank' })
        .populate({ path: 'pageIds', select: 'name url icon defaultActive menuRank' })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (userpagerights) {
        res.status(200).json({ success: true, data: userpagerights });
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}


const getPageRightsByUserAndModule = async (req, res) => {
    const Schema = Joi.object({
        userId: Joi.string().required(),
        moduleId: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ error: result.error.details[0].message });
    }

    const { userId, moduleId } = result.value;

    const userRights = await UserPageRights.find({ userId, moduleId, isActive: true })
        .populate({ path: 'userId', select: 'firstName lastName email' })
        .populate({ path: 'moduleId', select: 'name icon defaultActive menuRank' })
        .populate({ path: 'subModuleId', select: 'name icon defaultActive menuRank' })
        .populate({ path: 'pageIds', select: 'name url icon defaultActive menuRank' })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (userRights.length > 0) {
        res.status(200).json({ success: true, data: userRights });
    } else {
        res.status(200).json({ data: [], message: 'No Data found' })
    }
}

const getPageRightsByUser = async (req, res) => {
    const Schema = Joi.object({
        email: Joi.string().required()
    });
    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ error: result.error.details[0].message });
    }

    const { email } = result.value;

    const user = await User.findOne({ email, isActive: true });
    
    if (!user) {
        return res.status(400).json({ success: false, message: 'No Data found' })
    } {
        const userRights = await UserPageRights.find({ userId: user._id, isActive: true })
            .populate({ path: 'userId', select: 'firstName lastName email' })
            .populate({ path: 'moduleId', select: 'name icon defaultActive menuRank url' })
            .populate({ path: 'subModuleId', select: 'name icon defaultActive menuRank url' })
            .populate({ path: 'pageIds', select: 'name url icon defaultActive menuRank' })
            .populate({ path: 'createdBy', select: 'firstName lastName email' })
            .populate({ path: 'updatedBy', select: 'firstName lastName email' });
        if (userRights.length > 0) {
            res.status(200).json({ success: true, data: userRights });
        } else {
            res.status(400).json({ data: [], message: 'No Data found' })
        }
    }
}

const getMenusByUser = async (req, res) => {
    const Schema = Joi.object({
        email: Joi.string().required()
    });
    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ error: result.error.details[0].message });
    }

    const { email } = result.value;

    const user = await User.findOne({ email, isActive: true });
    
    if (!user) {
        return res.status(400).json({ success: false, message: 'No Data found' })
    } {
        const userRights = await UserPageRights.find({ userId: user._id, isActive: true })
            .populate({ path: 'moduleId', select: 'name icon defaultActive menuRank url' })
            .populate({ path: 'subModuleId', select: 'name icon defaultActive menuRank url' })
            .populate({ path: 'pageIds', select: 'name icon defaultActive menuRank url' })
        if (userRights.length > 0) {
            res.status(200).json({ success: true, data: userRights });
        } else {
            res.status(400).json({ data: [], message: 'No Data found' })
        }
    }
}

//'67acc45b6cfb92d061042d9c:1;67acca6a4e64854c9c3bf353:2;67af654d94c2dfab1714c158:3'
const fun_split_string_to_columns = (str) => {
    return str.split(';').map((pair) => {
        const [val1, val2] = pair.split(':').map((id) => id.trim());
        return { val1, val2 };
    })
}



const updateMenuConfig = async (req, res) => {
    const Schema = Joi.object({
        moduleIds: Joi.string().required(),
        subModuleIds: Joi.string().required(),
        pageIds: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ error: result.error.details[0].message });
    }

    const moduleIdsArr = fun_split_string_to_columns(result.value.moduleIds);
    const subModuleIdsArr = fun_split_string_to_columns(result.value.subModuleIds);
    const pageIdsArr = fun_split_string_to_columns(result.value.pageIds);

    const moduleResponse = moduleIdsArr.map(async (item) => {
        await ModuleMaster.findOneAndUpdate(
            { _id: item.val1, isActive: true },
            { $set: { menuRank: parseInt(item.val2) } }
        )
    });

    const subModuleResponse = subModuleIdsArr.map(async (item) => {
        await SubModuleMaster.findOneAndUpdate(
            { _id: item.val1, isActive: true },
            { $set: { menuRank: parseInt(item.val2) } }
        )
    });

    const pageResponse = pageIdsArr.map(async (item) => {
        await PageMaster.findOneAndUpdate(
            { _id: item.val1, isActive: true },
            { $set: { menuRank: parseInt(item.val2) } }
        )
    });


    await Promise.all([
        ...moduleResponse,
        ...subModuleResponse,
        ...pageResponse
    ]);

    res.status(200).json({ message: 'Menu Configuration Updated SuccessfullY !!' })
}
module.exports = { saveUserPageRights, updateUserPageRights, getAllUserPageRights, getUserPageRightsById, getPageRightsByUserAndModule, getPageRightsByUser, updateMenuConfig,getMenusByUser };