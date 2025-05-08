const pagination = require("../../../../helpers/pagination");
const Response = require("../../../../helpers/respones")
const User = require("../../models/User")

const showAllUserInAdmin = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      // Get filters from query parameters
      const { name, date } = req.query;
  
      // Build the filter query
      const query = { isVerified: true, isBlocked: false,role:"user" };
  
      // If name filter is provided, search for users whose name matches (case-insensitive)
      if (name) {
        query.name = { $regex: name, $options: "i" };
      }
  
      // If a specific date is provided, filter users created on that date
      if (date) {
        const specificDate = new Date(date);
        const nextDay = new Date(specificDate);
        nextDay.setDate(specificDate.getDate() + 1);
  
        query.createdAt = { $gte: specificDate, $lt: nextDay };
      }
  
      // Fetch total count of users matching the query
      const allUserLength = await User.find(query).countDocuments();
  
      // Fetch paginated users matching the query
      const allUser = await User.find(query)
        .skip((page - 1) * limit)
        .limit(limit);
  
      // Generate pagination data
      const paginationData = pagination(allUserLength, limit, page);
  
      res.status(200).json(
        Response({
          status: "success",
          statusCode: 200,
          message: "Users fetched successfully",
          data: allUser,
          pagination: paginationData,
        })
      );
    } catch (error) {
      next(error);
    }
  };
const showAllAgencyInAdmin = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      // Get filters from query parameters
      const { name, date } = req.query;
  
      // Build the filter query
      const query = { isVerified: true, isBlocked: false,role:"agency" };
  
      // If name filter is provided, search for users whose name matches (case-insensitive)
      if (name) {
        query.name = { $regex: name, $options: "i" };
      }
  
      // If a specific date is provided, filter users created on that date
      if (date) {
        const specificDate = new Date(date);
        const nextDay = new Date(specificDate);
        nextDay.setDate(specificDate.getDate() + 1);
  
        query.createdAt = { $gte: specificDate, $lt: nextDay };
      }
  
      // Fetch total count of users matching the query
      const allUserLength = await User.find(query).countDocuments();
  
      // Fetch paginated users matching the query
      const allUser = await User.find(query)
        .skip((page - 1) * limit)
        .limit(limit);
  
      // Generate pagination data
      const paginationData = pagination(allUserLength, limit, page);
  
      res.status(200).json(
        Response({
          status: "success",
          statusCode: 200,
          message: "Users fetched successfully",
          data: allUser,
          pagination: paginationData,
        })
      );
    } catch (error) {
      next(error);
    }
  };
const showAllDriverInAdmin = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      // Get filters from query parameters
      const { name, date } = req.query;
  
      // Build the filter query
      const query = { isVerified: true, isBlocked: false,role:"driver" };
  
      // If name filter is provided, search for users whose name matches (case-insensitive)
      if (name) {
        query.name = { $regex: name, $options: "i" };
      }
  
      // If a specific date is provided, filter users created on that date
      if (date) {
        const specificDate = new Date(date);
        const nextDay = new Date(specificDate);
        nextDay.setDate(specificDate.getDate() + 1);
  
        query.createdAt = { $gte: specificDate, $lt: nextDay };
      }
  
      // Fetch total count of users matching the query
      const allUserLength = await User.find(query).countDocuments();
  
      // Fetch paginated users matching the query
      const allUser = await User.find(query)
        .skip((page - 1) * limit)
        .limit(limit);
  
      // Generate pagination data
      const paginationData = pagination(allUserLength, limit, page);
  
      res.status(200).json(
        Response({
          status: "success",
          statusCode: 200,
          message: "Users fetched successfully",
          data: allUser,
          pagination: paginationData,
        })
      );
    } catch (error) {
      next(error);
    }
  };
  

  const showUserById = async (req, res, next) => {
    try {
      const { userId } = req.query; // Extract userId from request parameters
  
      // Fetch the user by ID
      const user = await User.findById(userId);
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json(
          Response({
            status: "error",
            statusCode: 404,
            message: "User not found or unavailable",
          })
        );
      }
  
      res.status(200).json(
        Response({
          status: "success",
          statusCode: 200,
          message: "User fetched successfully",
          data: user,
        })
      );
    } catch (error) {
      
      next(error);
    }
  };
  
  const showUserWithDrivingLicence = async (req, res, next) => {
    try {
      const showAllUser = await User.find({
        drivingLicence: { $ne: null },  // Find users where drivingLicence is not null
        isVerifiedProfile: false,  // Check that profile is not verified
      });
  
      res.status(200).json(
        Response({
          status: "success",
          statusCode: 200,
          message: "Users fetched successfully",
          data: showAllUser,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  const makeuserVerified=async(req,res,next)=>{
    try {
      const {id}=req.query
      console.log(id);

      const verifyed=await User.findByIdAndUpdate(id,{isVerifiedProfile:true})
      res.status(200).json(
        Response({
          status: "success",
          statusCode: 200,
          message: "Users verifed  successfully",
          data: verifyed,
        }))
      
    } catch (error) {
      next(error)
    }
  }
  
  const getverifyedUsers = async (req, res, next) => {
    try {
      const showAllUser = await User.find({
       // Find users where drivingLicence is not null
        isVerifiedProfile: true,  // Check that profile is not verified
      });
  
      res.status(200).json(
        Response({
          status: "success",
          statusCode: 200,
          message: "Users  verifyed fetched successfully",
          data: showAllUser,
        })
      );
    } catch (error) {
      next(error);
    }
  };
module.exports={
    showAllUserInAdmin,
    showAllAgencyInAdmin,
    showUserById,
    showUserWithDrivingLicence,
    makeuserVerified,
    getverifyedUsers,
    showAllDriverInAdmin
}