const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String, 
    location: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        default: 'user',
    }
})

const otpSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: true,
        unique: true 
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600
    },
});


module.exports = {
    User: mongoose.model('User', userSchema),
    OTP: mongoose.model('OTP', otpSchema)
}