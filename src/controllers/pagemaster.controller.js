const { default: mongoose } = require('mongoose');
const PageMaster = require('../models/pagemaster.model');
const Joi = require('joi');

const savePageMaster = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(400).send({ success: false, message: "Unauthorized User not logged in !!" });
    }

    const Schema = Joi.object({
        moduleId: Joi.string().required(),
        subModuleId: Joi.string().required(),
        name: Joi.string().min(2).max(20).required(),
        icon: Joi.string().required(),
        pageCode: Joi.string().required(),
        url: Joi.string().required(),
        defaultActive: Joi.boolean().required(),
        menuRank: Joi.number().required(),
    });

    const result = Schema.validate({ ...req.body });
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const pagemaster = new PageMaster({ ...result.value, createdBy: loggedInUser.id });

    let response = await pagemaster.save();
    return res.status(201).json({ success: true, message: "PageMaster Saved Successfully !!" });
}

const updatePageMaster = async (req, res) => {
    const loggedInUser = req.session.user;
    if (!loggedInUser) {
        return res.status(400).send({ success: false, message: "Unauthorized User not logged in !!" });
    }

    const Schema = Joi.object({
        id: Joi.string().required(),
        moduleId: Joi.string().required(),
        subModuleId: Joi.string().required(),
        name: Joi.string().min(2).max(20).required(),
        icon: Joi.string().required(),
        pageCode: Joi.string().required(),
        url: Joi.string().required(),
        defaultActive: Joi.boolean().required(),
        menuRank: Joi.number().required(),
    });

    const result = Schema.validate({ ...req.body });
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const pagemaster = await PageMaster.findOneAndUpdate({ _id: result.value.id }, { ...result.value, updatedBy: loggedInUser.id });

    if (!pagemaster) {
        return res.status(400).send({ success: false, message: "Something Went Wrong while updating PageMaster" });
    } else {
        return res.status(201).json({ success: true, message: "PageMaster Updated Successfully !!" });
    }
}

const getAllPageMasters = async (req, res) => {
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

    const rows = await PageMaster.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'moduleId', select: 'name icon defaultActive menuRank' })
        .populate({ path: 'subModuleId', select: 'name icon defaultActive menuRank' })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    let count = 0;
    count = await PageMaster.countDocuments({ isActive: true });
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

const getPageMasterById = async (req, res) => {
    const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }
    const { id } = result.value;
    const pagemaster = await PageMaster.findOne({ _id: id, isActive: true })
        .populate({ path: 'moduleId', select: 'name icon defaultActive menuRank' })
        .populate({ path: 'subModuleId', select: 'name icon defaultActive menuRank' })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (pagemaster) {
        res.status(200).json({ success: true, data: pagemaster });
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}


const getPageByModuleIdBySubModuleIdByUserTypeId = async (req, res) => {
  try {
     const Schema = Joi.object({
        moduleId: Joi.string().required(),
        subModuleId: Joi.string().required(),
        userTypeId: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }
    
        const { moduleId, subModuleId, userTypeId } = req.body; // or req.query

        // 1. Validate ObjectIds to prevent "splitPath" or casting errors
        if (!mongoose.Types.ObjectId.isValid(moduleId) || 
            !mongoose.Types.ObjectId.isValid(subModuleId) || 
            !mongoose.Types.ObjectId.isValid(userTypeId)) {
            return res.status(400).json({ success: false, message: "Invalid IDs provided" });
        }

        const data = await PageMaster.aggregate([
            {
                $match: {
                    moduleId: new mongoose.Types.ObjectId(moduleId),
                    subModuleId: new mongoose.Types.ObjectId(subModuleId),
                    isActive: true
                }
            },
            // 🔗 Join with permissions for the specific User Type
            {
                $lookup: {
                    from: 'rolepagepermissions',
                    let: { pageId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$pageId', '$$pageId'] },
                                        { $eq: ['$userTypeId', new mongoose.Types.ObjectId(userTypeId)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'existingPermission'
                }
            },
            {
                $addFields: {
                    // If a record exists, take its actions. Otherwise, return empty strings/bools
                    // This allows your frontend to bind to these fields immediately
                    actions: {
                        $ifNull: [{ $arrayElemAt: ['$existingPermission.actions', 0] }, {
                            create: false,
                            view: false,
                            edit: false,
                            delete: false
                        }]
                    }
                }
            },
            {
                $project: {
                    name: 1,
                    pageCode: 1,
                    actions: 1,
                    moduleId: 1,
                    subModuleId: 1
                }
            },
            { $sort: { menuRank: 1 } }
        ]);

        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const deletePageMaster = async (req, res) => {

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

    let isExists = await PageMaster.findOne({ _id: result.value.id, isActive: true }, { name: 1 });
    if (isExists) {
        await PageMaster.findOneAndUpdate({ _id: result.value.id }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "PageMaster Deleted Successfully !!" });
    } else {
        res.status(402).json({ success: false, message: `Record not found to delete !!` });
        return;
    }
}

module.exports = {
    savePageMaster,
    updatePageMaster,
    getAllPageMasters,
    getPageMasterById,
    deletePageMaster,
    getPageByModuleIdBySubModuleIdByUserTypeId
};