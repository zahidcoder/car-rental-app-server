const pagination = require("../../../helpers/pagination");
const Response = require("../../../helpers/respones");
const BookCar = require("../models/BookCar");
const User = require("../models/User");


const showDriverBookings = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const userId = req.user._id; // Get the logged-in user's ID from the request
      const { driverStatus } = req.query;
  
      // Create a dynamic filter object
      const filter = { driverId:userId };
      if (driverStatus) {
        filter.driverStatus = driverStatus; // Add BookingStatus to the filter if provided
      }
 
   
      // Count total bookings for the filter
      const userBookingsLength = await BookCar.find(filter).countDocuments();
  
      // Fetch bookings with pagination
      const userBookings = await BookCar.find(filter).populate('userId carId')
        .skip((page - 1) * limit)
        .limit(limit);
  console.log(filter);
      // Check if bookings exist
      if (!userBookings.length) {
        return res.status(404).json(
          Response({
            status: 'error',
            statusCode: 404,
            message: driverStatus
              ? `No bookings found for the status of ${driverStatus}`
              : 'No bookings found for the user.',
          })
        );
      }
  
      // Generate pagination data
      const paginationData = pagination(userBookingsLength, limit, page);
  
      // Return the user's bookings
      res.status(200).json(
        Response({
          status: 'success',
          statusCode: 200,
          message: 'User bookings fetched successfully',
          data: userBookings,
          pagination: paginationData,
        })
      );
    } catch (error) {
      next(error); // Pass error to middleware for centralized error handling
    }
  };


  const driverAcceptOrder=async(req,res,next)=>{
    try {
      const driverId=req.user._id
      const {id}=req.query

      const books=await BookCar.findByIdAndUpdate(id,{isdriverAccept:true,driverStatus:"accept"})
      res.status(200).json(
        Response({
          status: 'success',
          statusCode: 200,
          message: 'driver bookings accept successfully',
          data: books,
         
        })
      );
    } catch (error) {
      next(error)
    }
  }
  const driverCancelOrder=async(req,res,next)=>{
    try {
      const driverId=req.user._id
      const {id}=req.query

      const books=await BookCar.findByIdAndUpdate(id,{driverId:null,driverStatus:"newOrder",status:"inprogress"},{new:true})
      res.status(200).json(
        Response({
          status: 'success',
          statusCode: 200,
          message: 'driver bookings cancle successfully',
          data: books,
         
        })
      );
    } catch (error) {
      next(error)
    }
  }

  const driverDashbored=async(req,res,next)=>{
    try {

        const driverId=req.user._id

        const driverDelivered = await BookCar.find({driverId:driverId,driverStatus:"delivered"}).countDocuments()
        
        const drivercancelledOrder = await BookCar.find({driverId:driverId,driverStatus:"cancelled"}).countDocuments()
        const total = await BookCar.find({driverId:driverId}).countDocuments()

        const driverCancelAdnDelivered= driverDelivered +drivercancelledOrder
      const activeOrder=total-driverCancelAdnDelivered

        const dashbordedata={
            totalDelivered:driverDelivered,
            activeOrder:activeOrder
        }

// Return the user's bookings
res.status(200).json(
    Response({
      status: 'success',
      statusCode: 200,
      message: 'User bookings fetched successfully',
      data: dashbordedata,
    
    })
  )
        
    } catch (error) {
        next(error)
    }
  }
  
// const driverDashbored = async (req, res, next) => {
//     try {
//         const driverId = req.user._id;

//         // Use aggregation for better performance
//         const [stats] = await BookCar.aggregate([
//             { $match: { driverId: driverId } }, // Match only orders for the driver
//             {
//                 $group: {
//                     _id: null,
//                     totalOrders: { $sum: 1 },
//                     deliveredOrders: {
//                         $sum: { $cond: [{ $eq: ["$driverStatus", "delivered"] }, 1, 0] },
//                     },
//                     cancelledOrders: {
//                         $sum: { $cond: [{ $eq: ["$driverStatus", "cancelled"] }, 1, 0] },
//                     },
//                 },
//             },
//         ]);

