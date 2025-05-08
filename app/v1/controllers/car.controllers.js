const pagination = require('../../../helpers/pagination');
const Response = require('../../../helpers/respones');
const Car = require('../models/Car'); // Adjust the path as needed
const User = require('../models/User');


// Controller to create a car
const addCar = async (req, res, next) => {
    try {


        const agency=await User.findById(req.user._id)
        if(!agency){
            return res.status(400).json(Response({
                statusCode:400,
                status: "error",
                message: "you are not agncy ",
            }));
        }
        const {
            monthlyDiscount,
            weeklyDiscount,
            isBosterSet,
            carModel,
            isWifi,
            carName,
            carBrand,
            fuelType,
            price,
            wifiprice,
            bostterSetPrice,
            suporior,
          
            category,
            mileage,
            mileageLimit,
            transmission,
            fuelCondations,
            guarantee,
            passengers,
            use,
            deliveryCharge,

            vehicle,
        } = req.body;

    
            // Parse JSON strings if `use` and `vehicle` are sent as JSON strings
            const parsedUse = JSON.parse(use); // Converts JSON string to object
            const parsedVehicle = JSON.parse(vehicle); // Converts JSON string to object
    

            console.log( isBosterSet,
                carModel,
                isWifi,
                carName,
                carBrand,
                fuelType,
                price,
                wifiprice,
                bostterSetPrice,
              
                category,
                mileage,
                mileageLimit,
                transmission,
                fuelCondations,
                guarantee,
                passengers,
                use,
                deliveryCharge,
    
                vehicle,);
        // Validate required fields
        if (
           
           !carModel||
          
            !carName ||
            !carBrand ||
          
            !category ||
            !fuelType ||

            !mileage ||
            !transmission ||
            !fuelCondations ||
            !guarantee ||
            !passengers
        ) {
            return res.status(400).json(Response({
                statusCode:400,
                status: "error",
                message: "All required fields must be provided.",
            }));
        }
        // if (isWifi === true) {
        //     if (!wifiprice) {
        //         throw new Error("wifiprice is required when WiFi is enabled.");
        //     }
        // }
        // if (isBosterSet === true) {
        //     if (!bostterSetPrice) {
        //         throw new Error("boster set price  is required when boster  is enabled.");
        //     }
        // }

        
        if (isWifi === "true" && !wifiprice) {
            return res.status(400).json(Response({
                statusCode: 400,
                status: "error",
                message: "wifiprice is required when WiFi is enabled."
            }));
        }

        console.log(isWifi === "true",isBosterSet === true,isWifi,isBosterSet);
        
        if (isBosterSet === "true" && !bostterSetPrice) {
            return res.status(400).json(Response({
                statusCode: 400,
                status: "error",
                message: "Boster set price is required when booster is enabled."
            }));
        }

        // Handle file uploads for images
        const carImage = req.files?.carImage;
        const carRegistation = req.files?.carRegistation;
        // const carfitnessLicence = req.files?.carfitnessLicence;

        console.log(carImage,carRegistation);

        const carImagefiles = carImage
            ? carImage.map((img) => ({
                  publicFileUrl: `/images/users/${img.filename}`,
                  path: img.filename,
              }))
            : [];

        const carRegistationfiles = carRegistation
            ? carRegistation.map((img) => ({
                  publicFileUrl: `/images/users/${img.filename}`,
                  path: img.filename,
              }))
            : [];

        // const carfitnessLicencefiles = carfitnessLicence
        //     ? carfitnessLicence.map((img) => ({
        //           publicFileUrl: `/images/users/${img.filename}`,
        //           path: img.filename,
        //       }))
        //     : [];

        
        // Create the car

        console.log(carRegistationfiles,carImagefiles);
        const newCar = new Car({
            userId: req.user._id,
            carName,
            price,
            carBrand,
            monthlyDiscount,
            weeklyDiscount,
            bostterSetPrice:bostterSetPrice,
            wifiprice:wifiprice,
            category,
            mileage,
            isBosterSet,
            carModel,
            isWifi,
            transmission,
            fuelCondations,
            mileageLimit,
            suporior,
            guarantee,
            fuelType,
            passengers,
            deliveryCharge,

            use:parsedUse,
            vehicle:parsedVehicle,
            carImage: carImagefiles,
            carRegistation: carRegistationfiles[0],
            // carfitnessLicence: carfitnessLicencefiles[0],
        });

        await newCar.save();

        res.status(200).json(Response({
            status: "success",
            statusCode:200,
            message: "Car created successfully",
            data: newCar,
        }));
    } catch (error) {
        next(error);
    }
};

