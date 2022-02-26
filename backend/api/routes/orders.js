const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const { orders_get_all, orders_create_order, orders_get_order, orders_delete_order } = require('../controllers/orders')

router.get('/', checkAuth, orders_get_all)

router.post('/', checkAuth, orders_create_order)

router.get('/:orderId', checkAuth, orders_get_order)

router.delete('/:orderId', checkAuth, orders_delete_order)

module.exports = router
