const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required !!'],
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Code is Required !!'],
        unique: true,
        uppercase: true,
        trim: true
    },
    title: {
        type: String,
         required: [true, 'Title is Required !!'],
    },
    price: {
        type: Number,
        required: [true, 'Price is Required !!'],
        min: 0
    },
    salePrice: {
        type: Number,
         required: [true, 'Sale Price is Required !!'],
        min: 0
    },
    shortDetails: {
        type: String,
         required: [true, 'Short Details is Required !!'],
    },
    description: {
        type: String,
        required: [true, 'Description is Required !!']
    },
    categoryIds: [{
        type: mongoose.Types.ObjectId,
        ref: 'category',
         required: [true, 'Category is Required !!']
    }],
    tagIds: [{
        type: mongoose.Types.ObjectId,
        ref: 'tag',
         required: [true, 'Tags is Required !!']
    }],
    statusId: {
        type: mongoose.Types.ObjectId,
        ref: 'productstatusmaster',
        required: [true, 'Status is Required !!']
    },
    imagePaths: [{
        type: String,
        required: [true, 'Image is Required !!']
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