// show all car 
const getAllCars = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const carsLength = await Car.find().countDocuments()

        // Check if there are any cars in the database
        if (carsLength === 0) {
            return res.status(404).json(Response({ 
                status: "error", 
                statusCode: 404, 
                message: 'No cars found' 
            }));
        }
        const cars = await Car.find()
        .skip((page - 1) * limit)
            .limit(limit);
            // Check if there are any search results
        

        // Generate pagination data
        const paginationOfaichatbot = pagination(carsLength, limit, page);

        res.status(200).json(Response({
            status: "success",
            statusCode: 200,
            message: "All cars retrieved successfully",
            data: cars,
            pagination:paginationOfaichatbot
        }));
    } catch (error) {
        next(error);
    }
};

// Get all cars for a specific user
const getUserCars = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const userId = req.user._id; // Get the user ID from the authenticated request
        const userCarsLength = await Car.find({ userId }).countDocuments()
            // Check if there are any cars in the database
            if (userCarsLength === 0) {
                return res.status(404).json(Response({ 
                    status: "error", 
                    statusCode: 404, 
                    message: 'No cars found' 
                }));
            }
        const userCars = await Car.find({ userId })
        .skip((page - 1) * limit)
        .limit(limit);


         // Generate pagination data
         const paginationOfaichatbot = pagination(userCarsLength, limit, page);
        res.status(200).json(Response({
            status: "success",
            statusCode: 200,
            message: "User cars retrieved successfully",
            data: userCars,
            pagination:paginationOfaichatbot
        }));
    } catch (error) {
        next(error);
    }
};

// update your car aboialbletiy
const carAbialelityByAgency=async(req,res,next)=>{
    try {

        const agency=req.user.role
        if (agency !== "agency") {
            return res.status(401).json(Response({
                status: "error",
                statusCode: 401,
                message: "Sorry, you are not authorized as an agency."
            }));
        }
        const {carId,carStatus}=req.body

        const updateCar=await Car.findByIdAndUpdate(carId,{carStatus:carStatus},{new:true})

        res.status(200).json(Response({
            status: "success",
            statusCode: 200,
            message: "Car update successfully retrieved successfully",
            data: updateCar
        }));
        
    } catch (error) {
        next(error)
        
    }

}

// Get car details by ID
// const getCarDetails = async (req, res, next) => {
//     try {
//         const { carId } = req.query; // Get the car ID from the request parameters
//         const car = await Car.findById(carId).populate("userId"); // Find the car by its ID

//         if (!car) {
//             return res.status(404).json(Response({
//                 status: "error",
//                 statusCode: 404,
//                 message: "Car not found"
//             }));
//         }

//         res.status(200).json(Response({
//             status: "success",
//             statusCode: 200,
//             message: "Car details retrieved successfully",
//             data: car
//         }));
//     } catch (error) {
//         next(error);
//     }
// };

// Get car details by ID
const getCarDetails = async (req, res, next) => {
    try {
        const { carId } = req.query; // Get the car ID from the request parameters

        // Find the car by its ID and populate related fields
        const car = await Car.findById(carId).populate("userId");

        if (!car) {
            return res.status(404).json(Response({
                status: "error",
                statusCode: 404,
                message: "Car not found"
            }));
        }

        // Filter out past bookedDates
        const today = new Date();
        const filteredBookedDates = car.bookedDates.filter(date => {
            const endDate = new Date(date.endDate);
            return endDate >= today; // Keep only current or future dates
        });
        

        // Attach filtered bookedDates to the response
        car.bookedDates = filteredBookedDates;

        car.save()
     
        // await Car.findByIdAndUpdate(carId,{bookedDates:filteredBookedDates},{new:true})

        res.status(200).json(Response({
            status: "success",
            statusCode: 200,
            message: "Car details retrieved successfully",
            data: car
        }));
    } catch (error) {
        next(error);
    }
};
// const getCarDetails = async (req, res, next) => {
//     try {
//         const { carId } = req.query; // Get the car ID from the request parameters

