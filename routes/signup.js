const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, OTP } = require('../models/User');

router.post('/signup', async (req, res) => {
    const { name, email, mobile } = req.body;
    try {
        const existingUser = await User.findOne({ mobile });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this mobile number already exists" });
        }
        
        const user = await User.create({ name, email, mobile });
        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpRecord = await OTP.create({ mobile: mobile, otp });
        
        // Generate JWT token
        const token = jwt.sign({ mobile: user.mobile }, process.env.SECRET_KEY, { expiresIn: '5d' });
        res.cookie('jwt', token, { maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true });

        res.status(201).json({ success: true, message: "User created successfully", mobile: mobile, otpId: otpRecord._id, token });
    } catch (error) {
        console.error("Error creating user or sending OTP:", error);
        res.status(500).json({ success: false, message: "Failed to create user or send OTP", error: error.message });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { mobile, otp } = req.body;
    try {
        const otpRecord = await OTP.findOne({ mobile, otp });
        if (otpRecord) {
            res.status(200).json({ success: true, message: "OTP verified successfully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ success: false, message: "Failed to verify OTP", error: error.message });
    }
})


module.exports = router;
