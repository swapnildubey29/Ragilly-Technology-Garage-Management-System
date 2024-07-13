const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/order", upload.single("vehicle_image"), async (req, res) => {
  try {
    console.log("File:", req.file);
    let vehicleImageUrl = "";
    if (req.file) {
      const uploadPath = path.join(__dirname, "uploads", req.file.filename);
      vehicleImageUrl = `/uploads/${req.file.filename}`;
    }

    const orderData = {
      ...req.body,
      vehicle_image: vehicleImageUrl,
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route to get vehicle_image URL by order ID
router.get("/order/image", async (req, res) => {
  try {
    const { mobile, service_date, service_time } = req.query;

    if (!mobile || !service_date || !service_time) {
      return res.status(400).json({ error: "Missing query parameters" });
    }

    const order = await Order.findOne(
      { mobile, service_date, service_time },
      "vehicle_image"
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ vehicle_image: order.vehicle_image || "" });
  } catch (error) {
    console.error("Error retrieving vehicle image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Getting all order of the user
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

//latest order in profile section
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

router.delete("/deleteorder", async (req, res) => {
  const mobile = req.query.mobile;
  const vehicle_image = req.query.mobile;
  try {
    const order = await Order.findOneAndDelete({ mobile: mobile });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Delete image file or record here (assuming imagePath is the field)
    const imagePath = Order.find({ vehicle_image: vehicle_image });
    if (imagePath) {
      fs.unlinkSync(imagePath);
    }

    res.json({
      message: "Order data and associated image deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to delete order data and associated image" });
  }
});

module.exports = router;
