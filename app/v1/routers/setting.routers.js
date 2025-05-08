
const express = require('express');
const { showPrivacy, showTerms, showAboutUs, showContact } = require('../controllers/setting.controllers');




const router = express.Router()

router.get('/showPrivacy',showPrivacy)
router.get('/showTerms',showTerms)
router.get('/showAboutUs',showAboutUs)
router.get('/showContact',showContact)

module.exports=router