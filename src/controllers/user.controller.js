const User = require("../models/user.model.js");
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const generateOtp = require('../utils/generateOtp');
const redisClient = require("../utils/radis.js");

function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(20).required(),
        lastName: Joi.string().min(2).max(20),
        email: Joi.string().email().required(),
        userTypeId: Joi.string().required(),
        password: Joi.string().required()
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

const addUser = async (req, res) => {
    const result = validateUser(req.body);

    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const userData = result.value;
    // We have to Check Password and Confirm Password Equality

    let isExist = await User.isExists(userData.email);
    if (!isExist) {
        let user = await new User(userData).save();
        await sendEmail({
            to: userData.email,
            subject: 'BaggageApp - Signup Successful',
            html: `<h2>Dear ${userData.firstName}, </h2>
                        <h3>Welcome and thank you for registering with <a>BaggageApp</a> </h3>
                        <h3> You have been Successful Singed in</h3>
                        <h3>Click <a href='http://localhost:4200/user'>here</a> to Login</h3>
                         <br/><br/><h5> We are happy to see you with us.</h5><h5> Team BaggageApp</h5>`
        });
        res.status(201).json({ success: true, data: user, message: 'User Registered Successfully' });
    } else {
        return res.send({ success: false, message: "Email Id already exists !!" });
    }
}

const loginUser = async (req, res) => {
    const result = validateLoginUser(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const { email, password } = result.value;
    const user = await User.findOne({ email: email, isActive: true }).populate('userTypeId', 'name');

    if (user) {
        const isMatchPassword = bcrypt.compareSync(password, user.password);
        if (isMatchPassword) {
            const payload = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userTypeId: user.userTypeId._id,
                userTypeName: user.userTypeId.name
            }
            const token = jwt.sign(payload, process.env.JWT_KEY);
            return res.json({ success: true, message: "Login Success !!", data: token });
        } else {
            return res.status(401).send({ success: false, message: "Invalid Credential !!" });
        }
    } else {
        return res.status(401).send({ success: false, message: "Invalid Credential" });
    }
}

const updateProfile = async (req, res) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(20).required(),
        lastName: Joi.string(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const loggedInUser = req.session.user;
    await User.findOneAndUpdate({ _id: loggedInUser.id }, result.value);
    return res.json({ success: true, message: "User Profile Updated Successfully !!" });
}

const updateUserById = async (req, res) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(20).required(),
        lastName: Joi.string(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const loggedInUser = req.session.user;

    await User.findOneAndUpdate({ _id: req.params.id, isActive: true }, { ...result.value, updatedBy: loggedInUser.id })
        .populate({ path: 'userTypeId', select: 'name' })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    res.json({ success: true, message: "User Profile Updated Successfully !!" });
}

const getAllUsers = async (req, res) => {
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

    const rows = await User.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'userTypeId', select: 'name' })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' })
    let count = 0;
    count = await User.countDocuments({ isActive: true });
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


const getAllUsersUnlimited = async (req, res) => {
    try {
        const users = await User.aggregate([
            // 1. Filter only active users
            { $match: { isActive: true } },

            // 2. Lookup Role (UserTypes Collection)
            {
                $lookup: {
                    from: 'usertypes',
                    let: { roleId: '$userTypeId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        // Ensures String IDs match ObjectId in DB
                                        { $eq: ['$_id', { $toObjectId: '$$roleId' }] },
                                        { $eq: ['$isActive', true] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 0, name: 1 } }
                    ],
                    as: 'roleData'
                }
            },
            {
                $unwind: {
                    path: '$roleData',
                    preserveNullAndEmptyArrays: true
                }
            },

            // 3. Lookup Updater (UserMasters Collection)
            {
                $lookup: {
                    from: 'usermasters',
                    let: { upId: '$updatedBy' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { 
                                    $eq: ['$_id', { $toObjectId: '$$upId' }] 
                                }
                            }
                        },
                        { $project: { firstName: 1, lastName: 1, _id: 0 } }
                    ],
                    as: 'updatedUserData'
                }
            },
            {
                $unwind: {
                    path: '$updatedUserData',
                    preserveNullAndEmptyArrays: true
                }
            },

            // 4. Final Projection with Name Concatenation
            {
                $project: {
                    _id: 1,
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    isActive: 1,
                    createdOn: 1,
                    role: { $ifNull: ['$roleData.name', 'No Role'] },
                    
                    // Combine First and Last name into one field
                    updatedBy: {
                        $cond: {
                            if: { $gt: [{ $type: "$updatedUserData" }, "missing"] },
                            then: {
                                $trim: { // Trims extra spaces if one name is missing
                                    input: {
                                        $concat: [
                                            { $ifNull: ['$updatedUserData.firstName', ''] },
                                            ' ',
                                            { $ifNull: ['$updatedUserData.lastName', ''] }
                                        ]
                                    }
                                }
                            },
                            else: 'System' // Default if no updater found
                        }
                    }
                }
            },

            // 5. Sort by most recent
            { $sort: { createdOn: -1 } }
        ]);

        return res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: users
        });

    } catch (error) {
        console.error("Aggregation Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error: " + error.message
        });
    }
};


