const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is Required !!'],
        uppercase: true,
        match: [/^[a-z ,.'-]+$/i, "First Name is Invalid"]
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is Required !!'],
        uppercase: true,
        match: [/^[a-z ,.'-]+$/i, "Last Name is Invalid"]
    },
    email: {
        type: String,
        required: [true, 'Email is Required !!'],
        lowercase: true,
        match: [/^[^@]+@[^@]+\.[^@]+$/, "Email is Invalid"]
    },
    userTypeId: {
        type: mongoose.Types.ObjectId,
        // type: String,
        required: [true, 'UserType is Required !!'],
        ref: 'usertype'
    },
    password: {
        type: String,
        required: [true, 'Password is Required !!']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm Password is Required !!']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'usermaster',
        //required: true
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'usermaster'
    }
}, {
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'updatedOn'
    }
});

UserSchema.pre('save', async function (next) {
    console.log("pre called")
    if (this.isModified('password')) {
        if (this.password !== this.confirmPassword) {
            return next(new Error('Password and Confirm Password must be same.'));
        }
        this.password = await bcrypt.hash(this.password, 12);
         console.log("confirm password")
        this.confirmPassword = undefined;
    }
    next();
});

UserSchema.statics.isExists = async function isExists(email) {
    let User;
    User = await this.findOne({ email: email, isActive: true });
    return User ? true : false;
}

const User = mongoose.model('usermaster', UserSchema);
module.exports = User;


