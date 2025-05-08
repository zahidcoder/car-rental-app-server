const express = require('express');

const { addCar, getAllCars, getUserCars, getCarDetails, carAbialelityByAgency, getFilteredCars, getAvailableCarsByDate } = require('../controllers/car.controllers');
const upload = require('../../../middlewares/fileuplode');



const router = express.Router()

router.post('/addCar',upload,addCar)
router.get('/getAllCars',getAllCars)
router.get('/getUserCars',getUserCars)
router.get('/getCarDetails',getCarDetails)
router.patch('/carAbialelityByAgency',carAbialelityByAgency)
// get filter the  for all car
router.get('/getFilteredCars',getFilteredCars)
router.get('/getAvailableCarsByDate',getAvailableCarsByDate)

module.exports=router