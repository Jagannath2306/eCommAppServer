const mongoose = require('mongoose');

const ColorSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required !!'],
        unique: true,
        trim: true,
        lowercase: true
    },
    color: {
        type: String,
        required: [true, 'Code is Required !!'],
    },
    code: {
        type: String,
        required: [true, 'Code is Required !!'],
        unique: true,
        uppercase: true,
        trim: true
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
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'updatedOn'
    }
});

ColorSchema.statics.isExists = async function isExists(_name, _code, id) {
    let color;

    if (id) {
        // Check on Update
        color = await this.findOne({ $or: [{ name: _name }, { code: _code }], isActive: true, _id: { $ne: id } }, { name: 1 })
    } else {
        //Check on Insert
        color = await this.findOne({ $or: [{ name: _name }, { code: _code }], isActive: true }, { name: 1 })
    }
    return color ? true : false;
}

const Color = mongoose.model('color', ColorSchema);

module.exports = Color;



