const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const {User} = require("../models/User");
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
    const mechanics = await User.find({ role: 'mechanic' });
    res.json(mechanics);
  } catch (error) {
    console.error("Error fetching all Mechanics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
