const { sendNotification } = require("../../../config/push-notifaction");
const pagination = require("../../../helpers/pagination");
const Response = require("../../../helpers/respones");
const BookCar = require("../models/BookCar");
const Car = require("../models/Car");
const User = require("../models/User");

// const showAgencyBookings = async (req, res, next) => {
//     try {
//       // Validate and parse pagination params
//       let page = parseInt(req.query.page, 10) || 1;
//       let limit = parseInt(req.query.limit, 10) || 10;
      
  
//       const agencyId = req.user._id; // Logged-in user's ID
//       const { status } = req.query;
  
//       // Construct query dynamically
//       const query = { agencyId };
//       if (status) {
//         query.status = status;
//       }
  
//       // Fetch total documents for pagination
//       const userBookingsLength = await BookCar.find(query).countDocuments();
  
//       // Fetch paginated bookings
//       const userBookings = await BookCar.find(query).populate("carId driverId userId agencyId")
//         .skip((page - 1) * limit)
//         .limit(limit)
//         .sort({createdAt:-1})

       
  
//       // Check if bookings exist
//       if (!userBookings.length) {
//         return res.status(404).json(Response({
//           status: 'error',
//           statusCode: 404,
//           message: 'No bookings found for this user',
//         }));
//       }
  
//       // Generate pagination data
//       const paginationData = pagination(userBookingsLength, limit, page);
  
//       // Return the user's bookings
//       res.status(200).json(Response({
//         status: 'success',
//         statusCode: 200,
//         message: 'User bookings fetched successfully',
//         data: userBookings,
//         pagination: paginationData,
//       }));
//     } catch (error) {
//       console.error('Error in showAgencyBookings:', error); // Log error for debugging
//       next(error); // Pass error to middleware
//     }
//   };

  // show booking details 
  //----------------------------------------


  const showAgencyBookings = async (req, res, next) => {
    try {
        // Validate and parse pagination params
        let page = parseInt(req.query.page, 10) || 1;
        let limit = parseInt(req.query.limit, 10) || 10;

        const agencyId = req.user._id; // Logged-in user's ID
        const { status } = req.query;

        // Construct query dynamically
        const query = { agencyId };
        if (status) {
            query.status = status;
        }

        // Fetch total documents for pagination
        const userBookingsLength = await BookCar.find(query).countDocuments();

        // Fetch paginated bookings
        let userBookings = await BookCar.find(query)
            .populate("carId driverId userId agencyId")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Check if the status is 'ongoing', then update the status for relevant bookings
        if (status === 'ongoing') {
            // Get today's date in 'YYYY-MM-DD' format
            // const currentDate = new Date().toISOString().split('T')[0].toString()  // Example: "2025-03-13"
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
            
            // Find bookings where bookingStartDate is today's date and BookingStatus is 'paid'
            const updatedBookings = await BookCar.find({
                agencyId,
                bookingStartDate: currentDate, // Compare with current date string
                BookingStatus: "paid" // Only update if the BookingStatus is 'paid'
            })
            .populate("carId driverId userId agencyId");

            console.log(updatedBookings,"lskdjlkfjdlskf",formattedDate);
            // Loop through the bookings to update the status to 'ongoing'
            for (let booking of updatedBookings) {
                // Convert bookingStartDate to 'YYYY-MM-DD' format and compare it with current date
                const bookingStartDate = booking.bookingStartDate // Get booking date in 'YYYY-MM-DD'
console.log(bookingStartDate,"sdkjfdslkj",bookingStartDate===formattedDate,`${bookingStartDate} ${formattedDate}`);
                // If bookingStartDate is the same as today's date, and the status isn't 'ongoing', update the status
                if (bookingStartDate === formattedDate && booking.status !== 'ongoing' && booking.BookingStatus === 'paid') {
                    booking.status = 'ongoing'; // Update the status to 'ongoing'
                    await booking.save(); // Save the updated status
                }
                console.log(`Booking ID: ${booking._id}, Start Date: ${bookingStartDate}, Updated Status: ongoing`);
            }

            // Fetch the updated bookings after status update
            userBookings = await BookCar.find(query)
                .populate("carId driverId userId agencyId")
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 });
        }

        // Check if bookings exist
        if (!userBookings.length) {
            return res.status(404).json(Response({
                status: 'error',
                statusCode: 404,
                message: 'No bookings found for this user',
            }));
        }

        // Generate pagination data
        const paginationData = pagination(userBookingsLength, limit, page);

        // Return the user's bookings
        res.status(200).json(Response({
            status: 'success',
            statusCode: 200,
            message: 'User bookings fetched successfully',
            data: userBookings,
            pagination: paginationData,
        }));
    } catch (error) {
        console.error('Error in showAgencyBookings:', error); // Log error for debugging
        next(error); // Pass error to middleware
    }
};




