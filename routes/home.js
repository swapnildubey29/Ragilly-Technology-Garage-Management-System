const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const { User } = require('../models/User')

// Route to create a new order
router.post('/job', async (req, res) => {
    try {
        const orderData = req.body;
        console.log(orderData)
        const { mobile } = orderData;
        const newOrder = new Order(orderData)
        await newOrder.save()
        const existingUser = await User.findOne({ mobile })
        if (existingUser) {
            res.status(201).json({ success: true, redirect: '/login' })
        } else {
            res.status(201).json({ success: true, redirect: '/signup' })
        }
    } catch (error) {
        console.error("Error creating order:", error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router;