const deleteUserById = async (req, res) => {
    const loggedInUser = req.session.user;
    let isExists = await User.findOne({ _id: req.params.id, isActive: true }, { name: 1 });
    if (isExists) {
        await User.findOneAndUpdate({ _id: req.params.id, isActive: true }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ success: false, message: "User Deleted Successfully !!" });
    } else {
        return res.status(402).json({ success: false, message: `Record not found to delete !!` });
    }
}

const getUserById = async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({ _id: id, isActive: true })
        .populate({ path: 'userTypeId', select: 'name' })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    if (user) {
        res.json({ success: true, data: user });
    } else {
        res.status(402).json({ success: false, message: "Data not found" });
    }
}

const forgotUserPassword = async (req, res) => {

    const Schema = Joi.object({
        email: Joi.string().email().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const { email } = result.value;

    const user = await User.findOne({ email, isActive: true });
    console.log(user)
    if (!user) {
        return res.status(400).json({ success: false, message: "User Not Found..." });
    } else {

        const resetToken = crypto.randomUUID();

        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 12);

        // Store OTP in Redis (5 minutes)
        await redisClient.set(
            `reset-otp:${resetToken}`,
            hashedOtp,
            { EX: 300 }
        );

        // store email against resetToken. so that user shouldn't provide email id again in resend otp
        await redisClient.set(
            `reset-session:${resetToken}`,
            email,
            { EX: 600 }
        );

        await sendEmail({
            to: user.email,
            subject: 'BaggageApp - Password Reset OTP',
            html: `<h2>Dear User, </h2>
                        <h3>Your reset password OTP is ${otp} </h3>
                        <h3> This OTP is valid for 5 minutes. </h3>
                         <br/><br/><h3>Team BaggageApp</h3>`
        });
        return res.status(200).json({ success: true, message: `OTP sent to your email`, resetToken: resetToken });
    }
}

const resetUserPassword = async (req, res) => {
    const Schema = Joi.object({
        resetToken: Joi.string().required(),
        otp: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
        newPassword: Joi.string().pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).required(),
        confirmPassword: Joi.string().pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const { resetToken, otp, newPassword, confirmPassword } = result.value

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Confirm password and new password should match !!" });
    }

    const email = await redisClient.get(`reset-session:${resetToken}`);

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Session expired. Please restart password reset."
        });
    }

    const user = await User.findOne({ email, isActive: true });

    if (user) {

        const storedHashedOtp = await redisClient.get(`reset-otp:${resetToken}`);

        if (!storedHashedOtp) {
            return res.status(400).json({ success: false, message: 'OTP expired or invalid' });
        }

        const isValidOtp = await bcrypt.compare(otp, storedHashedOtp);

        if (!isValidOtp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await User.findOneAndUpdate(
            { email, isActive: true },
            { $set: { password: hashedPassword } }
        );

        await redisClient.del(`reset-session:${resetToken}`);
        await redisClient.del(`reset-otp:${resetToken}`);
        await redisClient.del(`reset-otp-count:${resetToken}`);
        await redisClient.del(`reset-otp-cooldown:${resetToken}`);

        res.status(200).json({ success: true, message: "Password Reset Successfully" });
    }
}

const resendUserOtp = async (req, res) => {
    const schema = Joi.object({
        resetToken: Joi.string().required()
    });

    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).json({
            success: false,
            message: result.error.details[0].message
        });
    }

    const { resetToken } = result.value;

    // Get email from Redis
    const email = await redisClient.get(`reset-session:${resetToken}`);
    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Invalid or Expired Reset Session"
        });
    }

    // Cooldown check (token-based)
    const cooldownKey = `reset-otp-cooldown:${resetToken}`;
    if (await redisClient.get(cooldownKey)) {
        return res.status(429).json({
            success: false,
            message: "Please wait 60s before requesting another OTP"
        });
    }

    // Resend count check (token-based)
    const countKey = `reset-otp-count:${resetToken}`;
    const resendCount = Number(await redisClient.get(countKey)) || 0;

    if (resendCount >= 3) {
        return res.status(429).json({
            success: false,
            message: "OTP Resend Limit Reached"
        });
    }

    // Generate new OTP
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 12);

    // Store OTP using token
    await redisClient.set(
        `reset-otp:${resetToken}`,
        hashedOtp,
        { EX: 300 }
    );

    // Update resend count
    await redisClient.set(
        countKey,
        resendCount + 1,
        { EX: 600 }
    );

    // Set cooldown
    await redisClient.set(
        cooldownKey,
        "true",
        { EX: 60 }
    );

    // Send email
    await sendEmail({
        to: email,
        subject: "BaggageApp - Resend Password Reset OTP",
        html: `
        <h3>Your new OTP is <b>${otp}</b></h3>
        <p>This OTP is valid for 5 minutes.</p>
        <br/><br/><h3>Team BaggageApp</h3>
      `
    });
    return res.status(200).json({
        success: true,
        message: "OTP Sent to your email ID"
    });
}

module.exports = { addUser, loginUser, updateProfile, getAllUsers, getUserById, deleteUserById, updateUserById, forgotUserPassword, resetUserPassword, resendUserOtp, getAllUsersUnlimited }