//         // Calculate today's date
//         const today = new Date();

//         // Remove past bookedDates from the database
//         const car = await Car.findByIdAndUpdate(
//             carId,
//             {
//                 $pull: {
//                     bookedDates: {
//                         endDate: { $lt: today }, // Remove dates where endDate is before today
//                     },
//                 },
//             },
//             { new: true } // Return the updated document
//         ).populate("userId");

//         if (!car) {
//             return res.status(404).json({
//                 status: "error",
//                 statusCode: 404,
//                 message: "Car not found",
//             });
//         }

//         res.status(200).json({
//             status: "success",
//             statusCode: 200,
//             message: "Car details retrieved successfully",
//             data: car,
//         });
//     } catch (error) {
//         next(error);
//     }
// };











// const getFilteredCars = async (req, res, next) => {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
  
//       const {
//         price, category, vehicle, mileage, fuelType, mileageLimit,
//         transmission, fuelCondations, guarantee, passengers, use
//       } = req.query;
  
//       // Build dynamic query object
//       const query = {
//         carStatus: { $ne: "notAvailable" }, // Exclude cars with carStatus as "notAvailable"
//       };
  
//       // Function to handle both single and multiple values
//       const handleMultipleValues = (field, value) => {
//         const values = value.split(',').map(v => v.trim());
//         return values.length > 1 ? { $in: values } : value;
//       };
  
//       // Price range filter
//       if (price) {
//         const [minPrice, maxPrice] = price.split('-').map(value => value.trim());
//         if (!isNaN(Number(minPrice)) && !isNaN(Number(maxPrice))) {
//           query.$expr = { $and: [] };
//           if (minPrice) query.$expr.$and.push({ $gte: [{ $toDouble: "$price" }, parseFloat(minPrice)] });
//           if (maxPrice) query.$expr.$and.push({ $lte: [{ $toDouble: "$price" }, parseFloat(maxPrice)] });
//         } else {
//           return res.status(400).json({ status: 'error', message: 'Invalid price range format. Use min-max (e.g., 10-20).' });
//         }
//       }
  
//       // Category filter (single/multiple values)
//       if (category) query.category = handleMultipleValues("category", category);
  
//       // Vehicle filter (single/multiple values)
//       if (vehicle) query.vehicle = handleMultipleValues("vehicle", vehicle);
  
//       // Transmission filter
//       if (transmission) query.transmission = handleMultipleValues("transmission", transmission);
  
//       // Fuel Type filter (single/multiple values)
//       if (fuelType) query.fuelType = handleMultipleValues("fuelType", fuelType);
  
//       // Fuel Conditions filter (single/multiple values)
//       if (fuelCondations) query.fuelCondations = handleMultipleValues("fuelCondations", fuelCondations);
  
//       // Passengers filter (single/multiple values)
//       if (passengers) query.passengers = handleMultipleValues("passengers", passengers);
  
//       // Use filter (single/multiple values)
//       if (use) query.use = handleMultipleValues("use", use);
  
//       // Mileage Filter
//       if (mileage === "Unlimited") {
//         query.mileage = "Unlimited";
//       } else if (mileage === "Limited" && mileageLimit && !isNaN(Number(mileageLimit))) {
//         query.mileageLimit = { $lte: Number(mileageLimit) };
//       }
  
//       // Guarantee Filter
//       if (guarantee) {
//         query.$expr = query.$expr || { $and: [] };
//         if (guarantee === "under") {
//           query.$expr.$and.push({ $lte: [{ $toDouble: "$guarantee" }, 7000] });
//         } else if (guarantee === "up") {
//           query.$expr.$and.push({ $gt: [{ $toDouble: "$guarantee" }, 7000] });
//         }
//       }
  
     
      
//       // Fetch total count for pagination
//       const carsLength = await Car.find(query).countDocuments();
    
  
//       // Fetch filtered cars with pagination
//       const cars = await Car.find(query)
//         .skip((page - 1) * limit)
//         .limit(limit);
  
//       if (carsLength === 0) {
//         return res.status(404).json({ status: "error", statusCode: 404, message: "Car not found" });
//       }
  
//       // Generate pagination data
//       const paginationData = pagination(carsLength, limit, page);
  
