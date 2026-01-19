const mongoose = require('mongoose');

const SizeSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required !!'],
        trim: true,
        uppercase: true
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

SizeSchema.index({ name: 1, isActive: 1 });

SizeSchema.statics.isExists = async function isExists(_name, id) {
    let size;

    if (id) {
        // Check on Update
        size = await this.findOne({ name: _name, isActive: true, _id: { $ne: id } }, { name: 1 })
    } else {
        //Check on Insert
        size = await this.findOne({ name: _name, isActive: true }, { name: 1 })
    }
    return size ? true : false;
}

const Size = mongoose.model('size', SizeSchema);

module.exports = Size;



