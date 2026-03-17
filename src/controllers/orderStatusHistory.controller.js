const orderStatusHistory = require('../models/orderStatusHistory.model');
const Joi = require('joi');

const saveOrderStatusHistory = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const schema = Joi.object({
        orderId: Joi.string().hex().length(24).required(),
        status: Joi.string().required(),
        comment: Joi.string().min(2).max(100).optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    const newHistory = new orderStatusHistory({
        orderId: value.orderId,
        status: value.status,
        comment: value.comment,
        createdBy: loggedInUser.id
    });

    await newHistory.save();

    return res.status(201).json({
        success: true,
        message: "Order Status History saved successfully"
    });
};

const updateOrderStatusHistory = async (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const schema = Joi.object({
        id: Joi.string().hex().length(24).required(),
        orderId: Joi.string().required(),
        status: Joi.string().required(),
        comment: Joi.string().min(2).max(100).optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    const historyId = value.id;

    const updateStatusHistory = await orderStatusHistory.findById(historyId);
    if (!updateStatusHistory) {
        return res.status(404).json({
            success: false,
            message: "Order Status History not found"
        });
    }

    await orderStatusHistory.findByIdAndUpdate(
        historyId,
        {
            orderId: value.orderId,
            status: value.status,
            comment: value.comment,
            updatedBy: loggedInUser.id
        }
    );

    return res.status(200).json({
        success: true,
        message: "Order Status History updated successfully"
    });
};


const getAllOrderStatusHistories = async (req, res) => {
    const schema = Joi.object({
        pageSize: Joi.number().min(5).required(),
        page: Joi.number().min(1).required(),
        sortCol: Joi.string().required(),
        sort: Joi.string().valid('asc', 'desc').required()
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }
    const limitVal = Number.parseInt(result.value.pageSize) || 10;
    const page = Number.parseInt(result.value.page) || 1;
    const skipCount = limitVal * (page - 1);
    const sortCol = result.value.sortCol;
    const sortBy = result.value.sort || 'asc';
    const sortObject = {};
    sortObject[sortCol] = sortBy === 'asc' ? 1 : -1;

    const rows = await orderStatusHistory.find({ isActive: true })
        .sort(sortObject)
        .skip(skipCount)
        .limit(limitVal)
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .populate({ path: 'updatedBy', select: 'firstName lastName email' });
    let count = 0;
    count = await orderStatusHistory.countDocuments({ isActive: true });
    return res.status(200).json({
        success: true,
        data: rows,
        meta: {
            page: page,
            pageSize: limitVal,
            total: count
        }
    });
}

const getOrderStatusHistoryById = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.string().required()
    });

    const { error, value } = schema.validate(req.body); // better than body
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { id } = value;

    const statusHistory = await orderStatusHistory.find({orderId: id})
      .sort({ createdOn: 1 })
      .populate('statusId','name' )
      .populate({ path: 'createdBy', select: 'firstName lastName email' })
      .populate({ path: 'updatedBy', select: 'firstName lastName email' });

    if (statusHistory.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: statusHistory
    });

  } catch (err) {
    console.error("Error fetching order status history:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
const deleteOrderStatusHistory = async (req, res) => {
    const loggedInUser = req.session.user;

    const Schema = Joi.object({
        id: Joi.string().required()
    });

    const result = Schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({ success: false, message: result.error.details[0].message });
    }

    const statusHistoryId = result.value.id;

    let isExists = await orderStatusHistory.findOne({ _id: statusHistoryId, isActive: true }, { name: 1 });
    if (isExists) {
        await orderStatusHistory.findOneAndUpdate({ _id: statusHistoryId }, { isActive: false, updatedBy: loggedInUser.id });
        res.status(201).json({ success: true, message: "Order Status History Deleted Successfully !!" });
    } else {
        res.status(402).json({ success: false, message: `Record not found to delete !!` });
    }
}

const getOrderStatusHistoryList = async (req, res) => {

    const loggedInUser = req.session.user;
    if (!loggedInUser) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const rows = await orderStatusHistory.find({ isActive: true })
    return res.status(200).json({
        success: true,
        data: rows,
        message: "Order Status History list fetched successfully"
    });
}

module.exports = { saveOrderStatusHistory, updateOrderStatusHistory, deleteOrderStatusHistory, getOrderStatusHistoryById, getAllOrderStatusHistories, getOrderStatusHistoryList }