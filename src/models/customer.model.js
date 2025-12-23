    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');
    const CustomerSchema = mongoose.Schema({
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
         phone: {
            type: String,
            required: [true, 'Phone Number is Required !!']
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
    }, {
        timestamps: {
            createdAt: 'createdOn',
            updatedAt: 'updatedOn'
        }
    });
    
    CustomerSchema.pre('save', async function (next) {
        if (this.isModified('password')) {
            if (this.password !== this.confirmPassword) {
                return next(new Error('Password and Confirm Password must be same.'));
            }
            this.password = await bcrypt.hash(this.password, 12);
            this.confirmPassword = undefined;
        }
        next();
    });
    
    CustomerSchema.statics.isExists = async function isExists(email) {
        let customer;
        customer = await this.findOne({ email: email, isActive: true });
        return customer ? true : false;
    }

    const Customer = mongoose.model('customermaster', CustomerSchema);
    module.exports = Customer;
    
    
    