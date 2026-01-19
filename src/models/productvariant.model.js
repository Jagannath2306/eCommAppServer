const mongoose = require('mongoose');

const ProductVariantSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'product',
        required: true,
        index: true
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
    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
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
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'updatedOn'
    }
});

/**
 * Prevent duplicate variant (same product + color + size)
 */
ProductVariantSchema.index(
    { productId: 1, colorId: 1, sizeId: 1 },
    { unique: true }
);

const ProductVariant = mongoose.model('productvariant',ProductVariantSchema);

module.exports = ProductVariant;
