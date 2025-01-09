// controllers/notificationController.js
const Not = require('../Models/Not');

// Create Notification
exports.createNotification = async (req, res) => {
  try {
    const not = new Not(req.body);
    await not.save();
    res.status(201).json(not);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Notifications
exports.getNotifications = async (req, res) => {
  try {
    const nots = await Not.find().populate('passengerId driverId');
    res.status(200).json(not);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getNotificationsByDriver = async (req, res) => {
  console.log('hello', req.params.driverId);  
  
  try {
    const driverId = req.params.driverId;

    if (!driverId) {
      return res.status(400).json({ error: 'Driver ID is required' });
    }

    const notifications = await Not.find({ driverId: driverId, type: 'order_request' })
      .populate('passengerId driverId');

    if (!notifications.length) {
      return res.status(404).json({ message: 'No notifications found' });
    }

    // Flatten data
    const formattedNotifications = notifications.map(not => ({
      id: not._id,
      type: not.type,
      message: not.message,
      createdAt: not.createdAt,
      passengerName: not.passengerId?.name || 'N/A',
      passengerLastName: not.passengerId?.lastname || 'N/A',
      passengerPhone: not.passengerId?.phone || 'N/A',
      driverName: not.driverId?.name || 'N/A',
      driverPhone: not.driverId?.phone || 'N/A',
    }));

    console.log(formattedNotifications);
    res.status(200).json(formattedNotifications);
    
  } catch (error) {
    console.log('Error: ', error.message);
    res.status(500).json({ error: error.message });
  }
};


// Get Notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const not = await Notification.findById(req.params.id).populate('passengerId driverId');
    if (!not) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json(not);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Notification
exports.updateNotification = async (req, res) => {
  try {
    const not = await Not.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!not) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json(not);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Update Notification
exports.AcceptNotif = async (req, res) => {
  try {
    const not = await Not.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!not) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json(not);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Delete Notification
exports.deleteNotification = async (req, res) => {
  try {
    const not = await Not.findByIdAndDelete(req.params.id);
    if (!not) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};