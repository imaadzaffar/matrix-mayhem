const mongoose = require('mongoose')

// Schema is the design
const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
})

// Model is the object blueprint
module.exports = mongoose.model('Order', orderSchema)
