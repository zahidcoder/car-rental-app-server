const { response } = require("express");
const pagination = require("../../../helpers/pagination");
const Response = require("../../../helpers/respones");
const BookCar = require("../models/BookCar");
const Car = require("../models/Car");
const User = require("../models/User");

// const showUserBookings = async (req, res, next) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//       const userId = req.user._id; // Get the logged-in user's ID from the request
//       const {BookingStatus}=req.query
//       // Fetch all bookings for the user
//       const userBookingsLength = await BookCar.find({ userId,BookingStatus:BookingStatus }).countDocuments()
//       const userBookings = await BookCar.find({ userId ,BookingStatus:BookingStatus})
//       .skip((page - 1) * limit)
//         .limit(limit);
  
//       // Check if bookings exist
//       if (!userBookings.length) {
//         return res.status(404).json(
//           Response({
//             status: 'error',
//             statusCode: 404,
//             message: `No bookings found for the statuse of  ${BookingStatus}` ,
//           })
//         );
//       }
//        // Generate pagination data
//     const paginationData = pagination(userBookingsLength, limit, page);
  
//       // Return the user's bookings
//       res.status(200).json(
//         Response({
//           status: 'success',
//           statusCode: 200,
//           message: 'User bookings fetched successfully',
//           data: userBookings,
//           pagination:paginationData
//         })
//       );
//     } catch (error) {
//       next(error); // Pass error to middleware for centralized error handling
//     }
//   };

// const showUserBookings = async (req, res, next) => {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
//       const userId = req.user._id; // Get the logged-in user's ID from the request
//       const { BookingStatus } = req.query;
  
//       // Create a dynamic filter object
//       const filter = { userId };
//       if (BookingStatus) {
//         filter.BookingStatus = BookingStatus; // Add BookingStatus to the filter if provided
//       }
  
//       // Count total bookings for the filter
//       const userBookingsLength = await BookCar.find(filter).countDocuments();
  
//       // Fetch bookings with pagination
//       const userBookings = await BookCar.find(filter).populate("carId driverId agencyId")
//         .skip((page - 1) * limit)
//         .limit(limit);
  
//       // Check if bookings exist
//       if (!userBookings.length) {
//         return res.status(404).json(
//           Response({
//             status: 'error',
//             statusCode: 404,
//             message: BookingStatus
//               ? `No bookings found for the status of ${BookingStatus}`
//               : 'No bookings found for the user.',
//           })
//         );
//       }
  
//       // Generate pagination data
//       const paginationData = pagination(userBookingsLength, limit, page);
  
