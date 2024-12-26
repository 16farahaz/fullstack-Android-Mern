const express = require('express');
require('./config/dbconfig');
 const cors = require('cors');
const fileUpload = require('express-fileupload'); 
const app = express();
const PORT = 5000;
// Use fileUpload middleware
app.use(fileUpload());
const UserRoutes=require("./Routes/Userroute");
const PassengerRoutes=require("./Routes/PassengerRoute");
const RideRoutes=require("./Routes/Rideroute")
// Middleware to parse JSON
app.use(express.json());


// Middleware to parse URL-encoded data (for form submissions)
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("./Uploads", express.static(__dirname + "/uploads"));
app.use("/user",UserRoutes);
app.use("/passenger",PassengerRoutes);
app.use("/ride",RideRoutes);
app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running,and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
   





);
