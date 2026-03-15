const mongoose = require('mongoose');

const OrderStatusSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required !!']
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

OrderStatusSchema.statics.isExists = async function isExists(_name, id) {
    let OrderStatus;

    if (id) {
        // Check on Update
        OrderStatus = await this.findOne({ name: _name, isActive: true, _id: { $ne: id } }, { name: 1 })
    } else {
        //Check on Insert
        OrderStatus = await this.findOne({ name: _name, isActive: true }, { name: 1 })
    }
    return OrderStatus ? true : false;
}

// const OrderStatus = mongoose.model('orderstatus', OrderStatusSchema);
// const OrderStatus =
//   mongoose.models.OrderStatus ||
//   mongoose.model("orderstatus", OrderStatusSchema);

// module.exports = OrderStatus;

module.exports =
  mongoose.models.orderstatus ||
  mongoose.model("orderstatus", OrderStatusSchema);



