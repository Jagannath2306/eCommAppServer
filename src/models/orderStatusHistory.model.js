const mongoose = require('mongoose');

const OrderStatusHistorySchema = mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        required: true
    },

    statusId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orderstatuse",
        required: true
    },

    comment: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'usermaster',
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

const OrderStatusHistory = mongoose.model('orderstatushistory', OrderStatusHistorySchema);

module.exports = OrderStatusHistory;


