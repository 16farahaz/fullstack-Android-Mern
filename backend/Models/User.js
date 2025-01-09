const mongoose = require('mongoose');
const { type } = require('os');
const path = require('path'); 


const userSchema = new mongoose.Schema({
  
    name: { type: String , default:''},
    lastname: { type: String , default:''},
    email: { type: String, unique: true, required: true, index: true },
    country:{
        type:String , required:true , default:'' 
    },
    motpasse: { type: String, required: true },
    phone:{type:Number,required:true},
    serie:{ type: String , default :'not driver' , default:''},
    mark:{type:String , default: 'not driver', default:''},
    image: {
        type: String,
        default: path.join('Uploads', 'userr.png') // Default image path
    },
    imageUri:{
        type:String,
        required:true,
        default: path.join('Uploads', 'userr.png') // Default image path
    },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' } ,
    role: { type: String, enum: ['Driver', 'Passenger', 'Superadmin'], default: 'Driver' }
});

const User = mongoose.model('User', userSchema);
module.exports = User;