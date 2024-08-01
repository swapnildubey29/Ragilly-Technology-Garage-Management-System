const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { User } = require("../models/User");
const twilio = require("twilio");
const { parsePhoneNumberFromString } = require("libphonenumber-js");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID; 

router.get("/All-Assigned-orders", async (req, res) => {
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
// router.post("/addquotation", async (req, res) => {
//   const qoutationdata = req.body;

//   Order.findByIdAndUpdate(qoutationdata.order_id, qoutationdata, { new: true })
//     .then((qoutationdata) => {
//       if (!qoutationdata) {
//         return res.status(404).json({ error: "Order not found" });
//       }
//       res.json(qoutationdata);
//     })
//     .catch((error) => {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     });
// });

// Function to format phone number to E.164 format
function formatPhoneNumber(phoneNumber, countryCode = "IN") {
  try {
    const number = parsePhoneNumberFromString(phoneNumber, countryCode);
    if (!number || !number.isValid()) {
      throw new Error("Invalid phone number");
    }
    return number.formatInternational();
  } catch (error) {
    console.error("Error formatting phone number:", error.message);
    throw error;
  }
}

router.post("/addquotation", async (req, res) => {
  const quotationData = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      quotationData.order_id,
      quotationData,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Formating the user's mobile number to E.164 format
    const formattedPhoneNumber = formatPhoneNumber(updatedOrder.mobile, "IN");

    // Preparing SMS message content
    const messageContent = `
      Dear User,
      Your Order quotation has been updated:
      Quotation: ${quotationData.quotation}
      Price: ${quotationData.price}
      Discount: ${quotationData.discount}%
      Payable Price: ${quotationData.payable_price}
      Status: ${quotationData.status}
    `;

    //Sending SMS using Twilio
    const message = await client.messages.create({
      body: messageContent,
      messagingServiceSid: messagingServiceSid, 
      to: formattedPhoneNumber,
    });

    console.log(`SMS sent successfully: ${message.sid}`);

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error adding quotation and sending SMS:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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
