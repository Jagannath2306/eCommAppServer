const mongoose = require('mongoose');

const UserPageRightsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'usermaster',
        required: [true, 'User Id is Required !!']
    },
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
    pageIds: {
        type: mongoose.Types.ObjectId,
        ref: 'pagemaster',
        required: [true, 'Page Id is Required !!']
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

UserPageRightsSchema.statics.isExists = async function isExists(_name, id) {
    let PageRights;

    if (id) {
        // Check on Update
        PageRights = await this.findOne({ name: _name, isActive: true, _id: { $ne: id } }, { name: 1 })
    } else {
        //Check on Insert
        PageRights = await this.findOne({ name: _name, isActive: true }, { name: 1 })
    }
    return PageRights ? true : false;
}

const UserPageRights = mongoose.model('userpagerights', UserPageRightsSchema);

module.exports = UserPageRights;

// Golden rule (remember this)

// Menu visibility = view permission (PagePermissionMaster)
// Page rights = action permissions (RolePagePermission)