const Joi = require("joi");
const Payment = require("../models/payment.model");
const PaymentStatus = require("../models/paymentStatus.model");
const OrderStatus = require("../models/orderStatus.model");
const Order = require("../models/order.model");
const Customer = require("../models/customer.model");
const sendEmail = require('../utils/sendEmail');
const OrderStatusHistory = require("../models/orderStatusHistory.model");

const createPayment = async (req, res) => {
  try {
 const loggedInUser = req.session.customer;
    if (!loggedInUser) {
        return res.status(400).send({ success: false, message: "Unauthorized User!!" });
    }

    const schema = Joi.object({
      orderId: Joi.string().length(24).hex().required(),
      paymentTypeId: Joi.string().length(24).hex().required(),
      amount: Joi.number().positive().required()
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const order = await Order.findById(value.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const pendingStatus = await PaymentStatus.findOne({ name: "PENDING" });
    if (!pendingStatus) {
      return res.status(400).json({ message: "PENDING status not configured" });
    }

    const transaction = "TRN-" + Date.now();

    const payment = await Payment.create({
      ...value,
      paymentStatusId: pendingStatus._id,
      transactionId: transaction
    });

    return res.status(201).json({
      message: "Payment created",
      data: payment
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const paymentWebhook = async (req, res) => {
  try {
    
    const schema = Joi.object({
      paymentId: Joi.string().length(24).hex().required(),
      statusCode: Joi.string().required(),
      transactionId: Joi.string().required(),
      gatewayResponse: Joi.object().required()
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { paymentId, statusCode, transactionId, gatewayResponse } = value;

    const payment = await Payment.findById(paymentId);
    console.log("Payment Found:", payment);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // 🔐 Prevent duplicate webhook update
    const currentStatus = await PaymentStatus.findById(payment.paymentStatusId);
    console.log("Current Payment Status:", currentStatus.name);
    if (currentStatus.name !== "PENDING") {
      return res.status(200).json({ message: "Already processed" });
    }

    const newStatus = await PaymentStatus.findOne({ name: statusCode });
    if (!newStatus) {
      return res.status(400).json({ message: "Invalid status" });
    }

    payment.paymentStatusId = newStatus._id;
    payment.transactionId = transactionId;
    payment.gatewayResponse = gatewayResponse;

    await payment.save();

    // 🔥 Update Order based on payment result
    

   if (statusCode === "SUCCESS") {

  const paidStatus = await OrderStatus.findOne({ name: "CONFIRMED" });

  if (paidStatus) {

    const order = await Order.findByIdAndUpdate(
      payment.orderId,
      { orderStatusId: paidStatus._id, paymentStatusId: newStatus._id },
      { new: true }
    );

      await OrderStatusHistory.create({
      orderId: payment.orderId,
      statusId:paidStatus._id,
      comment: "Payment verified and order confirmed.",
      createdBy: "6967369425092a30ec037bf3"// You can replace this with an admin user ID if needed
    });
    // get customer info
    const userData = await Customer.findById(order.customerId);

console.log("Customer Data:", userData);
    await sendEmail({
      to: userData.email,
      subject: "Your Order is Confirmed 🎉",
      html: `
        <h2>Order Placed Successfully 🎉</h2>
        <p>Hi ${userData.name},</p>
        <p>Your order <b>${order._id}</b> has been placed.</p>
        <p>Total Amount: ₹${order.totalAmount}</p>
        <br/><br/><br/><br/><br/>
        <p>Thank you for shopping with us.</p>
      `
    });

    return res.status(200).json({
      message: "Payment successful and order confirmed"
    });
  }
}

    if (statusCode === "FAILED") {
      const failedStatus = await OrderStatus.findOne({ code: "PAYMENT_FAILED" });
      if (failedStatus) {
        await Order.findByIdAndUpdate(payment.orderId, {
          orderStatusId: failedStatus._id
        });
      }
    }

    return res.status(200).json({ message: "Webhook processed" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate("paymentStatusId")
      .populate("paymentTypeId")
      .populate("orderId");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    return res.status(200).json({ data: payment });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createPayment,
  paymentWebhook,
  getPaymentById
};