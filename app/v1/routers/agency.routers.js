

const express = require('express');


const { showAcceptedDriver, showDriverRequiestToAgency, driverAccepted, blockedDriver } = require('../controllers/agency.controller');






const router = express.Router()

router.get('/showAcceptedDriver',showAcceptedDriver)
router.get('/showDriverRequiestToAgency',showDriverRequiestToAgency)
router.patch('/blockedDriver',blockedDriver)
router.patch('/driverAccepted',driverAccepted)




module.exports=router