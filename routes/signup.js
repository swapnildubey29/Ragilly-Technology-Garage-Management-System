const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const { parsePhoneNumberFromString } = require("libphonenumber-js");
const { User, OTP } = require("../models/User");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID; // Add this line

const client = twilio(accountSid, authToken);

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

router.post("/signup", async (req, res) => {
  const { name, email, mobile } = req.body;
  try {
    const formattedMobile = formatPhoneNumber(mobile);
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this mobile number already exists",
      });
    }

    let otpRecord = await OTP.findOne({ mobile });
    if (otpRecord) {
      otpRecord.otp = Math.floor(1000 + Math.random() * 9000);
      await otpRecord.save();
    } else {
      otpRecord = await OTP.create({
        mobile: mobile,
        otp: Math.floor(1000 + Math.random() * 9000),
      });
    }

    await client.messages.create({
      body: `Your OTP for Registering Account is: ${otpRecord.otp}`,
      messagingServiceSid: messagingServiceSid, // Use Messaging Service SID here
      to: formattedMobile,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      mobile: mobile,
      otpId: otpRecord._id,
    });
  } catch (error) {
    console.error("Error creating user or sending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user or send OTP",
      error: error.message,
    });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { mobile, otp, name, email } = req.body;

  try {
    const otpRecord = await OTP.findOne({ mobile, otp });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    await OTP.deleteOne({ _id: otpRecord._id });

    let user = await User.findOne({ mobile });

    if (!user) {
      user = new User({ name, email, mobile });
    } else {
      user.name = name;
      user.email = email;
    }
    await user.save(); 

    // Generate JWT token
    const token = jwt.sign({ mobile: user.mobile }, process.env.SECRET_KEY, {
      expiresIn: "5d",
    });

    // Set cookie with the JWT token
    res.cookie("jwt", token, {maxAge: 5 * 24 * 60 * 60 * 1000,httpOnly: true,});
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      redirectTo: "/dashboard",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }

});

module.exports = router;