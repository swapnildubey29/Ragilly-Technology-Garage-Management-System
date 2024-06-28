const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { User } = require("../models/User");

// Route to create a new order
router.post("/job", async (req, res) => {
  try {
    const orderData = req.body;
    console.log(orderData);
    const { mobile } = orderData;
    const newOrder = new Order(orderData);
    await newOrder.save();
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      res.status(201).json({ success: true, redirect: "/login" });
    } else {
      res.status(201).json({ success: true, redirect: "/signup" });
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Getting vehicle Data from Json file
router.get("/vehicleData", (req, res) => {
  fs.readFile("vehicleData.json", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error loading JSON data");
    } else {
      try {
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      } catch (err) {
        console.error("Error parsing JSON data:", err);
        res.status(500).send("Error parsing JSON data");
      }
    }
  });
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logout successful" });
});

module.exports = router;
