const Joi = require("joi");
const Order = require("../models/order.model");
const ProductVariant = require("../models/productVariant.model");
const OrderStatus = require("../models/orderStatus.model");
const PaymentStatus = require("../models/paymentStatus.model");
const PaymentType = require("../models/paymentType.model");
const OrderStatusHistory = require("../models/orderStatusHistory.model");

const createOrder = async (req, res) => {
  try {

    const loggedInUser = req.session.customer;
    if (!loggedInUser) {
      return res.status(400).send({ success: false, message: "Unauthorized User!!" });
    }

    // ✅ 1️⃣ Joi Validation
    const schema = Joi.object({
      customerId: Joi.string().length(24).hex().required(),
      paymentTypeId: Joi.string().length(24).hex().required(),
      billingAddress: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
        address: Joi.string().min(5).required(),
        city: Joi.string().required(),
        state: Joi.string().allow("", null),
        pincode: Joi.string().pattern(/^[0-9]{6}$/).required()
      }).required(),

      items: Joi.array()
        .min(1)
        .items(
          Joi.object({
            variantId: Joi.string().length(24).hex().required(),
            quantity: Joi.number().integer().min(1).required()
          })
        )
        .required()
    });

    const { error, value } = schema.validate(req.body);
    console.log("Validation result", { error, value });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const { customerId, billingAddress, items, paymentTypeId } = value;

    // ✅ 2️⃣ Get Default Order Status
    const pendingStatus = await OrderStatus.findOne({ name: "PENDING" });

    if (!pendingStatus) {
      return res.status(400).json({ message: "Default order status not found" });
    }
    //Get Default payment Status
    const paymentStatus = await PaymentStatus.findOne({ name: "PENDING" });

    if (!paymentStatus) {
      return res.status(400).json({ message: "Payment status not found" });
    }
    //Get payment Type
    const paymentType = await PaymentType.findById(paymentTypeId);

    if (!paymentType) {
      return res.status(400).json({
        message: "Invalid payment type"
      });
    }
    const invoiceNo = "INV-" + Date.now();
    let subTotal = 0;
    const orderItems = [];

    // ✅ 3️⃣ Validate Items + Calculate Total
    for (const item of items) {
      const variant = await ProductVariant.findById(item.variantId).populate("productId");

      if (!variant) {
        return res.status(404).json({ message: "Variant not found" });
      }

      if (variant.stock < item.quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      const itemTotal = variant.price * item.quantity;
      subTotal += itemTotal;

      // orderItems.push({
      //   variantId: variant._id,
      //   quantity: item.quantity,
      //   price: variant.price,
      //   total: itemTotal
      // });
      orderItems.push({
        productId: variant.productId._id,
        productName: variant.productId.name,
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        quantity: item.quantity,
        price: variant.price,
        discount: 0,
        total: itemTotal
      });
    }

    const shippingAmount = 0;
    const totalAmount = subTotal + shippingAmount;

    const order = await Order.create({
      customerId,
      billingAddress,
      items: orderItems,
      invoiceNo: invoiceNo,
      shippingAmount,
      subTotalAmount: subTotal,
      totalAmount,
      orderStatusId: pendingStatus._id,
      paymentStatusId: paymentStatus._id,
      paymentTypeId: paymentType
    });

    // Insert status history
    await OrderStatusHistory.create({
      orderId: order._id,
      statusId: pendingStatus._id,
      comment: "Your order has been placed.",
      createdBy: loggedInUser.id
    });
    
    return res.status(201).json({
      message: "Order created successfully",
      order
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getOrdersList = async (req, res) => {
  try {
    // const customerId = req.user._id;

    const orders = await Order.find()
      .populate('customerId', 'firstName lastName mobile email') // Only fetch specific fields for security
      .populate('paymentStatusId', 'name')
      .populate('paymentTypeId', 'name')
      .populate('orderStatusId', 'name')
      .populate('items.productId', 'productName , sku, quantity , price, discount , total size, color'); // Populate product details in items

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getStatusList = async (req, res) => {
  try {
    const statusList = await OrderStatus.find({}, { name: 1 });

    return res.status(200).json({
      success: true,
      message: "Statuses fetched successfully",
      data: statusList
    });

  } catch (err) {
    res.status(402).json({ success: false, message: "Data not found" });
  }
};

const getOrderById = async (req, res) => {
  try {
    console.log("Received request to fetch order with body:", req.body);
    const schema = Joi.object({
      id: Joi.string().length(24).hex().required()
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const { id } = value;
    const order = await Order.findOne({ _id: id })
      .populate('customerId', 'firstName lastName mobile email') // Only fetch specific fields for security
      .populate('paymentStatusId', 'name')
      .populate('paymentTypeId', 'name')
      .populate('orderStatusId', 'name')
      .populate('items.productId', 'productName , sku, quantity , price, discount , total size, color'); // Populate product details in items


    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json({ success: true, data: order, message: "Order fetched successfully" });
  } catch (err) {
    res.status(402).json({ success: false, message: "Data not found" });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
 const loggedInUser = req.session.user;
 console.log("Logged in user in updateOrderStatus:", loggedInUser);
    if (!loggedInUser) {
        return res.status(400).send({ success: false, message: "Unauthorized User not logged in !!" });
    }
    console.log("Received request to update order status:", req.body);

    const schema = Joi.object({
      orderId: Joi.string().length(24).hex().required(),
      statusId: Joi.string().length(24).hex().required(),
      comment: Joi.string().min(3).max(500).required()
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { orderId, statusId, comment } = value;

    // Update order status
    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      { orderStatusId: statusId },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Insert status history
    await OrderStatusHistory.create({
      orderId,
      statusId,
      comment,
      createdBy: loggedInUser.id
    });

    return res.json({
      success: true,
      message: "Order status updated successfully",
      data: order
    });

  } catch (err) {

    console.error("Error updating order status:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};

const cancelOrder = async (req, res) => {
  try {

    // ✅ 1️⃣ Joi Validation
    const schema = Joi.object({
      orderId: Joi.string().length(24).hex().required(),
      cancelReason: Joi.string().min(3).max(500).required()
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map(err => err.message)
      });
    }

    const { orderId, cancelReason } = value;
    const customerId = req.user._id;

    // ✅ 2️⃣ Find order belonging to logged-in customer
    const order = await Order.findOne({
      _id: orderId,
      customerId
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    // ✅ 3️⃣ Check current order status
    const currentStatus = await OrderStatus.findById(order.orderStatusId);

    if (!currentStatus) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    // ❌ Prevent cancelling shipped/delivered/cancelled orders
    if (["SHIPPED", "DELIVERED", "CANCELLED"].includes(currentStatus.code)) {
      return res.status(400).json({
        message: "Order cannot be cancelled at this stage"
      });
    }

    // ✅ 4️⃣ Get CANCELLED status
    const cancelledStatus = await OrderStatus.findOne({ code: "CANCELLED" });

    if (!cancelledStatus) {
      return res.status(400).json({
        message: "Cancelled status not configured"
      });
    }

    // ✅ 5️⃣ Update order
    order.orderStatusId = cancelledStatus._id;
    order.cancelReason = cancelReason;
    order.cancelledAt = new Date();

    await order.save();

    // 🔄 6️⃣ Restore stock
    for (const item of order.items) {
      await ProductVariant.findByIdAndUpdate(
        item.variantId,
        { $inc: { stock: item.quantity } }
      );
    }

    return res.status(200).json({
      message: "Order cancelled successfully"
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};
module.exports = {
  createOrder,
  getOrdersList,
  getOrderById,
  cancelOrder,
  getStatusList,
  updateOrderStatus
};