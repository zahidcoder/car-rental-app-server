const express = require('express');


const { showAllUserInAdmin, showUserById, showAllAgencyInAdmin, showAllDriverInAdmin } = require('../../controllers/admin/user.controllers');






const router = express.Router()

router.get('/showAllUserInAdmin',showAllUserInAdmin)
router.get('/showAllAgencyInAdmin',showAllAgencyInAdmin)
router.get('/showAllDriverInAdmin',showAllDriverInAdmin)
router.get('/showUserById',showUserById)





module.exports=router