const mongoose = require('mongoose');
const { type } = require('os');
const path = require('path'); 


const rideSchema = new mongoose.Schema({
    userId:{type : String},
    destination : { type: String },
    currentLocation: { type: String },
    Datee:{type:Date , required:true},
    timeText: { type: String ,required: true},
    passenger:{type:Number , required:true},
    price:{type:Number , required:true},

    available:{type:Boolean , default:true}
   
});

const Ride = mongoose.model('Ride', rideSchema);
module.exports = Ride;