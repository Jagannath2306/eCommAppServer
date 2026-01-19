const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is Required !!'],
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is Required !!']
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  imagePath: {
    type: String,
    required: [true, 'Image Path is Required !!']
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

CategorySchema.statics.isExists = async function isExists(_name, id) {
    let category;
    if (id) {
        // Check on Update
        category = await this.findOne({ name: _name, isActive: true, _id: { $ne: id } }, { name: 1 })
    } else {
        //Check on Insert
        category = await this.findOne({ name: _name, isActive: true }, { name: 1 })
    }
    return category ? true : false;
}


const Category = mongoose.model('category', CategorySchema);

module.exports = Category;