//       // Respond with filtered cars
//       res.status(200).json({
//         status: 'success',
//         statusCode: 200,
//         message: 'Cars fetched successfully',
//         data: cars,
//         pagination: paginationData
//       });
  
//     } catch (error) {
//       next(error);
//     }
//   };
  














//   const getFilteredCars = async (req, res, next) => {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
  
//       const {
//         price, category, vehicle, mileage, fuelType, mileageLimit,
//         transmission, fuelCondations, guarantee, passengers, use
//       } = req.query;
  
//       // Build dynamic query object
//       let query = {
//         carStatus: { $ne: "notAvailable" }, // Exclude unavailable cars
//       };
  
//       // Function to handle both single and multiple values
//       const handleMultipleValues = (value) => {
//         const values = value.split(',').map(v => v.trim());
//         return values.length > 1 ? { $in: values } : value;
//       };
  
//       // Price range filter
//       if (price) {
//         const [minPrice, maxPrice] = price.split('-').map(value => value.trim());
//         if (!isNaN(Number(minPrice)) && !isNaN(Number(maxPrice))) {
//           query.$expr = { $and: [] };
//           if (minPrice) query.$expr.$and.push({ $gte: [{ $toDouble: "$price" }, parseFloat(minPrice)] });
//           if (maxPrice) query.$expr.$and.push({ $lte: [{ $toDouble: "$price" }, parseFloat(maxPrice)] });
//         } else {
//           return res.status(400).json({ status: 'error', message: 'Invalid price range format. Use min-max (e.g., 10-20).' });
//         }
//       }
  
//       // Apply filters only if they exist
//       if (category) query.category = handleMultipleValues(category);
//       if (vehicle) query.vehicle = handleMultipleValues(vehicle);
//       if (transmission) query.transmission = handleMultipleValues(transmission);
//       if (fuelType) query.fuelType = handleMultipleValues(fuelType);
//       if (fuelCondations) query.fuelCondations = handleMultipleValues(fuelCondations);
//       if (passengers) query.passengers = handleMultipleValues(passengers);
//       if (use) query.use = handleMultipleValues(use);
  
//       // Mileage Filter
//       if (mileage) {
//         if (mileage === "Unlimited") {
//           query.mileage = "Unlimited";
//         } else if (mileage === "Limited" && mileageLimit && !isNaN(Number(mileageLimit))) {
//           query.mileageLimit = { $lte: Number(mileageLimit) };
//         }
//       }
  
//       // Guarantee Filter
//       if (guarantee) {
//         query.$expr = query.$expr || { $and: [] };
//         if (guarantee === "under") {
//           query.$expr.$and.push({ $lte: [{ $toDouble: "$guarantee" }, 7000] });
//         } else if (guarantee === "up") {
//           query.$expr.$and.push({ $gt: [{ $toDouble: "$guarantee" }, 7000] });
//         }
//       }
  
//       // Fetch total count for pagination
//       let carsLength = await Car.find(query).countDocuments();
  
//       // If no results are found, remove filters and check for any data
//       if (carsLength === 0) {
//         const totalCarsInDB = await Car.countDocuments();
//         if (totalCarsInDB === 0) {
//           return res.status(404).json({ status: "error", message: "No cars available in the database." });
//         } else {
//           return res.status(404).json({ status: "error", message: "No cars match the filters, but there are other cars available." });
//         }
//       }
  
//       // Fetch filtered cars with pagination
//       const cars = await Car.find(query)
//         .skip((page - 1) * limit)
//         .limit(limit);
  
//       // Generate pagination data
//       const paginationData = pagination(carsLength, limit, page);
  
//       // Respond with filtered cars
//       res.status(200).json({
//         status: 'success',
//         statusCode: 200,
//         message: 'Cars fetched successfully',
//         data: cars,
//         pagination: paginationData
//       });
  
