const pagination = require('../../../helpers/pagination');
const Response = require('../../../helpers/respones');
const BookCar = require('../models/BookCar');
const Car = require('../models/Car');
const User = require('../models/User');




// const createBooking = async (req, res, next) => {
//     try {
//       const userId = req.user._id;
//       const {
//         carId,
//         pickupFromAgency,
//         bookingDays,
//         isSuperior,
//         isWifi,
//         bosterSeat,
//         orderAmount,
//         dueAmount,
//         payableAmount,
//         agencyId,
//         latitude,
//         longitude,
//         bookingStartDate,
//         bookingEndDate,
//         bookingStartTime,
//         bookingEndTime
//       } = req.body;
  
//       // Validation for required fields
//       if (!carId || !bookingDays || isSuperior === undefined || !orderAmount || !bookingStartDate || !bookingEndDate || !agencyId) {
//         return res.status(400).json({
//           status: 'error',
//           statusCode: 400,
//           message: 'Missing required fields',
//         });
//       }
  
    
  
//       // Validate latitude and longitude if pickupFromAgency is false
//       let driverPickupLocation = null;
//       if (pickupFromAgency==="false") {
//         if (!latitude || !longitude) {
//           return res.status(400).json({
//             status: 'error',
//             statusCode: 400,
//             message: 'Latitude and longitude are required when pickupFromAgency is false.',
//           });
//         }
  
//         // Convert latitude and longitude to numbers
//         const parsedLatitude = parseFloat(latitude);
//         const parsedLongitude = parseFloat(longitude);
  
//         // Validate numeric values
//         if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
//           return res.status(400).json({
//             status: 'error',
//             statusCode: 400,
//             message: 'Invalid latitude or longitude values. Please provide valid numeric values.',
//           });
//         }
  
//         // Update the driverPickupLocation
//         driverPickupLocation = {
//           type: 'Point',
//           coordinates: [parsedLongitude, parsedLatitude], // Note: [longitude, latitude]
//         };
  
       
//       }
  
//       // Check if user exists and has a driving license
//       const userLicence = await User.findById(userId);
//       if (!userLicence) {
//         return res.status(404).json({
//           status: 'error',
//           statusCode: 404,
//           message: 'User not found',
//         });
//       }
  
//       if (!userLicence.drivingLicence) {
//         return res.status(400).json({
//           status: 'error',
//           statusCode: 400,
//           message: 'You have not yet added a driving license.',
//         });
//       }
  
//        // Parse input dates
// const startDate = new Date(bookingStartDate);
// const endDate = new Date(bookingEndDate);

// // Parse input times
// const [startHour, startMinute] = bookingStartTime.split('.').map(String);
// const [endHour, endMinute] = bookingEndTime.split('.').map(String);

// // Assume today's date (or replace with a specific date)
// const today = new Date();
// const startDateTime = new Date(startDate);
// startDateTime.setHours(startHour, startMinute, 0, 0);

// let endDateTime = new Date(today);
// endDateTime.setHours(endHour, endMinute, 0, 0);

// // Handle overnight bookings (end time is before start time)
// if (endDateTime <= startDateTime) {
//   endDateTime.setDate(endDateTime.getDate() + 1); // Move to the next day
// }

// console.log("Start Date-Time:", startDateTime,endHour,startHour);
// console.log("End Date-Time:", endDateTime);
// console.log(startDate,endDate,"=======================",startHour, startMinute,endHour, endMinute);

// if (isNaN(startDate) || isNaN(endDate) || startDate == endDate) {
//     return res.status(400).json({
//         status: 'error',
//         message: 'Invalid date range: Start date must be before end date.',
//     });
// }

// // Format input dates to match the stored format
// const formattedStartDate = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
// const formattedEndDate = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;
// // Convert input times to numbers for comparison
// const inputStartTime = parseFloat(bookingStartTime.replace('.', '')); // e.g., "12.00" => 1200
// const inputEndTime = parseFloat(bookingEndTime.replace('.', '')); // e.g., "11.00" => 1100

// // console.log(formattedEndDate,);
// // // Check for conflicting bookings
// // const conflictingBooking = await Car.findOne({
// //     _id: carId,
// //     bookedDates: {
// //         $elemMatch: {
// //             startDate: { $lt: formattedEndDate }, // Existing booking starts before the new booking ends
// //             endDate: { $gt: formattedStartDate }, // Existing booking ends after the new booking starts
// //             startTime: { $lt: endHour }, // Existing booking starts before the new booking ends
// //             endTime: { $gt: startHour }, // Existing booking ends after the new booking starts
// //         },
// //     },
// // });

// // if (conflictingBooking) {
// //     return res.status(400).json({
// //         status: 'error',
// //         message: 'The selected car is already booked during this date range.',
// //         bookedDates: conflictingBooking.bookedDates,
// //     });
// // }

// // Check for conflicting bookings
// const conflictingBooking = await Car.findOne({
//   _id: carId,
//   bookedDates: {
//     $elemMatch: {
//       startDate: { $lt: formattedEndDate }, // Existing booking starts before the new booking ends
//       endDate: { $gt: formattedStartDate }, // Existing booking ends after the new booking starts
//       startTime: { $lt: inputEndTime }, // Existing booking starts before the new booking ends
//       endTime: { $gt: inputStartTime }, // Existing booking ends after the new booking starts
//     },
//   },
// });

// console.log(inputEndTime,inputStartTime);
// if (conflictingBooking) {
//   return res.status(400).json({
//     status: 'error',
//     message: 'The selected car is already booked during this date and time range.',
//     bookedDates: conflictingBooking.bookedDates,
//   });
// }
  
