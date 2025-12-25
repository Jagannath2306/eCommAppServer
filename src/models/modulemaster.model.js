const mongoose = require('mongoose');

const ModuleMasterSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required !!']
    },
    icon: {
        type: String,
        required: [true, 'Icon is Required !!']
    },
    defaultActive: {
        type: Boolean,
        default: false
    },
    menuRank: {
        type: Number,
        default: 0
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

ModuleMasterSchema.statics.isExists = async function isExists(_name, id) {
    let ModuleMaster;

    if (id) {
        // Check on Update
        ModuleMaster = await this.findOne({ name: _name ,isActive: true, _id: { $ne: id } }, { name: 1 })
    } else {
        //Check on Insert
        ModuleMaster = await this.findOne({ name: _name, isActive: true }, { name: 1 })
    }
    return ModuleMaster ? true : false;
}

const ModuleMaster = mongoose.model('modulemaster', ModuleMasterSchema);

module.exports = ModuleMaster;



