const mongoose = require('mongoose');

const PageMasterSchema = mongoose.Schema({
    moduleId: {
        type: mongoose.Types.ObjectId,
        ref: 'modulemaster',
        required: [true, 'Module Id is Required !!']
    },
    subModuleId: {
        type: mongoose.Types.ObjectId,
        ref: 'submodulemaster',
        required: [true, 'SubModule Id is Required !!']
    },
    name: {
        type: String,
        required: [true, 'Name is Required !!']
    },
    pageCode: {                         // 🔑 IMPORTANT
        type: String,
        required: [true, 'pageCode is Required !!'],
        unique: true,
        uppercase: true
    },
    url: {
        type: String,
        required: [true, 'URL is Required !!']
    },
    icon: {
        type: String,
        required: [true, 'URL is Required !!']
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

PageMasterSchema.statics.isExists = async function isExists(_name, id) {
    let PageMaster;

    if (id) {
        // Check on Update
        PageMaster = await this.findOne({ name: _name, isActive: true, _id: { $ne: id } }, { name: 1 })
    } else {
        //Check on Insert
        PageMaster = await this.findOne({ name: _name, isActive: true }, { name: 1 })
    }
    return PageMaster ? true : false;
}

const PageMaster = mongoose.model('pagemaster', PageMasterSchema);

module.exports = PageMaster;



