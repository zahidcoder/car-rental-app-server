const pagination = require("../../../helpers/pagination");
const Response = require("../../../helpers/respones");
const Car = require("../models/Car");

// user home page seach controller
// Top cars in the user homepage
const showTopCarForUser = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // Find cars with a rating of 4.5
        const topCarslength = await Car.find({ ratings: { $gte: 4.50 },carStatus:"available" }).countDocuments()
        const topCars = await Car.find({ ratings: { $gte: 4.50 },carStatus:"available" })
        .skip((page - 1) * limit)
            .limit(limit);

        // Check if there are any top cars to display
        if (!topCars || topCars.length === 0) {
            return res.status(404).json({
                status: "error",
                statusCode: 404,
                message: "No top cars found with a rating of 4.5.",
            });
        }

        const carshowPagiantion=pagination(topCarslength,limit,page)

        res.status(200).json(Response({
            status: "success",
            statusCode: 200,
            message: "Top cars fetched successfully.",
            data: topCars,
            pagination:carshowPagiantion
        }));
    } catch (error) {
        next(error); // Pass any errors to the global error handler
    }
};


// // Filter cars by brand name
// const filterCarsByBrand = async (req, res, next) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;

//         const { brandName } = req.query; // Assume the brand name is passed as a route parameter

//         // Find cars with the specified brand name
//         const carsByBrandLength= await Car.find({ carBrand: brandName }).countDocuments()
//         const carsByBrand = await Car.find({ carBrand: brandName })
//         .skip((page - 1) * limit)
//             .limit(limit);
//         console.log(carsByBrand,brandName);

//         // Check if any cars match the brand name
//         if (!carsByBrand || carsByBrand.length === 0) {
//             return res.status(404).json({
//                 status: "error",
//                 statusCode: 404,
//                 message: `No cars found for the brand "${brandName}".`,
//             });
//         }
//         const carshowPagiantion=pagination(carsByBrandLength,limit,page)

//         res.status(200).json(Response({
//             status: "success",
//             statusCode: 200,
//             message: `Cars from the brand "${brandName}" fetched successfully.`,
//             data: carsByBrand,
//             pagination:carshowPagiantion
//         }));
//     } catch (error) {
//         next(error); // Pass any errors to the global error handler
//     }
// };
module.exports = {
     showTopCarForUser,
    //  filterCarsByBrand
     };

