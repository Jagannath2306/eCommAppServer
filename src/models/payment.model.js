const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: true,
    },

    paymentTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "paymenttype",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    transactionId: {
      type: String,
    },

    gateway: {
      type: String, // Razorpay / Stripe etc
    },

    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
    },

    // ✅ Replace enum with reference
    paymentStatusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "paymentStatus",
      required: true,
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

module.exports = mongoose.model("payment", PaymentSchema);