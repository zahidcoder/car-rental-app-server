
const express = require('express');


const { createUserReview, showRewiewForUser } = require('../controllers/userReview.controller');



const router = express.Router()

router.post('/createUserReview',createUserReview)
router.get('/showRewiewForUser',showRewiewForUser)


module.exports=router