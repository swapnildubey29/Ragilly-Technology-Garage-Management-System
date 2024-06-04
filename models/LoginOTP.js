const mongoose = require('mongoose');

const loginOTPSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 
    }
})

module.exports = mongoose.model('LoginOTP', loginOTPSchema)
