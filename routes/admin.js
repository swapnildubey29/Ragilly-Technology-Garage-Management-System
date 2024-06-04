const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/Allorder', async (req, res) => {
    try {
        const allOrders = await Order.find();
        res.json(allOrders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/userorder', async (req, res) => {
    try {
        const mobile = req.query.mobile;
        const orders = await Order.find({ mobile: mobile }); // Filter zorders by mobile number
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/addquotation', async (req,res) =>{
         const qoutationdata = req.body
         const mobile = req.query.mobile;
           Order.findOneAndUpdate({ mobile: qoutationdata.mobile }, qoutationdata, { new: true })
           .then(qoutationdata => {
               if (!qoutationdata) {
                   return res.status(404).json({ error: "Order not found" })
               }
               res.json(qoutationdata);
           }) 
           .catch(error => {
               console.error(error)
               res.status(500).json({ error: 'Internal Server Error' })
           })
   });
   
module.exports = router;