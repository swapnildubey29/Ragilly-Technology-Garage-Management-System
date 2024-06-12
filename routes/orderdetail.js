const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const fs = require("fs");
const multer = require("multer");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

//Configuring Aws S3 Bucket
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Setting up Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Post request to Save Data Into Database
router.post("/order", upload.single("vehicle_image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${uuidv4()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Upload file to S3
    const data = await s3.upload(params).promise();

    // Create new order with the image URL
    const orderData = {
      ...req.body,
      vehicle_image: data.Location,
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orderdetails", (req, res) => {
  const mobile = req.query.mobile;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const skip = (page - 1) * limit;

  Order.find({ mobile: mobile })
    .skip(skip)
    .limit(limit)
    .then((orders) => {
      if (orders.length === 0) {
        return res.status(404).json({ error: "Orders not found" });
      }
      res.json(orders);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

//latest order
router.get("/currentorder", (req, res) => {
  const mobile = req.query.mobile;
  Order.find({ mobile: mobile })
    .sort({ createdAt: -1 }) // Sort by creation date in descending order
    .limit(1) // Limit to the most recent order
    .then((orders) => {
      if (orders.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(orders[0]);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

router.post("/editorder", (req, res) => {
  const updatedOrderData = req.body;

  Order.findOneAndUpdate(
    { mobile: updatedOrderData.mobile },
    updatedOrderData,
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

router.delete("/deleteorder", (req, res) => {
  const mobile = req.query.mobile;

  Order.findOneAndDelete({ mobile: mobile })
    .then((order) => {
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json({ message: "Order data deleted successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to delete order data" });
    });
});

module.exports = router;
