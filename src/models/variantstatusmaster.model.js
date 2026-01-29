const mongoose = require('mongoose');

const VariantStatusMasterSchema = new mongoose.Schema({
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

    isSelectable: {
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


VariantStatusMasterSchema.statics.isExists = async function isExists(_name, id) {
    let VariantStatusMaster;

    if (id) {
        // Check on Update
        VariantStatusMaster = await this.findOne({ name: _name, isActive: true, _id: { $ne: id } }, { name: 1 })
    } else {
        //Check on Insert
        VariantStatusMaster = await this.findOne({ name: _name, isActive: true }, { name: 1 })
    }
    return VariantStatusMaster ? true : false;
}

const VariantStatusMaster = mongoose.model('variantstatusmaster', VariantStatusMasterSchema);

module.exports = VariantStatusMaster;
