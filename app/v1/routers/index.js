const express = require('express');

const userRouter=require('../routers/user.routers');

const locationRouter=require('../routers/location.routers');
const userSetting=require('../routers/setting.routers')
const carRouter=require('../routers/car.routers')
const carSearchRouter=require('../routers/car.search.router')



const authenticateUser = require('../../../middlewares/auth');

const carBrandRouter=require('../routers/carBrand.routers')
const vehicalRouter=require('../routers/vehical.router')
const carBookingrouter=require('../routers/bookCar.router')
const userBookingrouter=require('../routers/userBooking.routers')
const agencyBookingrouter=require('../routers/agencyBooking.routers')
const reviewRouters=require('../routers/review.routers')
const agenyrouter=require('../routers/agency.routers')
const userRouterInDashborad=require('../routers/admin/users.controller')
const chatRoomrouters=require('../routers/chatRoom.routers')
const driverVehicalRouters=require('../routers/driverVehical.router')
const privacyRouter=require('../routers/admin/privacyRouter')
const notifactionRoueter=require('../routers/notifaction.router')
const payemtnrouters=require('../routers/payment.routers')
const reviewuserRouters=require('../routers/userReview.router')


const router = express.Router();

// Define your routes here
router.use('/users', userRouter);

// car serching 
router.use('/car-search',authenticateUser,carSearchRouter)

// user location 

router.use('/location',authenticateUser,locationRouter)

// all route of the car releted
router.use('/car-for',authenticateUser,carRouter)

// car barnd name 
router.use('/car-brand',carBrandRouter)
// vehical 
router.use('/vehical-add',vehicalRouter)

//car booking router 
router.use('/car-booking',authenticateUser,carBookingrouter)
router.use('/user-booking',authenticateUser,userBookingrouter)
router.use('/agency-booking',authenticateUser,agencyBookingrouter)
// review section 
router.use('/car-review',authenticateUser,reviewRouters)
router.use('/user-review',authenticateUser,reviewuserRouters)

// show the agency all the driver and th-------------------
//=-------------------------
router.use('/agency',authenticateUser,agenyrouter)

// user show setting

router.use('/setting',userSetting)
router.use('/admin-privacy',authenticateUser,privacyRouter)
// driver vehical 

router.use('/driver-vehical',authenticateUser,driverVehicalRouters)


// admin --------------------
// /-=======--------------------
 
router.use('/admin-dashboard',userRouterInDashborad)


// this is messaging section 
//------------//==============
router.use('/chat-room',authenticateUser,chatRoomrouters)

router.use('/notification',authenticateUser,notifactionRoueter)
router.use('/payment',authenticateUser,payemtnrouters)









  
  module.exports = router;