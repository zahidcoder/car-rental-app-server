const pagination = require('../../../helpers/pagination');
const Response = require('../../../helpers/respones');
const Car = require('../models/Car');
const CarBrand = require('../models/CarBrand');

// Create Car Brand
// const createCarBrand = async (req, res, next) => {
//     try {
//         const { brandName, carType } = req.body;

//         // Admin authorization check
//         const admin = req.user?.role;
//         console.log(admin);
//         if (admin !== "admin") {
//             return res.status(401).json(Response({
//                 status: "error",
//                 statusCode: 401,
//                 message: "Sorry, you are not authorized as an admin."
//             }));
//         }

//         // File upload for car image
//         const file = [];
//         const { brandLogo } = req.files || {};

//         if (brandLogo) {
//             const logoFiles = Array.isArray(brandLogo) ? brandLogo : [brandLogo];
            
//             logoFiles.forEach((img) => {
//                 const publicFileUrl = `/images/users/${img.filename}`;
//                 file.push({
//                     publicFileUrl,
//                     path: img.filename,
//                 });
//             });
//         }

//         // Ensure carType is an array of strings or parse it if it's a JSON string
//         let carTypeArray;
//         try {
//             carTypeArray = Array.isArray(carType) ? carType : JSON.parse(carType);
//         } catch (error) {
//             return res.status(400).json(Response({
//                 status: "error",
//                 statusCode: 400,
//                 message: "Invalid format for carType. It should be an array of strings."
//             }));
//         }

//         const carBrand = new CarBrand({
//             brandName,
//             brandImage: file.length > 0 ? file[0] : null,
//             carType: carTypeArray,
//         });

//         const savedCarBrand = await carBrand.save();
        
