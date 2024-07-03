const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const {User} = require('../models/User')

router.get('/All-Assigned-orders', async (req, res) => {
  try {
    const mobile = req.query.mobile;
    const user = await User.findOne({ mobile: mobile }); 
    const mechanicName = user.name;
    const allOrders = await Order.find({ mechanic: mechanicName });
    res.json(allOrders);
  } catch (error) {
    console.log("Error Fetching all Orders", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Route to Add Quotation
router.post("/addquotation", async (req, res) => {
    const qoutationdata = req.body;
  
    Order.findByIdAndUpdate(qoutationdata.order_id,qoutationdata, 
      { new: true } 
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
 
  //On Clicking on the order Getting particular Order Details
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

module.exports = router;