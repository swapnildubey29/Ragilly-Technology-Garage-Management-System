const express = require('express')
const router = express.Router()
const Order = require('../models/Order')

router.get("/Allorder-location", async (req, res) => {
    try {
        const userLocation = "Chandigarh"; 
        const allOrders = await Order.find({ location: userLocation }); 
        res.json(allOrders);
    } catch (error) {
        console.log("Error Fetching all Orders", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;