//     } catch (error) {
//       next(error);
//     }
//   };
const getFilteredCars = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      const {
        price, category, vehicle, mileage, fuelType, mileageLimit,
        transmission, fuelCondations, guarantee, passengers, use
      } = req.query;
  
      // Build dynamic query object
      let query = {
        carStatus: { $ne: "notAvailable" }, // Exclude unavailable cars
      };
  
      // Function to handle both single and multiple values
      const handleMultipleValues = (value) => {
        let decodedValue = decodeURIComponent(value);
        
        // Check if it's an array-like value (e.g., ["value1", "value2"])
        if (decodedValue.startsWith('[') && decodedValue.endsWith(']')) {
          decodedValue = decodedValue.slice(1, -1); // Remove the outer square brackets
        }
        
        const values = decodedValue.split(',').map(v => v.trim());
        
        // Return the array if it's multiple values, otherwise just return the single value
        return values.length > 1 ? { $in: values } : values[0];
      };
  
      // Price range filter
      if (price) {
        const [minPrice, maxPrice] = price.split('-').map(value => value.trim());
        if (!isNaN(Number(minPrice)) && !isNaN(Number(maxPrice))) {
          query.$expr = { $and: [] };
          if (minPrice) query.$expr.$and.push({ $gte: [{ $toDouble: "$price" }, parseFloat(minPrice)] });
          if (maxPrice) query.$expr.$and.push({ $lte: [{ $toDouble: "$price" }, parseFloat(maxPrice)] });
        } else {
          return res.status(400).json({ status: 'error', message: 'Invalid price range format. Use min-max (e.g., 10-20).' });
        }
      }
  
      // Apply filters only if they exist
      if (category) query.category = handleMultipleValues(category);
      if (vehicle) query.vehicle = handleMultipleValues(vehicle);
      if (transmission) query.transmission = handleMultipleValues(transmission);
      if (fuelType) query.fuelType = handleMultipleValues(fuelType);
      if (fuelCondations) query.fuelCondations = handleMultipleValues(fuelCondations);
      if (passengers) query.passengers = handleMultipleValues(passengers);
      if (use) query.use = handleMultipleValues(use);
  
    //   // Mileage Filter
    //   if (mileage) {
    //     if (mileage === "Unlimited") {
    //       query.mileage = "Unlimited";
    //     } else if (mileage === "Limited" && mileageLimit && !isNaN(Number(mileageLimit))) {
    //       query.mileageLimit = { $lte: Number(mileageLimit) };
    //     }
    //   }
    //  Mileage Filter
    // Mileage Filter
// Mileage Filter
if (mileage) {
    if (mileage === "Unlimited") {
        // Filter only cars with mileage as "Unlimited"
        query.mileage = "Unlimited";
    } else{
        query.mileage="Limited"
    }
}
      console.log(mileage,"sdsdfkfjlks=======");
      // Guarantee Filter
      if (guarantee) {
        query.$expr = query.$expr || { $and: [] };
        if (guarantee === "under") {
          query.$expr.$and.push({ $lte: [{ $toDouble: "$guarantee" }, 7000] });
        } else if (guarantee === "up") {
          query.$expr.$and.push({ $gt: [{ $toDouble: "$guarantee" }, 7000] });
        }
      }
  
      // Fetch total count for pagination
      let carsLength = await Car.find(query).countDocuments();
  
      // If no results are found, remove filters and check for any data
      if (carsLength === 0) {
        const totalCarsInDB = await Car.countDocuments();
        if (totalCarsInDB === 0) {
          return res.status(404).json({ status: "error", message: "No cars available in the database." });
        } else {
          return res.status(404).json({ status: "error", message: "No cars match the filters, but there are other cars available." });
        }
      }
  
      // Fetch filtered cars with pagination
      const cars = await Car.find(query)
        .skip((page - 1) * limit)
        .limit(limit);
  
      // Generate pagination data
      const paginationData = pagination(carsLength, limit, page);
  
      // Respond with filtered cars
      res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Cars fetched successfully',
        data: cars,
        pagination: paginationData
      });
  
    } catch (error) {
      next(error);
    }
  };
  

// const getFilteredCars = async (req, res, next) => {

// try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;

//     const {
//         price,         // Example: price=5000-10000 (range)
//         category,      // Example: category=SUV
//         vehicle,       // Example: vehicle=Hybrid
//         mileage, 
//         fuelType,
//         mileageLimit,   // Example: mileage=1000-5000 (range)
//         transmission,  // Example: transmission=Autometric
//         fuelCondations, // Example: fuelCondations=Diesel
//         guarantee,     // Example: guarantee=Yes
//         passengers,    // Example: passengers=5
//         use,           // Example: use=Personal
//     } = req.query;

//     // Build dynamic query object
//     const query = {
//         carStatus: { $ne: "notAvailable" }, // Exclude cars with carStatus as "notAvailable"
//         // isRent: { $ne: true } // Exclude cars with isRent as true
//     };

