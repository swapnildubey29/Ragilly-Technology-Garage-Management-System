const express = require('express');
const router = express.Router();
const { User, OTP } = require('../models/User')

router.get('/userdetails', (req, res) => {
    const mobile = req.query.mobile;
    User.find({ mobile: mobile })
        .then(User => {
            if (User.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(User);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

router.post('/edituser', (req, res) => {
    const updatedUserData = req.body;

    User.findOneAndUpdate({ mobile: updatedUserData.mobile }, updatedUserData, { new: true })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(updatedUser);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        })
})

router.delete('/deleteuser', (req, res) => {
    const mobile = req.query.mobile; 

    User.findOneAndDelete({ mobile: mobile })
        .then(User => {
            if (!User) {
                return res.status(404).json({ error: "User not found" })
            }
            res.json({ message: 'User data deleted successfully' })
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete User data' });
        })
})

module.exports = router;
