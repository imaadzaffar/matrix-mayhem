const mongoose = require('mongoose')

// Schema is the design
const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true },
})

// Model is the object blueprint
module.exports = mongoose.model('Product', productSchema)
