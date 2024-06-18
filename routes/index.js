const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

router.get('/order', (req,res) =>{
    res.render('order')
})

router.get('/orderdetail', (req,res) =>{
    res.render('orderdetail')
})

router.get('/profile', (req,res) =>{
    res.render('profile')
})

router.get('/admin', (req,res) => {
    res.render('admin')
})

router.get('/admin_order',(req,res) =>{
    res.render('admin_order')
})

router.get('/mechanic',(req,res) => {
    res.render('mechanic')
})

module.exports = router