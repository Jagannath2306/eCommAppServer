const ContactUs = require("../models/contactus.model.js");
const Joi = require('joi');

function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(20).required(),
        lastName: Joi.string().min(2).max(20).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        message: Joi.string().min(40).required()
    });

    const result = schema.validate(user);
    return result;
}

const addContactUs = async (req, res) => {
    const result = validateUser(req.body);

    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    await new ContactUs(result.value).save();
    res.status(201).json({ success: true, message: "Contact Us Added Successfully !!" });
}

const getAllContactUs = async (req, res) => {
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

    const rows = await ContactUs.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'updatedBy', select: 'firstName lastName email' })
    let count = 0;
    count = await ContactUs.countDocuments({ isActive: true });
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

const deleteContactUs = async (req, res) => {
    const loggedInUser = req.session.user;
    let isExists = await ContactUs.findOne({ _id: req.body.id, isActive: true }, { name: 1 });
    if (isExists) {
        await ContactUs.findOneAndUpdate({ _id: req.body.id, isActive: true }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "Contact Us Deleted Successfully !!" });
    } else {
        res.status(402).json({ success: false, message: `Record not found to delete !!` });
        return;
    }
}

const getContactUsById = async (req, res) => {
    const id = req.body.id;
    const user = await ContactUs.findOne({ _id: id, isActive: true })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (user) {
        res.json({ success: true, data: user });
    } else {
        res.status(402).json({ success: false, message: "Data not found..." });
    }
}


module.exports = { addContactUs, getAllContactUs, deleteContactUs, getContactUsById };



