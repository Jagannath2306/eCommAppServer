const mongoose = require('mongoose');

const TagSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is Required !!'],
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
  },
  {
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'updatedOn'
    }
  }
);

TagSchema.index({ name: 1, isActive: 1 });

TagSchema.statics.isExists = async function isExists(_name, id) {
    let tag;

    if (id) {
        // Check on Update
        tag = await this.findOne({ name: _name, isActive: true, _id: { $ne: id } }, { name: 1 })
    } else {
        //Check on Insert
        tag = await this.findOne({ name: _name, isActive: true }, { name: 1 })
    }
    return tag ? true : false;
}

const Tag = mongoose.model('tag', TagSchema);

module.exports = Tag;



