const express = require('express')
const orderController = require('../controllers/orders.controller')


const router = express.Router()


router.post('/orders', orderController.setOrders)
router.get('/orders', orderController.orders)
router.get('/orders/:id', orderController.orderById)
router.patch('/orders/:id', orderController.updateOrder)
router.delete('/orders/:id', orderController.cancelOrder)


module.exports = router