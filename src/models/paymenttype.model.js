const mongoose = require('mongoose');

const PaymentTypeSchema = mongoose.Schema({
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

PaymentTypeSchema.statics.isExists = async function isExists(_name, id) {
    let PaymentType;

    if (id) {
        // Check on Update
        PaymentType = await this.findOne({ name: _name, isActive: true, _id: { $ne: id } }, { name: 1 })
    } else {
        //Check on Insert
        PaymentType = await this.findOne({ name: _name, isActive: true }, { name: 1 })
    }
    return PaymentType ? true : false;
}

module.exports =
  mongoose.models.paymenttype ||
  mongoose.model("paymenttype", PaymentTypeSchema);



