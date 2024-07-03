const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { User } = require("../models/User");
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

router.get("/mechanics", async (req, res) => {
  try {
    const mechanics = await User.find({ role: "mechanic" });
    res.json(mechanics);
  } catch (error) {
    console.error("Error fetching all Mechanics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Route to Select Mechanic for the order.
router.post("/assign-mechanic", async (req, res) => {
  const { recordId, mechanicId } = req.body;

  Order.findByIdAndUpdate(
    recordId,
    { $set: { mechanic: mechanicId } },
    { new: true }
  )
    .then((updatedOrder) => {
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(updatedOrder);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

module.exports = router;