//       // Create new booking
//       const newBooking = new BookCar({
//         userId,
//         carId,
//         driverPickupLocation,
//         pickupFromAgency,
//         bookingDays,
//         isSuperior,
//         isWifi,
//         bosterSeat,
//         orderAmount,
//         bookingStartDate,
//         bookingEndDate,
//         bookingStartTime,
//         bookingEndTime,
//         dueAmount,
//         agencyId,
//         payableAmount,
//       });
  
//       // Save booking to the database
//       await newBooking.save();
  
//       // Update car availability
//       const car = await Car.findById(carId);
//       if (car) {
//         const updatedBookedDates = [...car.bookedDates, { startDate: bookingStartDate, endDate: bookingEndDate,endTime:inputEndTime,startTime:inputStartTime }];
  
//         await Car.findByIdAndUpdate(
//           carId,
//           {
//             isRent: true,
//             startDate: bookingStartDate,
//             endDate: bookingEndDate,
//             startTime: bookingStartTime,
//             endTime: bookingEndTime,
//             bookedDates: updatedBookedDates
//           },
//           { new: true }
//         );
//       } else {
//         console.log('Car not found');
//       }
  
//       res.status(200).json({
//         status: 'success',
//         statusCode: 200,
//         message: 'Booking created successfully',
//         data: newBooking,
//       });
//     } catch (error) {
//       next(error); // Pass error to middleware for centralized handling
//     }
//   };
  
const createBooking = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      carId,
      pickupFromAgency,
      bookingDays,
      isSuperior,
      isWifi,
      bosterSeat,
      orderAmount,
      dueAmount,
      payableAmount,
      agencyId,
      latitude,
      longitude,
      bookingStartDate,
      bookingEndDate,
      bookingStartTime,
      bookingEndTime,
    } = req.body;

    // Validation for required fields
    if (
      !carId ||
      !bookingDays ||
      isSuperior === undefined ||
      !orderAmount ||
      !bookingStartDate ||
      !bookingEndDate ||
      !agencyId
    ) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Missing required fields',
      });
    }

    // Validate latitude and longitude if pickupFromAgency is false
    let driverPickupLocation = null;
    if (pickupFromAgency === 'false') {
      if (!latitude || !longitude) {
        return res.status(400).json({
          status: 'error',
          statusCode: 400,
          message:
            'Latitude and longitude are required when pickupFromAgency is false.',
        });
      }

      const parsedLatitude = parseFloat(latitude);
      const parsedLongitude = parseFloat(longitude);

      if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
        return res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'Invalid latitude or longitude values.',
        });
      }

      driverPickupLocation = {
        type: 'Point',
        coordinates: [parsedLongitude, parsedLatitude],
      };
    }

    // Check if user exists and has a driving license
    const userLicence = await User.findById(userId);
    if (!userLicence) {
      return res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: 'User not found',
      });
    }

    
    if (userLicence.drivingLicence==null) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Please upload your driving licence.',
      });
    }

    if (!userLicence.isVerifiedProfile) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Your account is not verified yet.',
      });
    }
    // Parse times
    const inputStartTime = parseFloat(bookingStartTime.replace('.', '')); // "13.00" => 1300
    const inputEndTime = parseFloat(bookingEndTime.replace('.', '')); // "10.00" => 1000

    // Format input dates
    const formattedStartDate = `${bookingStartDate}`;
    const formattedEndDate = `${bookingEndDate}`;

    // Conflict check
    const conflictingBooking = await Car.findOne({
      _id: carId,
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
        message: 'The selected car is already booked during this date and time range.',
      });
    }

    // Create new booking
    const newBooking = new BookCar({
      userId,
      carId,
      driverPickupLocation,
      pickupFromAgency,
      bookingDays,
      isSuperior,
      isWifi,
      bosterSeat,
      orderAmount,
      bookingStartDate,
      bookingEndDate,
      bookingStartTime,
      bookingEndTime,
      dueAmount,
      agencyId,
      payableAmount,
    });

    // Save booking to the database
    await newBooking.save();

    // // Update car availability
    // const car = await Car.findById(carId);
    // if (car) {
    //   const updatedBookedDates = [
    //     ...car.bookedDates,
    //     {
    //       startDate: bookingStartDate,
    //       endDate: bookingEndDate,
    //       startTime: inputStartTime,
    //       endTime: inputEndTime,
    //     },
    //   ];

    //   await Car.findByIdAndUpdate(
    //     carId,
    //     {
    //       isRent: true,
    //       bookedDates: updatedBookedDates,
    //     },
    //     { new: true }
    //   );
    // }

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'Booking created successfully',     
      data: newBooking,
    });
  } catch (error) {
    next(error); // Pass error to middleware for centralized handling
  }
};


// const myBookings=async(req,res,next)=>{
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
    
//         const id=req.user._id

//         const userBookedLength=await BookCar.find({userId:id}).countDocuments()
//         const userBooked=await BookCar.find({userId:id})
//         .skip((page - 1) * limit)
//         .limit(limit);
        
//         if(userBookedLength===0){
//             res.status(404).json(Response({status:"error",statusCode:404,message:"Car not found"}))
//         }

//     // Generate pagination data
//     const paginationData = pagination(carsLength, limit, page);

//     res.status(200).json(Response({status:"success",message:"car show successfully",data:userBooked,pagination:paginationData}))
        
//     } catch (error) {
//         next(error)
//     }
// }



module.exports={
    createBooking,
      
} 