//   const showAgencyBookings = async (req, res, next) => {
//     try {
//         // Validate and parse pagination params
//         let page = parseInt(req.query.page, 10) || 1;
//         let limit = parseInt(req.query.limit, 10) || 10;

//         const agencyId = req.user._id; // Logged-in user's ID
//         const { status } = req.query;

//         // Construct query dynamically
//         const query = { agencyId };
//         if (status) {
//             query.status = status;
//         }

//         // Fetch total documents for pagination
//         const userBookingsLength = await BookCar.find(query).countDocuments();

//         // Fetch paginated bookings
//         let userBookings = await BookCar.find(query)
//             .populate("carId driverId userId agencyId")
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .sort({ createdAt: -1 });

       

//         // Update the status of bookings where the bookingStartDate is today's date and the status isn't 'ongoing'
//         if (status === 'ongoing') {

//           const ongingStatuse = await BookCar.find({agencyId:agencyId})
//             .populate("carId driverId userId agencyId")
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .sort({ createdAt: -1 });
           

//             const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format

//             // Update the bookings where bookingStartDate is the current date, status isn't 'ongoing', and BookingStatus is 'paid'
//             for (let booking of ongingStatuse) {
//                 const bookingStartDate = new Date(booking.bookingStartDate).toISOString().split('T')[0]; // Get booking date in 'YYYY-MM-DD'

//                 // If bookingStartDate is the same as today's date, and the status isn't 'ongoing', update the status
//                 if (bookingStartDate === currentDate && booking.status !== 'ongoing' && booking.BookingStatus === 'paid') {
//                     booking.status = 'ongoing'; // Update the status to 'ongoing'
//                     await booking.save(); // Save the updated status
//                 }
//                 console.log(bookingStartDate,currentDate,"slkdjflksdflksdjflkj",booking._id);
//             }

//             // After updating the bookings, fetch them again to reflect changes
//             userBookings = await BookCar.find(query)
//                 .populate("carId driverId userId agencyId")
//                 .skip((page - 1) * limit)
//                 .limit(limit)
//                 .sort({ createdAt: -1 });
//         }
        

//         // Check if bookings exist
//         if (!userBookings.length) {
//             return res.status(404).json(Response({
//                 status: 'error',
//                 statusCode: 404,
//                 message: 'No bookings found for this user',
//             }));
//         }

//         // Generate pagination data
//         const paginationData = pagination(userBookingsLength, limit, page);

//         // Return the user's bookings
//         res.status(200).json(Response({
//             status: 'success',
//             statusCode: 200,
//             message: 'User bookings fetched successfully',
//             data: userBookings,
//             pagination: paginationData,
//         }));
//     } catch (error) {
//         console.error('Error in showAgencyBookings:', error); // Log error for debugging
//         next(error); // Pass error to middleware
//     }
// };


  const showBookingDetails=async(req,res,next)=>{
    try {
        const {id}=req.query

        const BokkingDetails=await BookCar.findById(id).populate("carId userId agencyId driverId")
          // Return the user's bookings
      res.status(200).json(Response({
        status: 'success',
        statusCode: 200,
        message: 'User bookings fetched successfully',
        data: BokkingDetails,
        
      }));
        
    } catch (error) {
        next(error)
    }
  }

