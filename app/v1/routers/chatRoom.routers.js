const express = require('express');


const upload = require('../../../middlewares/fileuplode');
const { createChatRoom, getChatRooms, sendMessage, showMessages, sendImage, getUnseenMessageCount } = require('../controllers/chatRoom.cntroller');



const router = express.Router()

router.post('/createChatRoom',createChatRoom)
router.get('/getChatRooms',getChatRooms)
router.get('/getUnseenMessageCount',getUnseenMessageCount)

// message
router.post('/sendMessage',sendMessage)
router.get('/showMessages',showMessages)
router.post('/sendImage',upload,sendImage)


module.exports=router