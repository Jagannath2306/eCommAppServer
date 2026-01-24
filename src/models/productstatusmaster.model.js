const mongoose = require('mongoose');

const ProductStatusMasterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required !!']
    },
    code: {
        type: String,
        required: [true, 'Code is Required !!'],
        unique: true,
        uppercase: true,
        trim: true
    },
    color: {
        type: String,
        required: [true, 'Color is Required !!'],
    },

    description: {
        type: String,
        required: [true, 'Description is Required !!'],
    },

    isCustomerVisible: {
        type: Boolean,
        default: false
    },

    isSellable: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    },

    sortOrder: {
        type: Number,
        default: 1
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
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'updatedOn'
    }
});


ProductStatusMasterSchema.statics.isExists = async function isExists(_name, id) {
    let ProductStatusMaster;

    if (id) {
        // Check on Update
        ProductStatusMaster = await this.findOne({ name: _name, isActive: true, _id: { $ne: id } }, { name: 1 })
    } else {
        //Check on Insert
        ProductStatusMaster = await this.findOne({ name: _name, isActive: true }, { name: 1 })
    }
    return ProductStatusMaster ? true : false;
}

const ProductStatusMaster = mongoose.model('productstatusmaster', ProductStatusMasterSchema);

module.exports = ProductStatusMaster;