//   const showBookingDetails = async (req, res, next) => {
//     try {
//         const { id } = req.query;

//         // Fetch booking details and populate referenced fields
//         const bookingDetails = await BookCar.findById(id).populate("carId userId agencyId driverId");

//         if (!bookingDetails) {
//             return res.status(404).json({
//                 status: 'error',
//                 statusCode: 404,
//                 message: 'Booking not found',
//             });
//         }

//         // Filter out past bookedDates
//         const today = new Date();
//         const filteredBookedDates = bookingDetails.bookedDates.filter(date => {
//             const endDate = new Date(date.endDate);
//             return endDate >= today; // Keep only current or future dates
//         });

//         // Attach filtered bookedDates to the response
//         bookingDetails.bookedDates = filteredBookedDates;

//         // Return the filtered booking details
//         res.status(200).json({
//             status: 'success',
//             statusCode: 200,
//             message: 'Booking details fetched successfully',
//             data: bookingDetails,
//         });
//     } catch (error) {
//         next(error); // Pass error to centralized error handler
//     }
// };


  const acceptOrder=async(req,res,next)=>{
    try {

        const {bookId}=req.query

        const book=await BookCar.findById(bookId)
        const car=await Car.findById(book.carId)

         // Parse times
    const inputStartTime = parseFloat(book.bookingStartTime.replace('.', '')); // "13.00" => 1300
    const inputEndTime = parseFloat(book.bookingEndTime.replace('.', '')); // "10.00" => 1000

    // Format input dates
    const formattedStartDate = `${book.bookingStartDate}`;
    const formattedEndDate = `${book.bookingEndDate}`;

    // Conflict check
    const conflictingBooking = await Car.findOne({
      _id: car._id,
      bookedDates: {
        $elemMatch: {
          $or: [
            {
              startDate: { $lt: formattedEndDate },
              endDate: { $gt: formattedStartDate },
            },
            {
              startDate: formattedStartDate,
              endDate: formattedStartDate,
              startTime: { $lt: inputEndTime },
              endTime: { $gt: inputStartTime },
            },
          ],
        },
      },
    });

    if (conflictingBooking) {
      return res.status(400).json({
        statusCode:400,
        status: 'error',
        message: 'The selected car that you want to accept. it is already booked by other user',
      });
    }

        const updatedBook=await BookCar.findByIdAndUpdate(bookId,{status:"inprogress",isBookingAceptedByAgency:true})

      const dataNotifaction=  await sendNotification({
          userId: book.agencyId, // Optional sender
          receiverId: book.userId,
          bookingId: bookId,
          title: "Booking Accepted",
          body: `Your booking for ${car.carName}  has been accepted.`,
          type: "booking",
          metadata: { carId: book.carId._id },
        });

        console.log(dataNotifaction);
        
           // Return the user's bookings
      res.status(200).json(Response({
        status: 'success',
        statusCode: 200,
        message: 'agency accept the booking ',
        data: updatedBook,
        
      }));
        
    } catch (error) {
        next(error)
    }
  }
  const cancelledOrder=async(req,res,next)=>{
    try {

        const {bookId}=req.query

        const updatedBook=await BookCar.findByIdAndUpdate(bookId,{status:"cancelled",BookingStatus:"cancelled",isBookingAceptedByAgency:false},{new:true})
           // Return the user's bookings
      res.status(200).json(Response({
        status: 'success',
        statusCode: 200,
        message: 'agency cancelled the this booked',
        data: updatedBook,
        
      }));
        
    } catch (error) {
        next(error)
    }
  }
  
  const assigneDriver=async(req,res,next)=>{
    try {

        const {bookId,driverId}=req.query

        // const updatedBook=await BookCar.findByIdAndUpdate(bookId,{driverId:driverId,status:"assigneDriver",isdriverAccept:false})
        const updatedBook=await BookCar.findByIdAndUpdate(bookId,{driverId:driverId,status:"assigneDriver",driverDeliveryStatuse:"track",})
        console.log(updatedBook,driverId,bookId);
           // Return the user's bookings
      res.status(200).json(Response({
        status: 'success',
        statusCode: 200,
        message: 'User bookings fetched successfully',
        data: updatedBook,
        
      }));
        
    } catch (error) {
        next(error)
    }
  }
  const showAllDriverInagent=async(req,res,next)=>{
    try {
         // Validate and parse pagination params
      let page = parseInt(req.query.page, 10) || 1;
      let limit = parseInt(req.query.limit, 10) || 10;
        
        const agentId=req.user._id
    

        const updatedBooklength=await User.find({agencyId:agentId,role:"driver",isAgentAcceptDriver:true,isDriverAbailable:true}).countDocuments()
        const updatedBook=await User.find({agencyId:agentId,role:"driver",isAgentAcceptDriver:true,isDriverAbailable:true})
        .skip((page - 1) * limit)
        .limit(limit);

         // Check if bookings exist
      if (updatedBooklength===0) {
        return res.status(404).json(Response({
          status: 'error',
          statusCode: 404,
          message: 'No drivers available',
        }));
      }
  
      // Generate pagination data
      const paginationData = pagination(updatedBooklength, limit, page);
      
           // Return the user's bookings
      res.status(200).json(Response({
        status: 'success',
        statusCode: 200,
        message: 'User bookings fetched successfully',
        data: updatedBook,
        pagination:paginationData
        
      }));
        
    } catch (error) {
        next(error)
    }
  }

  // agency dashbored 

