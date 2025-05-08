const express = require('express');


const { createCarBrand, getCarTypeByBrandName, getAllCarBrands, getCarsByBrandName, getAllCarBrandNames, getAllCarTypes, updateCarBrand, deleteCarBrand, showCarBrandById } = require('../controllers/carBrand.controllers');
const upload = require('../../../middlewares/fileuplode');
const authenticateUser = require('../../../middlewares/auth');



const router = express.Router()

router.post('/createCarBrand',authenticateUser,upload,createCarBrand)
router.patch('/updateCarBrand',authenticateUser,upload,updateCarBrand)
router.get('/showCarBrandById',authenticateUser,showCarBrandById)
router.delete('/deleteCarBrand',authenticateUser,deleteCarBrand)

// show the type of the car by the name of logo
router.get('/getCarTypeByBrandName',getCarTypeByBrandName)
// get all car types 
router.get('/getAllCarTypes',getAllCarTypes)

// get all car brand 
router.get('/getAllCarBrands',getAllCarBrands)
// get all car by brand name
router.get('/getCarsByBrandName',getCarsByBrandName)
// get all car band name 
router.get('/getAllCarBrandNames',getAllCarBrandNames)

module.exports=router