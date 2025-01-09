// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../Controller/NotificationController');

router.post('/add', notificationController.createNotification);
router.get('/all', notificationController.getNotifications);
router.get('/:id', notificationController.getNotificationById);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);
router.get('/mynotif/:driverId', notificationController.getNotificationsByDriver);


module.exports = router;