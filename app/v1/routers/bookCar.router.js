const express = require('express');


const { createBooking } = require('../controllers/bookCar.controller');
const upload = require('../../../middlewares/fileuplode');



const router = express.Router()

router.post('/createBooking',upload,createBooking)


module.exports=router