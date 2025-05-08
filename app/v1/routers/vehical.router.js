const express = require('express');

const { createVehical, getVehicals, getVehicalsById, deleteVehicalById, updateVehicalById } = require('../controllers/vehical.controller');






const router = express.Router()

router.post('/createVehical',createVehical)
router.get('/getVehicals',getVehicals)
router.get('/getVehicalsById',getVehicalsById)
router.delete('/deleteVehicalById',deleteVehicalById)
router.patch('/updateVehicalById',updateVehicalById)





module.exports=router