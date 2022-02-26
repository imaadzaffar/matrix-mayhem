const mongoose = require('mongoose')
const Product = require('../models/product')

const fs = require('fs')

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select('_id name price productImage')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            id: doc._id,
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            request: {
              type: 'GET',
              url: req.get('host') + '/products/' + doc._id,
            },
          }
        }),
      }
      // if (docs.length >= 0) {
      res.status(200).json(response)
      // } else {
      //   res.status(404).json({
      //     message: 'No entries found',
      //   })
      // }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        error: err,
      })
    })
}

exports.products_create_product = (req, res, next) => {
  console.log(req.file)
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  })
  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Created product successfully',
        createdProduct: {
          id: result._id,
          name: result.name,
          price: result.price,
          productImage: result.productImage,
          request: {
            type: 'GET',
            url: req.get('host') + '/products/' + result._id,
          },
        },
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        error: err,
      })
    })
}

exports.products_get_product = (req, res, next) => {
  const id = req.params.productId
  Product.findById(id)
    .select('_id name price productImage')
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          message: 'Retrieved product successfully',
          product: doc,
          request: {
            type: 'GET',
            description: 'Get all products',
            url: req.get('host') + '/products/',
          },
        })
      } else {
        res.status(404).json({ message: 'No valid entry found for provided ID' })
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        error: err,
      })
    })
}

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId
  const updateOps = {}
  for (let ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Updated product successfully',
        request: {
          type: 'GET',
          url: req.get('host') + '/products/' + id,
        },
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        error: err,
      })
    })
}

exports.products_delete_product = (req, res, next) => {
  const id = req.params.productId
  Product.findByIdAndDelete({ _id: id })
    .exec()
    .then((result) => {
      console.log(result)

      // Delete file from uploads folder
      fs.unlink(result.productImage, (err) => {
        if (err) {
          console.log(err)
          return
        }
      })

      res.status(200).json({
        message: 'Deleted product successfully',
        request: {
          type: 'GET',
          url: req.get('host') + '/products/' + id,
        },
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        error: err,
      })
    })
}
