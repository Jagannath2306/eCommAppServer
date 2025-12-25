const mongoose = require('mongoose');

const ProductMasterStatusSchema = mongoose.Schema({
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

ProductMasterStatusSchema.statics.isExists = async function isExists(_name, id) {
    let ProductMasterStatus;

    if (id) {
        // Check on Update
        ProductMasterStatus = await this.findOne({ name: _name, isActive: true, _id: { $ne: id } }, { name: 1 })
    } else {
        //Check on Insert
        ProductMasterStatus = await this.findOne({ name: _name, isActive: true }, { name: 1 })
    }
    return ProductMasterStatus ? true : false;
}

const ProductMasterStatus = mongoose.model('productmasterstatus', ProductMasterStatusSchema);

module.exports = ProductMasterStatus;
