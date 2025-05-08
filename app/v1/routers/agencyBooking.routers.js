const express = require('express');


const { showAgencyBookings, showBookingDetails, assigneDriver, acceptOrder, showAllDriverInagent, agencyDashboard, cancelledOrder, agentDeliveried } = require('../controllers/agencyBooking.controller');
const { showDriverBookings, driverDashbored, driverAcceptOrder, driverCancelOrder, driverBookCarToDelivery, opentTracker, driverstatus } = require('../controllers/driver.controller');






const router = express.Router()

router.get('/showAgencyBookings',showAgencyBookings)
router.get('/showBookingDetails',showBookingDetails)
router.patch('/assigneDriver',assigneDriver)
router.patch('/acceptOrder',acceptOrder)
router.patch('/cancelledOrder',cancelledOrder)
router.get('/agencyDashboard',agencyDashboard)
router.patch('/agentDeliveried',agentDeliveried)

// driver booking 

router.get('/showDriverBookings',showDriverBookings)
router.get('/showAllDriverInagent',showAllDriverInagent) 
router.get('/driverDashbored',driverDashbored) 

// driver accept and cencel

router.patch('/driverAcceptOrder',driverAcceptOrder)
router.patch('/driverCancelOrder',driverCancelOrder)
router.patch('/driverBookCarToDelivery',driverBookCarToDelivery)
router.patch('/opentTracker',opentTracker)
router.patch('/driverstatus',driverstatus)




module.exports=router