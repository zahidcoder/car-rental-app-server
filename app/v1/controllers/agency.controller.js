const pagination = require("../../../helpers/pagination");
const Response = require("../../../helpers/respones");
const User = require("../models/User");

const showDriverRequiestToAgency = async (req, res, next) => {
  try {
    const agencyId = req.user._id; // Agency's ID from the authenticated user's token
    const page = parseInt(req.query.page) || 1; // Current page
    const limit = parseInt(req.query.limit) || 10; // Number of items per page

    // Query to find drivers associated with the agency and already accepted
    const filter = {
      role: "driver",
      agencyId,
      isAgentAcceptDriver: false,
      isBlocked:false ,
      // drivingLicence:null                                                     
    };

    // Count the total number of accepted drivers
    const totalDrivers = await User.countDocuments(filter);

    // Fetch drivers with pagination
    const drivers = await User.find(filter)
      .skip((page - 1) * limit) // Skip documents for previous pages
      .limit(limit); // Limit results for the current page

      console.log(drivers,"saldkfjsdlkfj",filter);
    // Check if there are any drivers
    if (!drivers.length) {
      return res.status(404).json(Response({
        status: "error",
        statusCode: 404,
        message: "No  drivers found.",
      }));
    }

     // Generate pagination data
     const paginationData = pagination(totalDrivers, limit, page);
  

    // Respond with the accepted drivers and pagination
    res.status(200).json(Response({
      status: "success",
      statusCode: 200,
      message: "Accepted drivers fetched successfully.",
      data: drivers,
      pagination: paginationData,
    }));
  } catch (error) {
    next(error); // Pass the error to the centralized error handler
  }
};
const showAcceptedDriver = async (req, res, next) => {
  try {
    const agencyId = req.user._id; // Agency's ID from the authenticated user's token
    const page = parseInt(req.query.page) || 1; // Current page
    const limit = parseInt(req.query.limit) || 10; // Number of items per page

    // Query to find drivers associated with the agency and already accepted
    const filter = {
      role: "driver",
      agencyId,
      isAgentAcceptDriver: true,
      isBlocked:false
    };

    // Count the total number of accepted drivers
    const totalDrivers = await User.countDocuments(filter);

    // Fetch drivers with pagination
    const drivers = await User.find(filter)
      .skip((page - 1) * limit) // Skip documents for previous pages
      .limit(limit); // Limit results for the current page

    // Check if there are any drivers
    if (!drivers.length) {
      return res.status(404).json(Response({
        status: "error",
        statusCode: 404,
        message: "No accepted drivers found.",
      }));
    }

     // Generate pagination data
     const paginationData = pagination(totalDrivers, limit, page);
  

    // Respond with the accepted drivers and pagination
    res.status(200).json(Response({
      status: "success",
      statusCode: 200,
      message: "Accepted drivers fetched successfully.",
      data: drivers,
      pagination: paginationData,
    }));
  } catch (error) {
    next(error); // Pass the error to the centralized error handler
  }
};

const blockedDriver = async (req, res, next) => {
    try {
      const { id } = req.query;
  
      // Validate if ID is provided
      if (!id) {
        return res.status(400).json({
          status: "error",
          statusCode: 400,
          message: "Driver ID is required.",
        });
      }
  
      // Find and update the driver's blocked status
      const updatedDriver = await User.findByIdAndUpdate(
        id,
        { isBlocked: true },
        { new: true } // Return the updated document
      );
  
      // If the driver does not exist
      if (!updatedDriver) {
        return res.status(404).json({
          status: "error",
          statusCode: 404,
          message: "Driver not found.",
        });
      }
  
      // Respond with success
      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Driver blocked successfully.",
        data: updatedDriver,
      });
    } catch (error) {
      next(error); // Pass error to middleware for centralized error handling
    }
  };
  const driverAccepted = async (req, res, next) => {
    try {
      const { id } = req.query; // Get driver ID from query
      const agencyId = req.user._id; // Get agency ID from the logged-in user
  
      // Validate if ID is provided
      if (!id) {
        return res.status(400).json({
          status: "error",
          statusCode: 400,
          message: "Driver ID is required.",
        });
      }
  
      // Find the driver and ensure they belong to the agency
      const driver = await User.findOne({ _id: id, role: "driver", agencyId });

  
      if (!driver) {
        return res.status(404).json({
          status: "error",
          statusCode: 404,
          message: "Driver not found or does not belong to your agency.",
        });
      }
      if (driver.drivingLicence===null) {
        return res.status(404).json({
          status: "error",
          statusCode: 404,
          message: "Driver not add yet his drivingLicence.",
        });
      }

  
      // Update the driver's accepted status
      driver.isAgentAcceptDriver = true;
      await driver.save();
  
      // Respond with success
      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Driver accepted successfully.",
        data: driver,
      });
    } catch (error) {
      next(error); // Pass error to middleware for centralized error handling
    }
  };
  
  

module.exports = { showAcceptedDriver,showDriverRequiestToAgency,blockedDriver,driverAccepted };
