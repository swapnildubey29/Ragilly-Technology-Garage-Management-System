const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { User } = require("../models/User");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

// Multer upload middleware
const upload = multer({ storage });

router.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route to create a new job
router.post("/job", upload.single("vehicle_image"), async (req, res) => {
  try {
    console.log("File:", req.file);
    let vehicleImageUrl = "";
    if (req.file) {
      const uploadPath = path.join(__dirname, "uploads", req.file.filename);
      vehicleImageUrl = `/uploads/${req.file.filename}`;    }

    const orderData = {
      ...req.body,
      vehicle_image: vehicleImageUrl,
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    const { mobile } = orderData;
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
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful" });
});

module.exports = router;
