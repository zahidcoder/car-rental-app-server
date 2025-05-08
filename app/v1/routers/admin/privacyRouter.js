const express = require('express');



const { updateTerms, updatePrivacy, updateAboutUs, updateContact } = require('../../controllers/admin/privacypolicy.controller');






const router = express.Router()

router.patch('/updatePrivacy',updatePrivacy)
router.patch('/updateTerms',updateTerms)
router.patch('/updateAboutUs',updateAboutUs)
router.patch('/updateContact',updateContact)




module.exports=router