const mongoose = require('mongoose');
const RolePagePermissionSchema = new mongoose.Schema(
    {
        userTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'usertype',
            required: true
        },

        pageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'pagemaster',
            required: true
        },

        actions: {
            type: [String],
            required: true,
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

// RolePagePermissionSchema.index(
//     { roleId: 1, pageId: 1 },
//     { unique: true }
// );

RolePagePermissionSchema.statics.isExists = async function (roleId, pageId, id) {
    let record;

    if (id) {
        // Update case
        record = await this.findOne({
            roleId,
            pageId,
            _id: { $ne: id }
        });
    } else {
        // Create case
        record = await this.findOne({
            roleId,
            pageId
        });
    }

    return !!record;
};

const RolePagePermission = mongoose.model('rolepagepermission', RolePagePermissionSchema);

module.exports = RolePagePermission;


// 📌 This mean a user has permission
// 📌 This only defines what actions user has access

// Role Page Permission – Action Meaning
// Example: Create User Page
// Action	Meaning (Role Capability)
// ================================================
// view	    Role can open the page / see it in menu
// create	Role can submit the Create User form
// edit	    Role can edit existing user details
// delete	Role can delete a user


// Another Example: Product Page
// Action	Meaning
// ====================================
// view	    Can see products
// create	Can add new products
// edit	    Can update product info
// delete	Can remove products