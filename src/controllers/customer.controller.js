const Customer = require("../models/customer.model");
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const path = require('path');
const { createUploader } = require('../utils/uploader/createuploader');

const uploadCustomerProfile = createUploader({
    uploadPath: path.join(__dirname, '../', process.env.CUSTOMER_IMAGE_PATH),
    fieldName: 'profilePicture',
    maxCount: 1,
});

function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(20).required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().min(10).max(10).required(),
        userTypeId: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().required()
    });

    const result = schema.validate(user);
    return result;
}
function validateLoginUser(user) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const result = schema.validate(user);
    return result;
}

const addCustomer = async (req, res) => {
    const result = validateUser(req.body);

    if (result.error) {
        return res.status(400).send({success :false, message: result.error.details[0].message });
    }

    // We have to Check Password and Confirm Password Equality
    const userData = result.value;

    let isExist = await Customer.isExists(userData.email);
    if (!isExist) {
        let customer = await new Customer(userData).save();
        res.status(201).json({ success: true, message: "Customer Registered Successfully !!" });
    } else {
        return res.send({ success: false, message: "Email Id already exists !!" });
    }
}

const loginCustomer = async (req, res) => {
    const result = validateLoginUser(req.body);

    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const { email, password } = result.value;
    const customer = await Customer.findOne({ email: email, isActive: true }).populate('userTypeId', 'name');
    if (customer) {
        const isMatchPassword = bcrypt.compareSync(password, customer.password);
        if (isMatchPassword) {
            const payload = {
                id: customer._id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                userTypeId: customer.userTypeId._id,
                userTypeName: customer.userTypeId.name
            }
            const token = jwt.sign(payload, process.env.JWT_KEY);
            return res.json({ success: true, message: "Login Success !!", data: { token } });
        } else {
            return res.status(402).send({ success: false, message: "Invalid Credential !!" });
        }
    } else {
        return res.status(402).send({ success: false, message: "User Not Found !!" });
    }
}

const updateCustomerProfile = async (req, res) => {
    uploadCustomerProfile(req, res, async function (err) {
        if (err) {
            return res.status(400).send({ success: false, message: err.message });
        }

        if (!req.file) {
            return res.status(400).send({ success: false, message: "No File found to upload" });
        }
        const schema = Joi.object({
            firstName: Joi.string().min(2).max(20).required(),
            lastName: Joi.string().min(2).max(20).required(),
            phone: Joi.string().required().min(10).max(10).required(),
            profilePicture: Joi.string().required(),
        });
        const filePath = `${process.env.CUSTOMER_IMAGE_PATH}/${req.file.filename}`;
        const result = schema.validate({ ...req.body, profilePicture: filePath });
        if (result.error) {
            return res.status(400).send({ success: false, message: result.error.details[0].message });
        }

        const loggedInUser = req.session.customer;
        const customer = await Customer.findOneAndUpdate({ _id: loggedInUser.id }, result.value);
        if (customer) {
            res.status(200).json({ success: true, message: "Profile Updated Successfully !!" });
        } else {
            res.status(402).json({ success: false, message: "Data not found !!" });
        }
    });

}

const getAllCustomers = async (req, res) => {
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

    const rows = await Customer.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal);
    let count = 0;
    count = await Customer.countDocuments({ isActive: true });
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

const deleteCustomerById = async (req, res) => {
    const loggedInUser = req.session.customer;
    if (!loggedInUser || !loggedInUser.id) {
        return res.status(401).json({ success: false, message: "Unauthorized access" });
    }
    let isExists = await Customer.findOne({ _id: loggedInUser.id, isActive: true }, { name: 1 });
    if (isExists) {
        await Customer.findOneAndUpdate({ _id: loggedInUser.id, isActive: true }, { isActive: false });
        res.status(201).json({ success: true, message: "User Deleted Successfully !!" });
    } else {
        res.status(402).json({ success: false, message: `Record not found to delete !!` });
        return;
    }
}

const getCustomerById = async (req, res) => {
    const loggedInUser = req.session.customer;
    if (!loggedInUser || !loggedInUser.id) {
        return res.status(401).json({ success: false, message: "Unauthorized access" });
    }
    const customer = await Customer.findOne({ _id: loggedInUser.id, isActive: true });
    if (customer) {
        res.status(200).json({ success: true, data: customer });
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}

const validateUserEmail = async (req, res) => {
    const loggedInUser = req.session.customer;

    const Schema = Joi.object({
        email: Joi.string().email().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const email = result.value.email;

    let isExists = await Customer.isExists(email);
    if (!isExists) {
        res.status(400).json({ success: false, message: "User doesn't exist !!" });
    } else {
        res.status(200).json({ success: true, message: `User exist` });
        return;
    }
}

const resetUserPassword = async (req, res) => {
    const loggedInUser = req.session.customer;

    const Schema = Joi.object({
        email: Joi.string().email().required(),
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const email = result.value.email;
    const oldPassword = result.value.oldPassword;

    let isExists = await Customer.isExists(email);
    if (!isExists) {
        res.status(400).json({ success: false, message: "User doesn't exist !!" });
        return;
    }
    const customer = await Customer.findOne({ email: email, isActive: true });
    if (customer) {
        const isPasswordMatch = bcrypt.compareSync(oldPassword, customer.password);

        if (isPasswordMatch) {
            const newPassword = await bcrypt.hash(req.body.newPassword, 12);
            await Customer.findOneAndUpdate({ email: email, isActive: true }, { password: newPassword });
            res.status(200).json({ success: true, message: "Password Reset Successfully !!" });
        } else {
            res.status(400).json({ success: false, message: "Old Password didn't match !!" });
        }
    }
}

module.exports = { addCustomer, loginCustomer, updateCustomerProfile, getAllCustomers, deleteCustomerById, getCustomerById, validateUserEmail, resetUserPassword }