//   const agencyDashboard = async (req, res, next) => {
//     try {
//         const agencyId = req.user._id; // Assuming agency ID is retrieved from the logged-in user.

//         // Fetch all bookings for the agency
//         const bookings = await BookCar.find({ agencyId });

//         // Initialize statistics
//         let stats = {
//             totalOrders: 0,
//             receivedOrders: 0,
//             activeOrders: 0,
//             completedOrders: 0,
//             totalBookingAmount: 0,
//             totalActiveAmount: 0,
//             totalReceivedAmount: 0,
//         };

//         // Calculate statistics by iterating over the bookings
//         bookings.forEach((booking) => {
//             stats.totalOrders += 1;

//             if (booking.status === "newOrder") {
//                 stats.receivedOrders += 1;
//                 stats.totalReceivedAmount += parseFloat(booking.orderAmount || 0);
//             }

//             if (!["delivered", "cancelled"].includes(booking.status)) {
//                 stats.activeOrders += 1;
//                 stats.totalActiveAmount += parseFloat(booking.orderAmount || 0);
//             }

//             if (booking.status === "delivered") {
//                 stats.completedOrders += 1;
//                 stats.totalBookingAmount += parseFloat(booking.orderAmount || 0);
//             }
//         });

//         // Return the statistics
//         res.status(200).json(
//             Response({
//                 status: 'success',
//                 statusCode: 200,
//                 message: 'Agency dashboard data fetched successfully',
//                 data: stats,
//             })
//         );
//     } catch (error) {
//         next(error);
//     }
// };

