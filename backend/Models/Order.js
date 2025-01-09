const mongoose = require('mongoose');
const { type } = require('os');
const path = require('path'); 


const orderSchema = new mongoose.Schema({
    passengerId:{type : String},
    driverId:{type : String},
    rideId:{type : String},
    conf:{type:Boolean , default:false},

   
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;