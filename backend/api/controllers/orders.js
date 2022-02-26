const mongoose = require('mongoose')

const Order = require('../models/order')
const Product = require('../models/product')

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select('_id product quantity')
    .populate('product', 'name')
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => ({
          id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: 'GET',
            url: req.get('host') + '/orders/' + doc.id,
          },
        })),
      })
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      })
    })
}

exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        })
      }

      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity,
      })
      return order.save()
    })
    .then((result) => {
      console.log(result)
      res.status(201).json({
        message: 'Successfully stored order',
        createdOrder: {
          id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        request: {
          type: 'GET',
          url: req.get('host') + '/orders/' + result._id,
        },
      })
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      })
    })
}

exports.orders_get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found',
        })
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          description: 'Get all orders',
          url: req.get('host') + '/orders/',
        },
      })
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      })
    })
}

exports.orders_delete_order = (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Successfully deleted order',
        request: {
          type: 'POST',
          url: req.get('host') + '/orders/',
          body: {
            productId: 'ID',
            quantity: 'Number',
          },
        },
      })
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      })
    })
}
