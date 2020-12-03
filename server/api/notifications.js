const { Router } = require("express");
const Notification = require('../models/notification')
const router = Router();

// get last notifications
router.get('/', async (req,res) =>{
    try{
        const notifications = await Notification.find({}).sort({ date: -1})
        res.json(notifications)
    }catch(err){
        console.error(err)
        res.json(err)
    }
})

// get last notifications
router.get('/last', async (req,res) =>{
    try{
        const notifications = await Notification.find({}).sort({ date: -1}).limit(1)
        res.json(notifications)
    }catch(err){
        console.error(err)
        res.json(err)
    }
})

module.exports = router;