//         console.log(driverId);

//         // If no orders found, handle null stats
//         const totalOrders = stats?.totalOrders || 0;
//         const deliveredOrders = stats?.deliveredOrders || 0;
//         const cancelledOrders = stats?.cancelledOrders || 0;

//         // Calculate active orders
//         const activeOrders = totalOrders - (deliveredOrders + cancelledOrders);

//         // Prepare dashboard data
//         const dashboardData = {
//             totalDelivered: deliveredOrders,
//             activeOrder: activeOrders,
//         };

//         // Return the response
//         res.status(200).json(
//             Response({
//                 status: 'success',
//                 statusCode: 200,
//                 message: 'Driver dashboard data fetched successfully',
//                 data: dashboardData,
//             })
//         );
//     } catch (error) {
//         next(error);
//     }
// };


const driverBookCarToDelivery = async (req, res, next) => {
  try {
      const { bookStatus, BookId } = req.query;

      // Validate input
      if (!bookStatus || !BookId) {
          return res.status(400).json({
              status: "error",
              statusCode: 400,
              message: "Both bookStatus and BookId are required.",
          });
      }

      // Validate bookStatus against the enum values
      const validStatuses = [
          "ontheWayToPicup",
          "arriveStore",
          "carPicked",
          "onthewaytoDeliver",
          "arrivedAttlocation",
          "arrivedinAgency",
          "arrivedToUser",
      ];

      if (!validStatuses.includes(bookStatus)) {
          return res.status(400).json({
              status: "error",
              statusCode: 400,
              message: `Invalid bookStatus. Valid statuses are: ${validStatuses.join(", ")}`,
          });
      }

      // Update the driverDeliveryStatuse and potentially bookingStatus
      const updateData = {
          driverDeliveryStatuse: bookStatus,
      };

      // If the status is "arrivedToUser", also update the bookingStatus to "delivered"
      if (bookStatus === "arrivedToUser") {
          updateData.BookingStatus = "delivered";
          updateData.status = "delivered";
          updateData.driverStatus = "delivered";
      }

      const updatedBooking = await BookCar.findByIdAndUpdate(
          BookId,
          updateData,
          { new: true } // Return the updated document
      );

      if (!updatedBooking) {
          return res.status(404).json({
              status: "error",
              statusCode: 404,
              message: "Booking not found.",
          });
      }

      res.status(200).json({
          status: "success",
          statusCode: 200,
          message: "Driver delivery status updated successfully.",
          data: updatedBooking,
      });
  } catch (error) {
      next(error); // Pass error to centralized error handler
  }
};


const opentTracker=async(req,res,next)=>{
  try {
    const {bookId,statuse}=req.query
    
    const book=await BookCar.findOneAndUpdate(bookId,{driverDeliveryStatuse:statuse},{new:true})

    
// Return the user's bookings
res.status(200).json(
  Response({
    status: 'success',
    statusCode: 200,
    message: 'driver  tracking started',
    data: book,
  
  })
)
  } catch (error) {
    next(error)
  }
}
const driverstatus=async(req,res,next)=>{
  try {
    const {bookId}=req.query
    
    const book=await BookCar.findByIdAndUpdate(bookId,{driverStatus:"inprogress",BookingStatus:"ongoing"},{new:true})
    console.log(book,bookId);

    
// Return the user's bookings
res.status(200).json(
  Response({
    status: 'success',
    statusCode: 200,
    message: 'driver  car maked inprogress started',
    data: book,
  
  })
)
  } catch (error) {
    next(error)
  }
}
const trackTheDriverForCar=async(req,res,next)=>{
  try {
    const {bookId}=req.query
const book=await BookCar.findById(bookId)
    const agency=await User.findById(book.agencyId)

    
  } catch (error) {
    next(error)
  }
}

  
  module.exports={
    showDriverBookings,
    driverDashbored,
    driverAcceptOrder,
    driverCancelOrder,
    driverBookCarToDelivery,
    opentTracker,
    driverstatus
  }