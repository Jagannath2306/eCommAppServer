const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customermaster",
      required: true,
    },

    invoiceNo: {
      type: String,
      required: true,
      unique: true,
    },

    billingAddress: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      pincode: { type: String, required: true },
    },

    items: {
      type: [OrderItemSchema],
      required: true,
    },

    subTotalAmount: {
      type: Number,
      required: true,
    },

    shippingAmount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentStatusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "paymentStatus",
      required: true,
    },

    paymentTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "paymenttype",
      required: true,
    },
    
    orderStatusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orderstatus",
      required: true,
    },

    cancelInfo: {
      reason: { type: String },
      cancelledAt: { type: Date },
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customermaster",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "updatedOn",
    },
  }
);

module.exports = mongoose.model("order", OrderSchema);