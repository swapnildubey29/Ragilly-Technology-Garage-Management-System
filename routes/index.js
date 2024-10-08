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

router.get('/admin_mechanics', (req,res) =>{
    res.render('admin_mechanics')
})

router.get('/mechanic',(req,res) => {
    res.render('mechanic')
})

router.get('/mechanic_order',(req,res)=>{
    res.render('mechanic_order')
})

router.get('/mechanic_allorder',(req,res)=>{
    res.render('mechanic_allorder')
})

router.get('/mechanic_userOrder',(req,res)=>{
    res.render('mechanic_userOrder')
})
module.exports = router