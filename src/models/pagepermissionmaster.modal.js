const mongoose = require('mongoose');

const PagePermissionMasterSchema = mongoose.Schema({
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
    pageId: {
        type: String,
        ref: 'pagemaster',
        required: [true, 'Name is Required !!']
    },
    actions: {
        type: [String],
        required: [true, 'Name is Required !!'],
        enum: ['view', 'create', 'edit', 'delete', "approve", "reject", "block", "unblock"]
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

PagePermissionMasterSchema.statics.isExists = async function (pageId, id) {
    let record;

    if (id) {
        // Update case
        record = await this.findOne({
            pageId,
            isActive: true,
            _id: { $ne: id }
        });
    } else {
        // Insert case
        record = await this.findOne({
            pageId,
            isActive: true
        });
    }

    return !!record;
};

const PagePermissionMaster = mongoose.model('pagepermissionmaster', PagePermissionMasterSchema);

module.exports = PagePermissionMaster;

// 📌 This does NOT mean a user has permission
// 📌 This only defines what is possible on that page 

// Action	   Meaning
// =========================
// view 	   Can open the page
// create	   Can submit create form
// edit	       Can edit existing data
// delete	   Can delete data

// Think of it as: Capability definition, not assignment


// Layer	                 Purpose
// =============================================
// Module/Submodule/Page	 Structure & navigation
// PagePermissionMaster      What actions a page supports
// RolePagePermission	     What actions a role is allowed
// User	                     Gets permissions via role