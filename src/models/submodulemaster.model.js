const mongoose = require('mongoose');

const SubModuleMasterSchema = mongoose.Schema({
    moduleId: {
         type: mongoose.Types.ObjectId,
        ref: 'modulemaster',
        required: [true, 'Module Id is Required !!']
    },
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
    url: {
        type: String,
        required: [true, 'Icon is Required !!']
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

SubModuleMasterSchema.statics.isExists = async function isExists(_name, id) {
    let SubModuleMaster;

    if (id) {
        // Check on Update
        SubModuleMaster = await this.findOne({ name: _name ,isActive: true, _id: { $ne: id } }, { name: 1 })
    } else {
        //Check on Insert
        SubModuleMaster = await this.findOne({ name: _name, isActive: true }, { name: 1 })
    }
    return SubModuleMaster ? true : false;
}

const SubModuleMaster = mongoose.model('submodulemaster', SubModuleMasterSchema);

module.exports = SubModuleMaster;



