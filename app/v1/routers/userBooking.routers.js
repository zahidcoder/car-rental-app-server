const express = require('express');

const { showUserBookings, searchCarByDate,  } = require('../controllers/userBooking.controller');







const router = express.Router()

router.get('/showUserBookings',showUserBookings)
router.get('/searchCarByDate',searchCarByDate)





module.exports=router