//       // Return the user's bookings
//       res.status(200).json(
//         Response({
//           status: 'success',
//           statusCode: 200,
//           message: 'User bookings fetched successfully',
//           data: userBookings,
//           pagination: paginationData,
//         })
//       );
//     } catch (error) {
//       next(error); // Pass error to middleware for centralized error handling
//     }
//   };


  // user serch for the booking a car in home page

  const showUserBookings = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const userId = req.user._id; // Get the logged-in user's ID from the request
      const { BookingStatus } = req.query;
  
   
      // Create a dynamic filter object for querying bookings
      const filter = { userId };
      if (BookingStatus) {
        filter.BookingStatus = BookingStatus; // Add BookingStatus to the filter if provided
      }
  
      // Count total bookings for the filter
      const userBookingsLength = await BookCar.find(filter).countDocuments();
  
      // Fetch bookings with pagination
      const userBookings = await BookCar.find(filter)
        .populate("carId driverId agencyId")
        .skip((page - 1) * limit)
        .limit(limit);
  
  
   
  
      // If the BookingStatus is "ongoing", we need to update relevant bookings
      if (BookingStatus === "ongoing") {
       
        // Get today's date in the 'YYYY-MM-DD' format
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

        
            // Find bookings where bookingStartDate is today's date and BookingStatus is 'paid'
            const updatedBookings = await BookCar.find({
              userId,
              bookingStartDate: formattedDate, // Compare with current date string
              BookingStatus: "paid" // Only update if the BookingStatus is 'paid'
          })
          .populate("carId driverId userId agencyId");

          console.log(updatedBookings,"ongoing data ");
        // Loop through all fetched bookings and check if they need to be updated
        for (let booking of updatedBookings) {
          const bookingStartDate = booking.bookingStartDate; // Assuming bookingStartDate is in 'YYYY-MM-DD' format
  
          // Compare bookingStartDate with today's date and update if conditions match
          if (bookingStartDate === formattedDate && booking.BookingStatus !== 'ongoing' && booking.BookingStatus === 'paid') {
            // Update status to 'ongoing' if the conditions are met
            booking.BookingStatus = 'ongoing';
            await booking.save(); // Save the updated booking
            console.log(`Booking ID: ${booking._id}, Status Updated to: ongoing`);
          }
        }
      }

         // If no bookings are found, return an error response
         if (!userBookings.length) {
          return res.status(404).json(
            Response({
              status: 'error',
              statusCode: 404,
              message: BookingStatus
                ? `No bookings found for the status of ${BookingStatus}`
                : 'No bookings found for the user.',
            })
          );
        }
  
      // Generate pagination data
      const paginationData = pagination(userBookingsLength, limit, page);
  
      // Return the user's bookings with pagination
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
  
  // const searchCarByDate = async (req, res, next) => {
  //   try {
  //     const page = parseInt(req.query.page) || 1; // Current page
  //     const limit = parseInt(req.query.limit) || 20; // Number of items per page
  //     const userId = req.user._id; // Assuming user is authenticated
  //     const { latitude, longitude, startDate, endDate,startTime,endTime } = req.query; // For GET requests
  //     const skip = (page - 1) * limit; // Calculate the number of items to skip

    
  // console.log(page,limit);
  //     // Parse latitude and longitude
  //     const lat = parseFloat(latitude);
  //     const lon = parseFloat(longitude);
  //     const nearbyUsers = await User.aggregate([
  //       {
  //         $geoNear: {
  //           near: { type: 'Point', coordinates: [lon, lat] }, // [longitude, latitude]
  //           distanceField: 'distance',
  //           maxDistance: 10000, // 10 kilometers
  //           spherical: true,
  //           query: { role: 'agency' }, // Filter for agencies (optional)
  //         }
  //       }
  //     ]);
      
  //     console.log(nearbyUsers);
  //     const cars = await User.aggregate([
  //       {
  //         $geoNear: {
  //           near: { type: 'Point', coordinates: [lon, lat] },
  //           distanceField: 'distance',
  //           maxDistance: 2500000, // 10 kilometers
  //           spherical: true,
  //           query: { role: 'agency' }, // Filter for agencies
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: 'cars', // Join with cars collection
  //           localField: '_id',
  //           foreignField: 'userId', // Match car's userId to agency's _id
  //           as: 'cars',
  //         },
  //       },
  //       {
  //         $unwind: '$cars', // Flatten the array of cars
  //       },
  //       {
  //         $match: {
  //           'cars.carStatus': 'available', // Car must be available
  //           // 'cars.isRent': false,          // Car must not be rented
  //           $and: [
  //             {
  //               // Match cars whose endDate is less than or equal to the user's startDate
  //               $expr: { $lte: ['$cars.endDate', startDate] },
  //             },
  //             {
  //               // Match cars whose endTime is less than or equal to the user's startTime
  //               $expr: { $lte: [{ $toInt: '$cars.endTime' }, parseInt(startTime)] },
  //             },
  //           ],
  //         },
  //       },
  //       {
  //         $addFields: {
  //           'agency.distance': {
  //             $round: ['$distance', 2], // Rounds the distance field to 2 decimal places
  //           },
  //         },
  //       },
  //       {
  //         $project: {
  //           _id: '$cars._id',
  //           carName: '$cars.carName',
  //           carBrand: '$cars.carBrand',
  //           carModel: '$cars.carModel',
  //           price: '$cars.price',
  //           ratings: '$cars.ratings',
  //           mileage: '$cars.mileage',
  //           transmission: '$cars.transmission',
  //           fuelCondations: '$cars.fuelCondations',
  //           guarantee: '$cars.guarantee',
  //           passengers: '$cars.passengers',
  //           carStatus: '$cars.carStatus',
  //           isRent: '$cars.isRent',
  //           isWifi: '$cars.isWifi',
  //           isBosterSet: '$cars.isBosterSet',
  //           carImage: '$cars.carImage',
  //           agency: {
  //             _id: '$_id',
  //             name: '$name',
  //             distance: '$agency.distance',
  //           },
  //         },
  //       },
  //       {
  //         $skip: skip, // Skip the required number of items
  //       },
  //       {
  //         $limit: limit, // Limit the number of items returned
  //       },
  //     ]);
  
  //     if (!cars || cars.length === 0) {
  //       return res.status(404).json(Response({status:"error",statusCode:404, message: 'No available cars found within 25km' }));
  //     }

  //     console.log(cars.length);

  //     const totalCar=pagination(cars.length,limit,page)
  
  //     // Respond with the available cars and agency details
  //     res.status(200).json(Response({status:"success",statusCode:200,message:"show all message",data:cars,pagination:totalCar}));
  //   } catch (error) {
  //     next(error);
  //   }
  // };
  
  const searchCarByDate = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1; // Current page
      const limit = parseInt(req.query.limit) || 20; // Number of items per page
      const userId = req.user._id; // Assuming user is authenticated
      const { latitude, longitude, startDate, endDate,startTime,endTime } = req.query; // For GET requests
      const skip = (page - 1) * limit; // Calculate the number of items to skip
  
    
      if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required.' });
      }
      // Parse latitude and longitude
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      
      // First, find nearby agencies based on geo location
    const nearbyUsers = await User.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lon, lat] }, // [longitude, latitude]
          distanceField: 'distance',
          maxDistance: 25000, // Adjust distance (2,500,000 meters = 2500 km, for example)
          spherical: true,
          query: { role: 'agency' }, // Filter for agencies (optional)
        },
      },
      {
        $project: {
          _id: 1, // Only return the userId (agency ID)
        },
      },
    ]);

   
    // If no nearby agencies, return error message
    if (!nearbyUsers || nearbyUsers.length === 0) {
      return res.status(404).json({ message: 'No nearby car found in 25 km' });
    }
  
    // Extract the user IDs (agency IDs) from the nearbyUsers array
    const agencyIds = nearbyUsers.map(user => user._id);
    console.log(nearbyUsers,"sdlkfjdslkjflskdfjlsdkfj");

    // Then, find cars that belong to those agencies and are available
    const cars = await Car.aggregate([
      {
        $match: {
          userId: { $in: agencyIds }, // Match only cars that belong to nearby agencies
          carStatus: 'available', // Only available cars
        },
      },
    
    ]);
   

   
  
      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Cars found successfully.",
        data: cars,
        // pagination: paginationData,
      });
    } catch (error) {
      next(error);
    }
  };
  // const searchCarByDate = async (req, res, next) => {
  //   try {
  //     const page = parseInt(req.query.page) || 1; // Current page
  //     const limit = parseInt(req.query.limit) || 20; // Number of items per page
  //     const userId = req.user._id; // Assuming user is authenticated
  //     const { latitude, longitude, startDate, endDate, startTime, endTime } = req.query; // For GET requests
  //     const skip = (page - 1) * limit; // Calculate the number of items to skip
  
  //     console.log(page, limit);
  
  //     // Parse latitude and longitude
  //     const lat = parseFloat(latitude);
  //     const lon = parseFloat(longitude);
  
  //     // Parse the date and time parameters
  //     const parsedStartDate = new Date(startDate);
  //     const parsedEndDate = new Date(endDate);
  //     const parsedStartTime = startTime ? new Date(`${parsedStartDate.toISOString().split('T')[0]}T${startTime}`) : null;
  //     const parsedEndTime = endTime ? new Date(`${parsedEndDate.toISOString().split('T')[0]}T${endTime}`) : null;
  
  //     // First, find nearby agencies based on geo location
  //     const nearbyUsers = await User.aggregate([
  //       {
  //         $geoNear: {
  //           near: { type: 'Point', coordinates: [lon, lat] }, // [longitude, latitude]
  //           distanceField: 'distance',
  //           maxDistance: 2500000, // Adjust distance (2,500,000 meters = 2500 km, for example)
  //           spherical: true,
  //           query: { role: 'agency' }, // Filter for agencies (optional)
  //         },
  //       },
  //       {
  //         $project: {
  //           _id: 1, // Only return the userId (agency ID)
  //         },
  //       },
  //     ]);
  
  //     // If no nearby agencies, return error message
  //     if (!nearbyUsers || nearbyUsers.length === 0) {
  //       return res.status(404).json({ message: 'No nearby agencies found.' });
  //     }
  
  //     // Extract the user IDs (agency IDs) from the nearbyUsers array
  //     const agencyIds = nearbyUsers.map(user => user._id);
  //     console.log(agencyIds, "Nearby agency IDs");
  
  //     // Find cars that belong to those agencies and are available
  //     const cars = await Car.find({
  //       userId: { $in: agencyIds }, // Match only cars that belong to nearby agencies
  //       carStatus: 'available', // Only available cars
  //       // Optionally, you can use pagination here
  //     })
  //     .skip(skip)
  //     .limit(limit)
  //     .select('_id carName bookedDates'); // Include bookedDates field for availability checks
  
  //     // Filter out cars that have overlapping booked dates and times
  //     const availableCars = cars.filter(car => {
  //       return !car.bookedDates.some(booked => {
  //         // Check for overlapping dates
  //         const isDateOverlap =
  //           (new Date(parsedStartDate) >= new Date(booked.startDate) && new Date(parsedStartDate) < new Date(booked.endDate)) ||
  //           (new Date(parsedEndDate) > new Date(booked.startDate) && new Date(parsedEndDate) <= new Date(booked.endDate));
  
  //         // Check for overlapping times if provided
  //         const isTimeOverlap =
  //           (parsedStartTime && parsedEndTime) && (
  //             (new Date(parsedStartTime) < new Date(booked.endTime) && new Date(parsedEndTime) > new Date(booked.startTime))
  //           );
  
  //         // Return true if there is an overlap (either date or time)
  //         return isDateOverlap || isTimeOverlap;
  //       });
  //     });
  
  //     if (availableCars.length === 0) {
  //       return res.status(404).json({ message: 'No cars available during the specified date and time.' });
  //     }
  
  //     res.status(200).json(Response({
  //       status: "success",
  //       statusCode: 200,
  //       message: "Cars found successfully.",
  //       data: availableCars,
  //     }));
  //   } catch (error) {
  //     next(error);
  //   }
  // };
  
  
  // const searchCarByDate = async (req, res, next) => {
  //   try {
  //     const page = parseInt(req.query.page) || 1; // Current page
  //     const limit = parseInt(req.query.limit) || 20; // Number of items per page
  //     const userId = req.user._id; // Assuming user is authenticated
  //     const { latitude, longitude, startDate, endDate, startTime, endTime, carModel, carBrand, fuelType } = req.query; // For GET requests
  //     const skip = (page - 1) * limit; // Calculate the number of items to skip
  
  //     console.log(page, limit);
      
  //     // Parse latitude and longitude
  //     const lat = parseFloat(latitude);
  //     const lon = parseFloat(longitude);
      
  //     // First find nearby agencies based on geo location
  //     const nearbyUsers = await User.aggregate([
  //       {
  //         $geoNear: {
  //           near: { type: 'Point', coordinates: [lon, lat] }, // [longitude, latitude]
  //           distanceField: 'distance',
  //           maxDistance: 2500000, // 10 kilometers
  //           spherical: true,
  //           query: { role: 'agency' }, // Filter for agencies (optional)
  //         },
  //       },
  //     ]);
  //     console.log( nearbyUsers);
  
  //     // Check if nearby agencies exist
  //     if (!nearbyUsers || nearbyUsers.length === 0) {
  //       return res.status(404).json({
  //         status: "error",
  //         statusCode: 404,
  //         message: "No agencies found within the specified distance."
  //       });
  //     }
  
  //     // Find cars within the nearby agencies and filter based on the provided dates/times
  //     const cars = await Car.aggregate([
  //       {
  //         $geoNear: {
  //           near: { type: 'Point', coordinates: [lon, lat] }, // [longitude, latitude]
  //           distanceField: 'distance',
  //           maxDistance: 2500000, // 10 kilometers
  //           spherical: true,
  //           query: { userId: { $in: nearbyUsers.map(user => user._id) }, carStatus: 'available' }, // Find cars from nearby agencies
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: 'users', // Join with users collection to get agency info
  //           localField: 'userId',
  //           foreignField: '_id',
  //           as: 'agency',
  //         },
  //       },
  //       {
  //         $unwind: '$agency', // Flatten the agency information
  //       },
  //       {
  //         $match: {
  //           // Filter based on the car's booking status
  //           $or: [
  //             { // Filter cars whose availability is not within the requested date and time range
  //               $and: [
  //                 { $lte: [{ $toDate: '$startDate' }, new Date(endDate)] },
  //                 { $gte: [{ $toDate: '$endDate' }, new Date(startDate)] },
  //                 { $lte: [{ $toInt: '$startTime' }, parseInt(endTime)] },
  //                 { $gte: [{ $toInt: '$endTime' }, parseInt(startTime)] },
  //               ],
  //             },
  //           ],
  //           // Filter by optional car model, brand, and fuel type if provided
  //           ...(carModel && { carModel: { $regex: carModel, $options: 'i' } }),
  //           ...(carBrand && { carBrand: { $regex: carBrand, $options: 'i' } }),
  //           ...(fuelType && { fuelType: { $regex: fuelType, $options: 'i' } }),
  //         },
  //       },
  //       {
  //         $addFields: {
  //           'agency.distance': { $round: ['$distance', 2] }, // Round the distance field to 2 decimal places
  //         },
  //       },
  //       {
  //         $project: {
  //           _id: '$cars._id',
  //           carName: '$cars.carName',
  //           carBrand: '$cars.carBrand',
  //           carModel: '$cars.carModel',
  //           price: '$cars.price',
  //           ratings: '$cars.ratings',
  //           mileage: '$cars.mileage',
  //           transmission: '$cars.transmission',
  //           fuelCondations: '$cars.fuelCondations',
  //           guarantee: '$cars.guarantee',
  //           passengers: '$cars.passengers',
  //           carStatus: '$cars.carStatus',
  //           isRent: '$cars.isRent',
  //           carImage: '$cars.carImage',
  //           agency: {
  //             _id: '$_id',
  //             name: '$agency.name',
  //             distance: '$agency.distance',
  //           },
  //         },
  //       },
  //       {
  //         $skip: skip, // Skip the required number of items for pagination
  //       },
  //       {
  //         $limit: limit, // Limit the number of items returned
  //       },
  //     ]);
  
  //     if (!cars || cars.length === 0) {
  //       return res.status(404).json({
  //         status: "error",
  //         statusCode: 404,
  //         message: "No available cars found based on your search criteria."
  //       });
  //     }
  
  //     // Pagination metadata
  //     const totalCars = await Car.countDocuments({
  //       userId: { $in: nearbyUsers.map(user => user._id) },
  //       carStatus: 'available',
  //       ...(carModel && { carModel: { $regex: carModel, $options: 'i' } }),
  //       ...(carBrand && { carBrand: { $regex: carBrand, $options: 'i' } }),
  //       ...(fuelType && { fuelType: { $regex: fuelType, $options: 'i' } }),
  //     });
  
  //     const paginationData = {
  //       totalItems: totalCars,
  //       currentPage: page,
  //       totalPages: Math.ceil(totalCars / limit),
  //       limit: limit,
  //     };
  
  //     // Respond with the available cars and agency details
  //     res.status(200).json({
  //       status: "success",
  //       statusCode: 200,
  //       message: "Cars found successfully.",
  //       data: cars,
  //       pagination: paginationData,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
  
  
  
  // const searchCarByDate = async (req, res, next) => {
  //   try {
  //     const page = parseInt(req.query.page) || 1; // Current page
  //     const limit = parseInt(req.query.limit) || 10; // Number of items per page
  //     const userId = req.user._id; // Assuming user is authenticated
  //     const { latitude, longitude, startDate, endDate, startTime, endTime } = req.query; // For GET requests
  //     const skip = (page - 1) * limit; // Calculate the number of items to skip
  
  //     // Parse latitude and longitude
  //     const lat = parseFloat(latitude);
  //     const lon = parseFloat(longitude);
  
  //     // Find agencies within 3 kilometers
  //     const agencies = await User.find({
  //       role: 'agency',
  //       currentLocation: {
  //         $nearSphere: {
  //           $geometry: { type: 'Point', coordinates: [lon, lat] },
  //           $maxDistance: 3194, // 3 kilometers in meters
  //         },
  //       },
  //     });
  
  //     if (!agencies || agencies.length === 0) {
  //       return res.status(404).json(Response({ status: 'error', statusCode: 404, message: 'No agencies found within 3km' }));
  //     }
  
  //     // Find available cars for the agencies within 3km
  //     const cars = await Car.find({
  //       userId: { $in: agencies.map((agency) => agency._id) }, // Match cars from agencies within range
  //       carStatus: 'available', // Filter cars by availability
  //       $and: [
  //         {
  //           // Match cars whose endDate is less than or equal to the user's startDate
  //           endDate: { $lte: startDate },
  //         },
  //         // {
  //         //   // Match cars whose endTime is less than or equal to the user's startTime
  //         //   endTime: { $lte: startTime },
  //         // },
  //       ],
  //     })
  //       .skip(skip) // Skip the required number of items
  //       .limit(limit) // Limit the number of items returned
  //       .populate('userId', 'name location'); // Populate agency details (assuming userId is a reference to the agency)
  
  //     if (!cars || cars.length === 0) {
  //       return res.status(404).json(Response({ status: 'error', statusCode: 404, message: 'No available cars found for the given date range' }));
  //     }
  
  //     // Pagination calculations
  //     const totalCar = pagination(cars.length, limit, page);
  
  //     // Respond with the available cars and agency details
  //     res.status(200).json(Response({ status: 'success', statusCode: 200, message: 'Available cars fetched successfully', data: cars, pagination: totalCar }));
  //   } catch (error) {
  //     next(error);
  //   }
  // };
  
  
  
  
  module.exports={
    showUserBookings,
    searchCarByDate,
    
  }