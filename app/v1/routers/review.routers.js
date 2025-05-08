
const express = require('express');

const { createReview, getReviewsByCarId, reviewChartByCarId } = require('../controllers/review.controller');



const router = express.Router()

router.post('/createReview',createReview)

// get review by car id 
router.get('/getReviewsByCarId',getReviewsByCarId)
router.get('/reviewChartByCarId',reviewChartByCarId)

module.exports=router