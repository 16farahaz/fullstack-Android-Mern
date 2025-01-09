const express = require('express');
const router = express.Router();
const orderController = require('../Controller/OrderController');

// Create a new order
router.post('/orders', orderController.createOrder);

// Get all orders
router.get('/orders', orderController.getAllOrders);
// Get all orders
router.get('/ors/:userId', orderController.getOrdersByUserId);

// Get a single order by ID
router.get('/orders/:id', orderController.getOrderById);

// Update an order by ID
router.put('/orders/:id', orderController.updateOrder);

// Delete an order by ID
router.delete('/orders/:id', orderController.deleteOrder);

// Update 'conf' field of an order by ID
router.patch('/orders/:id/conf', orderController.updateOrderConf);


module.exports = router;
