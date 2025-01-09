const mongoose = require('mongoose');
const { type } = require('os');
const path = require('path'); 


const notSchema = new mongoose.Schema({
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger', required: true },  // Receiver
  driverId :{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rideId :{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  type: { type: String, enum: ['order_request', 'order_accepted', 'order_rejected','order_cancelled'], required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Not', notSchema);
