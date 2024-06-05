const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const fs = require('fs');


router.get('/vehicleData', (req, res) => {
    fs.readFile('vehicleData.json', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error loading JSON data');
      } else {
        try {
          const jsonData = JSON.parse(data);
          res.json(jsonData);
        } catch (err) {
          console.error('Error parsing JSON data:', err);
          res.status(500).send('Error parsing JSON data');
        }
      }
    });
  });

router.post('/order', async (req, res) => {
    try {
        const orderData = req.body
        const newOrder = new Order(orderData)
        await newOrder.save()
   
        res.status(201).json({ message: 'Order created successfully' })
    } catch (error) {
        console.error("Error creating order:", error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

router.get('/orderdetails', (req, res) => {
    const mobile = req.query.mobile;
    Order.find({ mobile: mobile })
        .then(orders => {
            if (orders.length === 0) {
                return res.status(404).json({ error: "Orders not found" });
            }
            res.json(orders);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        })
})

router.post('/editorder', (req, res) => {
    const updatedOrderData = req.body;

    Order.findOneAndUpdate({ mobile: updatedOrderData.mobile }, updatedOrderData, { new: true })
        .then(updatedOrder => {
            if (!updatedOrder) {
                return res.status(404).json({ error: "Order not found" })
            }
            res.json(updatedOrder);
        })
        .catch(error => {
            console.error(error)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

router.delete('/deleteorder', (req, res) => {
    const mobile = req.query.mobile; 

    Order.findOneAndDelete({ mobile: mobile })
        .then(order => {
            if (!order) {
                return res.status(404).json({ error: "Order not found" })
            }
            res.json({ message: 'Order data deleted successfully' })
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete order data' });
        })
})

module.exports = router;
