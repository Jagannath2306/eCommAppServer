const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required !!']
    },
    code: {
        type: String,
        required: [true, 'Code is Required !!']
    },
    title: {
        type: String,
        required: [true, 'Title is Required !!']
    },
    price: {
        type: String,
        required: [true, 'Price is Required !!']
    },
    salePrice: {
        type: String,
        required: [true, 'Sale Price is Required !!']
    },
    shortDetails: {
        type: String,
        required: [true, 'Short Details is Required !!']
    },
    description: {
        type: String,
        required: [true, 'Description is Required !!']
    },
    quantity: {
        type: String,
        required: [true, 'Quantity is Required !!']
    },
    discount: {
        type: Number,
    },
    isNewItem: {
        type: Boolean,
    },
    isSale: {
        type: Boolean,
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: true
    },
    tagId: {
        type: mongoose.Types.ObjectId,
        ref: 'tag',
        required: true
    },
    colorId: {
        type: mongoose.Types.ObjectId,
        ref: 'color',
        required: true
    },
    sizeId: {
        type: mongoose.Types.ObjectId,
        ref: 'size',
        required: true
    },
    imagePaths: {
        type: Array,
        required: [true, 'Image Path is Required !!']
    },
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
}, {
    // timestamps: true
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'updatedOn'
    }
});

ProductSchema.statics.isExists = async function isExists(_name, _code, id) {
    let product;
    if (id) {
        // Check on Update
        product = await this.findOne({ $or: [{ name: _name }, { code: _code }], isActive: true, _id: { $ne: id } }, { name: 1 })
    } else {
        //Check on Insert
        product = await this.findOne({ $or: [{ name: _name }, { code: _code }], isActive: true }, { name: 1 })
    }
    return product ? true : false;
}

const Product = mongoose.model('product', ProductSchema);

module.exports =  Product;