

const express = require('express');
const { getNotificationsByReceiverId, markNotificationAsRead, getNotificationById, adminNotifaction, countNotifection } = require('../controllers/notifaction.controller');




const router = express.Router()

router.get('/getNotificationsByReceiverId',getNotificationsByReceiverId)
router.get('/getNotificationById',getNotificationById)
router.patch('/markNotificationAsRead',markNotificationAsRead)
router.get('/adminNotifaction',adminNotifaction)
router.get('/countNotifection',countNotifection)




module.exports=router