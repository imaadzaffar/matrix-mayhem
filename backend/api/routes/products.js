const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const checkAuth = require('../middleware/check-auth')

const {
  products_get_all,
  products_create_product,
  products_get_product,
  products_update_product,
  products_delete_product,
} = require('../controllers/products')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error('Not valid file type'), false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
})

router.get('/', products_get_all)

router.post('/', checkAuth, upload.single('productImage'), products_create_product)

router.get('/:productId', products_get_product)

router.patch('/:productId', checkAuth, products_update_product)

router.delete('/:productId', checkAuth, products_delete_product)

module.exports = router
