const mongoose = require('mongoose');
const { type } = require('os');
const path = require('path'); 


const userSchema = new mongoose.Schema({
    name: { type: String },
    lastname: { type: String },
    email: { type: String, unique: true, required: true, index: true },
    country:{
        type:String , required:true
    },
    motpasse: { type: String, required: true },
    serie:{ type: String , default :'not driver' },
    mark:{type:String , default: 'not driver'},
    image: {
        type: String,
        default: path.join('Uploads', 'userr.png') // Default image path
    },
    imageUri:{
        type:String,
        required:true,
    },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' } ,
    role: { type: String, enum: ['Driver', 'Passenger', 'Superadmin'], default: 'Driver' }
});

const User = mongoose.model('User', userSchema);
module.exports = User;