//         res.status(200).json(Response({
//             status: "success",
//             statusCode: 200,
//             message: "Car brand added successfully",
//             data: savedCarBrand
//         }));
//     } catch (error) {
//         next(error); // Pass error to the global error handler
//     }
// };
const createCarBrand = async (req, res, next) => {
    try {
        const { brandName, carType } = req.body;

        // Admin authorization check
        const admin = req.user?.role;
        console.log(admin);
        if (admin !== "admin") {
            return res.status(401).json(Response({
                status: "error",
                statusCode: 401,
                message: "Sorry, you are not authorized as an admin."
            }));
        }

        // File upload for car image
        const file = [];
        const { brandLogo } = req.files || {};

        if (brandLogo) {
            const logoFiles = Array.isArray(brandLogo) ? brandLogo : [brandLogo];
            
            logoFiles.forEach((img) => {
                const publicFileUrl = `/images/users/${img.filename}`;
                file.push({
                    publicFileUrl,
                    path: img.filename,
                });
            });
        }

        // Ensure carType is an array of strings or parse it if it's a JSON string
        let carTypeArray;
        try {
            carTypeArray = Array.isArray(carType) ? carType : JSON.parse(carType);
        } catch (error) {
            return res.status(400).json(Response({
                status: "error",
                statusCode: 400,
                message: "Invalid format for carType. It should be an array of strings."
            }));
        }

        // Trim spaces from each carType value
        carTypeArray = carTypeArray.map(type => type.trim());

        const carBrand = new CarBrand({
            brandName,
            brandImage: file.length > 0 ? file[0] : null,
            carType: carTypeArray,
        });

        const savedCarBrand = await carBrand.save();
        
        res.status(200).json(Response({
            status: "success",
            statusCode: 200,
            message: "Car brand added successfully",
            data: savedCarBrand
        }));
    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};


// Update Car Brand
const updateCarBrand = async (req, res, next) => {
    try {
        const { id } = req.query; // Get the ID of the car brand to update
        const { brandName, carType } = req.body;

        // Admin authorization check
        const admin = req.user?.role;
        if (admin !== "admin") {
            return res.status(401).json(Response({
                status: "error",
                statusCode: 401,
                message: "Sorry, you are not authorized as an admin."
            }));
        }

        // Find the car brand by ID
        const carBrand = await CarBrand.findById(id);
        if (!carBrand) {
            return res.status(404).json(Response({
                status: "error",
                statusCode: 404,
                message: "Car brand not found."
            }));
        }

        // File upload for brand logo
        const file = [];
        const { brandLogo } = req.files || {};

        if (brandLogo) {
            const logoFiles = Array.isArray(brandLogo) ? brandLogo : [brandLogo];

            logoFiles.forEach((img) => {
                const publicFileUrl = `/images/users/${img.filename}`;
                file.push({
                    publicFileUrl,
                    path: img.filename,
                });
            });
        }

        // Parse carType if it's a JSON string
        let carTypeArray;
        try {
            carTypeArray = Array.isArray(carType) ? carType : carType ? JSON.parse(carType) : carBrand.carType;
        } catch (error) {
            return res.status(400).json(Response({
                status: "error",
                statusCode: 400,
                message: "Invalid format for carType. It should be an array of strings."
            }));
        }

        // Update fields
        carBrand.brandName = brandName || carBrand.brandName;
        carBrand.carType = carTypeArray;
        if (file.length > 0) {
            carBrand.brandImage = file[0];
        }

        // Save updated car brand
        const updatedCarBrand = await carBrand.save();

        res.status(200).json(Response({
            status: "success",
            statusCode: 200,
            message: "Car brand updated successfully",
            data: updatedCarBrand
        }));
    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};

const deleteCarBrand = async (req, res, next) => {
    try {
      const admin = req.user?.role;
  
      // Admin authorization check
      if (admin !== "admin") {
        return res.status(401).json(
          Response({
            status: "error",
            statusCode: 401,
            message: "Sorry, you are not authorized as an admin.",
          })
        );
      }
  
      const { id } = req.query;
  
      // Check if the car brand exists
      const carBrand = await CarBrand.findById(id);
      if (!carBrand) {
        return res.status(404).json(
          Response({
            status: "error",
            statusCode: 404,
            message: "Car brand not found.",
          })
        );
      }
  
      // Delete the car brand
      await carBrand.deleteOne();
  
      res.status(200).json(
        Response({
          status: "success",
          statusCode: 200,
          message: "Car brand deleted successfully.",
        })
      );
    } catch (error) {
      next(error); // Pass error to the global error handler
    }
  };

  const showCarBrandById = async (req, res, next) => {
    try {
      const { id } = req.query;
  
      // Find the car brand by ID
      const carBrand = await CarBrand.findById(id);
  
      if (!carBrand) {
        return res.status(404).json(
          Response({
            status: "error",
            statusCode: 404,
            message: "Car brand not found.",
          })
        );
      }
  
      res.status(200).json(
        Response({
          status: "success",
          statusCode: 200,
          message: "Car brand fetched successfully.",
          data: carBrand,
        })
      );
    } catch (error) {
      next(error); // Pass error to the global error handler
    }
  };
  


// Get Car Types by Brand Name
const getCarTypeByBrandName = async (req, res, next) => {
    try {
        const { brandName } = req.query;

        // Check if brandName is provided
        if (!brandName) {
            return res.status(400).json(Response({
                status: "error",
                statusCode: 400,
                message: "Brand name is required"
            }));
        }

        // Find car brand by name
        const carBrand = await CarBrand.findOne({ brandName: brandName });

        // Check if the car brand exists
        if (!carBrand) {
            return res.status(404).json(Response({
                status: "error",
                statusCode: 404,
                message: "Car brand not found"
            }));
        }

        // Send response with car types for the brand
        res.status(200).json(Response({
            status: "success",
            statusCode: 200,
            message: "Car types retrieved successfully",
            data: carBrand.carType
        }));
    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};

const getAllCarTypes = async (req, res, next) => {
    try {
        // Find all car brands
        const carBrands = await CarBrand.find({}, "carType"); // Retrieve only the carType field

        // Extract all car types into a single array
        const allCarTypes = [...new Set(carBrands.flatMap(brand => brand.carType))]; // Ensure uniqueness

        // Check if car types exist
        if (!allCarTypes.length) {
            return res.status(404).json(Response({
                status: "error",
                statusCode: 404,
                message: "No car types found"
            }));
        }

        // Send response with all car types
        res.status(200).json(Response({
            status: "success",
            statusCode: 200,
            message: "All car types retrieved successfully",
            data: allCarTypes
        }));
    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};



// Get all Car Brands
const getAllCarBrands = async (req, res, next) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;

        const carBrandsLength = await CarBrand.find().countDocuments() // Retrieve only specific fields
        const carBrands = await CarBrand.find()
        .skip((page - 1) * limit)
            .limit(limit);// Retrieve only specific fields

        // Check if there are any car brands
        if (carBrands.length === 0) {
            return res.status(404).json(Response({
                status: "error",
                statusCode: 404,
                message: "No car brands found"
            }));
        }

           // Generate pagination data
           const paginationOfaichatbot = pagination(carBrandsLength, limit, page);
        // Send response with car brand data
        res.status(200).json(Response({
            status: "success",
            statusCode: 200,
            message: "Car brands retrieved successfully",
            data: carBrands,
            pagination:paginationOfaichatbot
        }));
    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};


// Get Cars by Brand Name
const getCarsByBrandName = async (req, res, next) => {
    try {
        const { brandName } = req.query;

        // Check if brandName is provided
        if (!brandName) {
            return res.status(400).json(Response({
                status: "error",
                statusCode: 400,
                message: "Brand name is required"
            }));
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Find cars by brand name and count total results for pagination
        const totalCars = await Car.find({ carBrand:brandName,carStatus:"available" }).countDocuments();
        const cars = await Car.find({ carBrand:brandName ,carStatus:"available"})
            .skip((page - 1) * limit)
            .limit(limit);

        // Check if any cars are found
        if (totalCars === 0) {
            return res.status(404).json(Response({
                status: "error",
                statusCode: 404,
                message: "No cars found for this brand"
            }));
        }

        // Generate pagination data
        const paginationData = pagination(totalCars, limit, page);

        // Send response with car data and pagination
        res.status(200).json(Response({
            status: "success",
            statusCode: 200,
            message: "Cars retrieved successfully",
            data: cars,
            pagination: paginationData
        }));
    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};

// Get all Car Brands (Only Brand Name)
const getAllCarBrandNames = async (req, res, next) => {
    try {
    

    

        // Fetch only brand names with pagination
        const carBrandNames = await CarBrand.find()
            .select("brandName") // Select only the "brandName" field
         

        // Check if there are any car brands
        if (carBrandNames.length === 0) {
            return res.status(404).json(
                Response({
                    status: "error",
                    statusCode: 404,
                    message: "No car brands found",
                })
            );
        }

       

        // Send response with only brand names
        res.status(200).json(
            Response({
                status: "success",
                statusCode: 200,
                message: "Car brand names retrieved successfully",
                data: carBrandNames,
            
            })
        );
    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};


module.exports = {
    createCarBrand,
    getCarTypeByBrandName,
    getAllCarBrands,
    getCarsByBrandName,
    getAllCarBrandNames,
    getAllCarTypes,
    updateCarBrand,
    deleteCarBrand,
    showCarBrandById
};
