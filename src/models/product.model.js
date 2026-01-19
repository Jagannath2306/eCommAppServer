const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    salePrice: {
        type: Number,
        min: 0
    },
    shortDetails: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categoryIds: [{
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: true
    }],
    tagIds: [{
        type: mongoose.Types.ObjectId,
        ref: 'tag',
         required: true
    }],
    imagePaths: [{
        type: String,
        required: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'usermaster',
        required: true
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'usermaster'
    }
},
    {
        timestamps: {
            createdAt: 'createdOn',
            updatedAt: 'updatedOn'
        },
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

// 👇 ADD VIRTUAL HERE
ProductSchema.virtual('discount').get(function () {
    if (!this.salePrice) return 0;
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
});

ProductSchema.statics.isExists = async function (name, code, id = null) {
    const query = {
        isActive: true,
        $or: [{ name }, { code }]
    };

    if (id) {
        query._id = { $ne: id };
    }

    return !!(await this.exists(query));
};

const Product = mongoose.model('product', ProductSchema);

module.exports = Product;