//     // Price range filter
//     if (price) {
//         const [minPrice, maxPrice] = price.split('-').map(value => value.trim());
//         if (!isNaN(Number(minPrice)) && !isNaN(Number(maxPrice))) {
//             query.$expr = { $and: [] };
//             if (minPrice) query.$expr.$and.push({ $gte: [{ $toDouble: "$price" }, parseFloat(minPrice)] });
//             if (maxPrice) query.$expr.$and.push({ $lte: [{ $toDouble: "$price" }, parseFloat(maxPrice)] });
//         } else {
//             return res.status(400).json(Response({
//                 status: 'error',
//                 message: 'Invalid price range format. Use the format minPrice-maxPrice (e.g., 10-20).',
//             }));
//         }
//     }

//     // Category filter
//     if (category) query.category = category;

//     // Vehicle filter (array)
//     if (vehicle) {
//         query.vehicle = { $in: [vehicle] }; // Matches if the vehicle array contains the given type
//     }
   

//     // Transmission filter
//     if (transmission) query.transmission = transmission;
   

//     // Transmission filter
//     if (fuelType) query.fuelType = fuelType;

//     // Fuel Conditions filter
//     if (fuelCondations) query.fuelCondations = fuelCondations;

    
//    // Default minimum mileage value

//     if (mileage === "Unlimited") {
//         // Matches cars with mileage "Unlimited"
//         query.mileage = "Unlimited";  
//     } else if (mileage==="Limited") {
       
//        // Ensure mileageLimit is a valid number string
//     if (mileageLimit && !isNaN(Number(mileageLimit))) {
//         // Convert mileageLimit to a number for proper comparison
//         query.mileageLimit = {
//             $lte: Number(mileageLimit) // Compare as numbers
//         }}
//     };
    
    
    

//     if (guarantee) {
//         query.$expr = query.$expr || { $and: [] }; // Ensure $expr exists
    
//         if (guarantee === "under") {
//             // For values less than or equal to 7000
//             query.$expr.$and.push({ $lte: [{ $toDouble: "$guarantee" }, 7000] });
//         } else if (guarantee === "up") {
//             // For values greater than 7000
//             query.$expr.$and.push({ $gt: [{ $toDouble: "$guarantee" }, 7000] });
//         }
//     }
    
    
    
//     // Passengers filter
//     if (passengers) query.passengers = passengers.toString();

//     // Use filter (array)
//     if (use) {
//         query.use = { $in: [use] }; // Matches if the use array contains the given type
//     }

//     console.log(query);
//     // Fetch total count for pagination
//     const carsLength = await Car.find(query).countDocuments();
//     console.log(carsLength);

//     // Fetch filtered cars with pagination
//     const cars = await Car.find(query)
//         .skip((page - 1) * limit)
//         .limit(limit);

//         if(carsLength===0){
//             res.status(404).json(Response({status:"error",statusCode:404,message:"Car not found"}))
//         }

//     // Generate pagination data
//     const paginationData = pagination(carsLength, limit, page);

//     // Respond with filtered cars
//     res.status(200).json(Response({
//         status: 'success',
//         statusCode:200,
//         message: 'Cars fetched successfully',
//         data: cars,
//         pagination: paginationData
//     }));
// } catch (error) {
//     next(error);
// }
// };
const getAvailableCarsByDate = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                status: 'error',
                message: 'Date is required to filter available cars.',
            });
        }

        // Parse the date to ensure it's valid
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid date format. Use a valid ISO date string.',
            });
        }

        // Query to fetch available cars for the given date
        const query = {
            carStatus: "available", // Only available cars
            isRent: false,          // Cars that are not rented
        };

        const totalCars = await Car.find(query).countDocuments();

        // Fetch cars with pagination
        const cars = await Car.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

            const paginationData = pagination(totalCars, limit, page);

        res.status(200).json({
            status: 'success',
            message: 'Cars fetched successfully for the specified date',
            data: cars,
            pagination: paginationData,
        });
    } catch (error) {
        next(error);
    }
};




module.exports =
 {
    addCar,
    getAllCars,
    getUserCars,
    getCarDetails,
    carAbialelityByAgency,
    getFilteredCars,
    getAvailableCarsByDate

 };
