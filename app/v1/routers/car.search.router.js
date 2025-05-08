const express = require('express');
const { showTopCarForUser, filterCarsByBrand } = require('../controllers/car.search.controllers');






const router = express.Router()

router.get('/showTopCarForUser',showTopCarForUser)
// router.get('/filterCarsByBrand',filterCarsByBrand)



module.exports=router