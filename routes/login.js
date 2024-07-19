const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const { parsePhoneNumberFromString } = require("libphonenumber-js");
const { User } = require("../models/User");
const LoginOTP = require("../models/LoginOTP");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

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

router.post("/login", async (req, res) => {
  const { mobile } = req.body;
  try {
    const formattedMobile = formatPhoneNumber(mobile);
    const user = await User.findOne({ mobile: mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let otpRecord = await LoginOTP.findOne({ mobile: mobile });
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    if (otpRecord) {
      otpRecord.otp = otp;
      await otpRecord.save();
    } else {
      otpRecord = await LoginOTP.create({ mobile: mobile, otp });
    }

       //Send OTP via Twilio
        await client.messages.create({
            body: `Your OTP for login is: ${otp}`,
            from: twilioPhoneNumber,
            to: formattedMobile
        });

    res.json({ success: true });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/verify-login", async (req, res) => {
  const { mobile, otp } = req.body;
  try {
    const otpRecord = await LoginOTP.findOne({ mobile, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // If OTP verification successful, fetch the user to check their role
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate JWT token
    const token = jwt.sign({ mobile }, process.env.SECRET_KEY, {
      expiresIn: "5d",
    });
    res.cookie("jwt", token, {
      maxAge: 5 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    if (user.role === "user") {
      res.status(201).json({ success: true, redirect: "/dashboard" });
    } else if (user.role === "admin") {
      res.status(201).json({ success: true, redirect: "/admin" });
    } else {
      res.status(201).json({ success: true, redirect: "/mechanic" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/verify-jwt", async (req, res) => {
  const { token } = req.body;
  try {
    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "JWT token not provided" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // Fetch the user using the mobile number from the decoded token
    const user = await User.findOne({ mobile: decoded.mobile });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    if (user.role === "admin") {
      res.json({ success: true, redirect: "/admin" });
    } else if (user.role === "mechanic") {
      res.json({ success: true, redirect: "/mechanic" });
    } else {
      res.json({ success: true, redirect: "/dashboard" });
    }
  } catch (error) {
    console.error("Error verifying JWT token:", error);
    res.status(401).json({ success: false, error: error.message });
  }
});

module.exports = router;