const express = require('express');


const upload = require('../../../middlewares/fileuplode');
const { createChatRoom, getChatRooms } = require('../controllers/chatRoom.cntroller');
const { createDriverVehical } = require('../controllers/driverVehical');
const { opentTracker } = require('../controllers/driver.controller');



const router = express.Router()

router.post('/createDriverVehical',upload,createDriverVehical)
router.get('/getChatRooms',getChatRooms)
router.patch('/opentTracker',opentTracker)

module.exports=router