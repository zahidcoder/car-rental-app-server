

const express = require('express');

const { createPayment } = require('../controllers/payment.controller');
const { earningRation, payedUsers, dashboredBar } = require('../controllers/admin/earning.controller');




const router = express.Router()

router.post('/createPayment',createPayment)

router.get('/earningRation',earningRation)
router.get('/payedUsers',payedUsers)
router.get('/dashboredBar',dashboredBar)





module.exports=router