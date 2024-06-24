const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const mongoose = require("mongoose");

router.get("/Allorder", async (req, res) => {
  try {
    const allOrders = await Order.find();
    res.json(allOrders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/userorder", async (req, res) => {
  try {
    const orderId = req.query.order_id;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/addquotation", async (req, res) => {
  const qoutationdata = req.body;

  Order.findByIdAndUpdate(
    qoutationdata.order_id,
    qoutationdata, // Update with the new data
    { new: true } // Return the updated document
  )
    .then((qoutationdata) => {
      if (!qoutationdata) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(qoutationdata);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

module.exports = router;
