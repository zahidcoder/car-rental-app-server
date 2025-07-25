
const express = require('express');
const { signUp, verifyCode, resendOtp, signIn, forgotPassword, cahngePassword, changePasswordUseingOldPassword, userInformation, updatedUserProfile, agencyCollection, updatedDriverLicence, userInformationById, driverInformationById, deleteUser } = require('../controllers/userController');
const upload = require('../../../middlewares/fileuplode');
const authenticateUser = require('../../../middlewares/auth');
const { showUserWithDrivingLicence, makeuserVerified, getverifyedUsers } = require('../controllers/admin/user.controllers');
const { get } = require('mongoose');

const router = express.Router()

router.post('/user-signup',signUp)
router.post('/verify-code',verifyCode)
router.post('/resendOtp',resendOtp)
router.post('/signIn',signIn)
router.post('/forgotPassword',forgotPassword)
router.post('/cahngePassword',authenticateUser,cahngePassword)
router.patch('/changePasswordUseingOldPassword',authenticateUser,changePasswordUseingOldPassword)
router.get('/userInformation',authenticateUser,userInformation)
router.get('/userInformationById',authenticateUser,userInformationById)
router.patch('/updatedUserProfile',authenticateUser,upload,updatedUserProfile)
router.get('/agencyCollection',agencyCollection)
router.get('/driverInformationById',driverInformationById)
// driver updated 
router.patch('/updatedDriverLicence',authenticateUser,upload,updatedDriverLicence)

// for dashbored verified user show 
router.get('/showAlluserLicenceForAproved',authenticateUser,showUserWithDrivingLicence)
router.patch('/verify',authenticateUser,makeuserVerified)

router.get('/getverifyedUsers',getverifyedUsers)
router.delete('/deleteUser', authenticateUser, deleteUser);
module.exports=router