const agencyDashboard = async (req, res, next) => {
  try {
    const agencyId = req.user._id; // Assuming agency ID is retrieved from the logged-in user.

    // Fetch all bookings for the agency
    const bookings = await BookCar.find({ agencyId });

    // Initialize statistics
    let stats = {
      totalOrders: 0, // Total number of orders
      totalOrderAmount: 0, // Total amount across all orders

      receivedOrders: 0, // Orders with status "newOrder"
      totalReceivedAmount: 0, // Total amount from received orders

      activeOrders: 0, // Orders not yet delivered or cancelled
      completedOrders: 0, // Orders with status "delivered"
      totalBookingAmount: 0, // Total amount from completed orders
      totalActiveAmount: 0, // Total amount from active orders
    };

    // Calculate statistics by iterating over the bookings
    bookings.forEach((booking) => {
      stats.totalOrders += 1; // Count total orders
      stats.totalOrderAmount += parseFloat(booking.orderAmount || 0); // Add to total order amount

      if (booking.status === "newOrder") {
        stats.receivedOrders += 1;
        stats.totalReceivedAmount += parseFloat(booking.orderAmount || 0);
      }

      if (!["delivered", "cancelled"].includes(booking.status)) {
        stats.activeOrders += 1;
        stats.totalActiveAmount += parseFloat(booking.orderAmount || 0);
      }

      if (booking.status === "delivered") {
        stats.completedOrders += 1;
        stats.totalBookingAmount += parseFloat(booking.orderAmount || 0);
      }
    });

    // Return the statistics
    res.status(200).json(
      Response({
        status: 'success',
        statusCode: 200,
        message: 'Agency dashboard data fetched successfully',
        data: stats,
      })
    );
  } catch (error) {
    next(error);
  }
};


// const agentDeliveried=async(req,res,next)=>{
//   try {

//     const agencyId= req.user._id
//     const {bookingId}=req.query

//     const deliveryed=await BookCar.findByIdAndUpdate(bookingId,{status:"delivered",BookingStatus:"delivered",isCarReturned:false},{new:true})


    
//     // const dataNotifaction=  await sendNotification({
//     //   userId: book.agencyId, // Optional sender
//     //   receiverId: book.userId,
//     //   bookingId: bookId,
//     //   title: "delivery the car",
//     //   body: `Your booking for ${car.carName}  has been accepted.`,
//     //   type: "booking",
//     //   metadata: { carId: book.carId._id },
//     // });

//     // console.log(dataNotifaction);
    

//     // Return the statistics
//     res.status(200).json(
//       Response({
//         status: 'success',
//         statusCode: 200,
//         message: 'car bookeing  deliveried  successfully',
//         data: deliveryed,
//       })
//     );

    
//   } catch (error) {
//     next(error)
//   }
// }
const agentDeliveried = async (req, res, next) => {
  try {
    const agencyId = req.user._id; // Agency ID from authenticated request
    const { bookingId } = req.query;

    // Update booking status to "delivered"
    const deliveryed = await BookCar.findByIdAndUpdate(bookingId, {
      status: "delivered",
      BookingStatus: "delivered",
      isCarReturned: false,
    }, { new: true })
      .populate("userId")
      .populate("agencyId")
      .populate("carId");

    if (!deliveryed) {
      return res.status(404).json({
        status: "error",
        statusCode: 404,
        message: "Booking not found.",
      });
    }

    const { userId, agencyId: bookingAgencyId, carId } = deliveryed;

    // Send notification to the user
    const userNotification = await sendNotification({
      userId: bookingAgencyId, // Sender (Agency)
      receiverId: userId, // User receives this notification
      bookingId,
      title: "How was everything?",
      body: "It's time to rate your agency.",
      type: "rating",
      metadata: { carId: carId._id },
    });

    // Send notification to the agency
    const agencyNotification = await sendNotification({
      userId: userId, // Sender (User)
      receiverId: bookingAgencyId, // Agency receives this notification
      bookingId,
      title: "How was everything?",
      body: "It's time to rate your Client.",
      type: "userRating",
      metadata: { carId: carId._id },
    });

    // Return the statistics
    return res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'Car booking delivered successfully. Notifications sent to user and agency.',
      data: deliveryed,
    });
  } catch (error) {
    next(error);
  }
};


  
  module.exports={
    showAgencyBookings,
    showBookingDetails,
    assigneDriver,
    acceptOrder,
    showAllDriverInagent,
    agencyDashboard,
    cancelledOrder,
    agentDeliveried

  }