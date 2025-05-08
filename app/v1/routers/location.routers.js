
const express = require('express');
const { createLocation } = require('../controllers/location.controllers');



const router = express.Router()

router.post('/createLocation',createLocation)

module.exports=router