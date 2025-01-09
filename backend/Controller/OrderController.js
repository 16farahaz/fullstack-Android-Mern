const Order = require('../Models/Order');
const User = require('../Models/User');
const Not=require('../Models/Not');
const Passenger=require('../Models/Passenger')
const Ride =require('../Models/Ride')






exports.createOrder = async (req, res) => {
    const io = req.app.get('socketio');  // Get socket.io instance
    const { passengerId, driverId, rideId } = req.body;
    const _id = driverId;

    try {
        // Fetch driver details using driverId
        const driver = await User.findById(_id);

        if (!driver) {
            return res.status(404).send({ message: 'Driver not found' });
        }

        // Create and save the order
        const order = new Order({ passengerId, driverId, rideId });
        const savedOrder = await order.save();

      
      

        // Save notification in the database for the driver
        const not = new Not({
            passengerId,
            driverId,
            rideId,
            type: 'order_request',
            message: `You have a new ride request, ${driver.name} ${driver.lastname}.`
        });
        await not.save();

        // Respond with success and saved order details
        res.status(201).send({
            message: 'Order placed successfully.',
            order: savedOrder
        });

    } catch (error) {
        console.error('Error placing order:', error.message);
        res.status(500).send({
            message: 'Failed to place order.',
            error: error.message
        });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update 'conf' field of an order by ID
exports.updateOrderConf = async (req, res) => {
    try {
        const { conf } = req.body;

        if (typeof conf !== 'boolean') {
            return res.status(400).json({ message: 'Invalid value for conf. Must be true or false.' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { conf },  // Only update the 'conf' field
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Controller to get orders based on userId
exports.getOrdersByUserId = async (req, res) => {
    const { userId } = req.params;  // Get userId from the URL parameters (params)
  
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    try {
      // Fetch all orders where conf is true and the userId is involved as driver or passenger
      const orders = await Order.find({ conf: true, $or: [{ driverId: userId }] });
  
      if (orders.length === 0) {
        return res.status(404).json({ message: 'No confirmed orders found for this user' });
      }
  
      // Fetch passenger details for all orders
      const orderDetails = await Promise.all(
        orders.map(async (order) => {
          // Assuming Passenger model exists and fetches passenger name by passengerId
          const passenger = await Passenger.findById(order.passengerId);
          const ride = await Ride.findById(order.rideId);
          console.log(passenger);
          console.log(ride);
  
          // Return order details including the passenger's info
          return {
            curlocation: ride.currentLocation,
            destination: ride.destination,
            passengerName: passenger && passenger.name ? passenger.name : 'Unknown',
            passengerLastName: passenger && passenger.lastname ? passenger.lastname : 'Unknown',
            passengerPhone: passenger && passenger.phone ? passenger.phone : 'Unknown',  // Added phone for completeness
            conf: order.conf,  // Ensure the confirmation status is also returned
          };
        })
      );
  
      return res.json({ orders: orderDetails });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
