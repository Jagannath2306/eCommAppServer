const mongoose = require('mongoose');

const PaymentStatusSchema = mongoose.Schema({
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

PaymentStatusSchema.statics.isExists = async function isExists(_name, id) {
    let PaymentStatus;

    if (id) {
        // Check on Update
        PaymentStatus = await this.findOne({ name: _name, isActive: true, _id: { $ne: id } }, { name: 1 })
    } else {
        //Check on Insert
        PaymentStatus = await this.findOne({ name: _name, isActive: true }, { name: 1 })
    }
    return PaymentStatus ? true : false;
}

const PaymentStatus =
  mongoose.models.paymentStatus ||
  mongoose.model("paymentStatus", PaymentStatusSchema);
module.exports = PaymentStatus;



