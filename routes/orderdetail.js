const express = require("express")
const router = express.Router()
const Order = require("../models/Order")
const path = require("path")
const multer = require("multer")
const { v4: uuidv4 } = require("uuid")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/order", upload.single("vehicle_image"), async (req, res) => {
  try {
    console.log('File:', req.file);
    console.log('Body:', req.body);

    let vehicleImageUrl = "";
    if (req.file) {
      const uploadPath = path.join(__dirname, 'uploads', req.file.filename);
      console.log('File saved at:', uploadPath);
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


// Route to get vehicle_image URL by order ID
router.get("/order/:orderId/vehicle_image", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Extract vehicle_image URL from order
    const vehicleImageUrl = order.vehicle_image;

    if (!vehicleImageUrl) {
      return res
        .status(404)
        .json({ error: "Vehicle image not found for this order" });
    }

    // Assuming vehicle_image is stored as a relative URL, send it back
    res.json({ vehicle_image: vehicleImageUrl });
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