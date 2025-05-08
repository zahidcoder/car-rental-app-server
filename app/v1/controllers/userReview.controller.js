const pagination = require("../../../helpers/pagination");
const Response = require("../../../helpers/respones");
const BookCar = require("../models/BookCar");
const User = require("../models/User");
const UserReview = require("../models/UserReview");
const mongoose = require("mongoose");

const createUserReview = async (req, res, next) => {
  try {
    const id = req.user._id;

    const { reviewRechiver, reviewComment, reviewStar, bookingId } = req.body;
    
    // Validate required fields
    if (!reviewRechiver || !reviewStar || !bookingId) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: " reviewRechiver, bookingId and reviewStar are required.",
      });
    }

    // Ensure reviewStar is valid
    if (reviewStar < 1.0 || reviewStar > 5.0) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "reviewStar must be between 1.0 and 5.0.",
      });
    }
    //exist booking
    const existBooking = await BookCar.findById(bookingId);
    if (!existBooking) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "Booking Not found",
      });
    }

    //check already review existing
    const existingReview = await UserReview.findOne({
      bookingId: bookingId,
      reviewGiver : id,
    });

    console.log(existingReview)
    ;
    if (existingReview) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "You already review this booking",
      });
    }
    // Create a new review
    const newReview = new UserReview({
      bookingId,
      reviewGiver: id,
      reviewRechiver,
      reviewComment,
      reviewStar,
    });

    await newReview.save();

    // Calculate the updated average rating for the agency
    const reviews = await UserReview.find({
      reviewRechiver: reviewRechiver,
      isDeleted: false,
    });

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.reviewStar,
      0
    );
    const averageRating = (totalRating / reviews.length).toFixed(2); // Calculate and format to 2 decimal places

    await User.findByIdAndUpdate(
      reviewRechiver,
      { rating: averageRating },
      { new: true }
    );

    res.status(200).json(
      Response({
        status: "success",
        statusCode: 200,
        message: "Review created successfully.",
        data: newReview,
      })
    );
  } catch (error) {
    next(error); // Pass error to centralized error handler
  }
};

// const showRewiewForUser=async(req,res,next)=>{
//     try {
//         const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//         const {reviewReciverId}=req.query

//         const allReviewLength=await UserReview.find({reviewRechiver:reviewReciverId}).countDocuments()
//         const allReview=await UserReview.find({reviewRechiver:reviewReciverId})
//         .skip((page - 1) * limit)
//         .limit(limit);

//         const paginationData = pagination(allReviewLength, limit, page);

//         res.status(200).json(Response({
//             status: "success",
//             statusCode: 200,
//             message: "Review show successfully.",
//             data: allReview,
//             pagination:paginationData
//         }));
//     } catch (error) {
//         next(error)
//     }
// }

const showRewiewForUser = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { reviewReciverId } = req.query;

    // Validate input
    if (!reviewReciverId) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "reviewReciverId is required.",
      });
    }

    // Get total review count
    const allReviewLength = await UserReview.find({
      reviewRechiver: reviewReciverId,
    }).countDocuments();

    // Paginate reviews
    const allReview = await UserReview.find({ reviewRechiver: reviewReciverId })
      .populate("reviewRechiver reviewGiver")
      .skip((page - 1) * limit)
      .limit(limit);

    // Calculate review statistics
    const reviewStats = await UserReview.aggregate([
      {
        $match: {
          reviewRechiver: new mongoose.Types.ObjectId(reviewReciverId), // Match reviews for this user
          isDeleted: false, // Exclude soft-deleted reviews
        },
      },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 }, // Total reviews
          averageRating: { $avg: "$reviewStar" }, // Average star rating
        },
      },
    ]);

    const ratingsDistribution = await UserReview.aggregate([
      {
        $match: {
          reviewRechiver: new mongoose.Types.ObjectId(reviewReciverId),
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$reviewStar", // Group by review star
          count: { $sum: 1 }, // Count reviews for each star
        },
      },
      {
        $addFields: {
          percentage: {
            $multiply: [{ $divide: ["$count", allReviewLength] }, 100],
          },
        },
      },
      {
        $project: {
          _id: 0,
          star: "$_id",
          count: 1,
          percentage: { $round: ["$percentage", 1] }, // Round to 1 decimal place
        },
      },
      {
        $sort: { star: -1 }, // Sort by star rating in descending order
      },
    ]);

    const paginationData = pagination(allReviewLength, limit, page);

    // Response structure
    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Reviews retrieved successfully.",
      data: {
        reviews: allReview,
        stats: {
          totalReviews: reviewStats[0]?.totalReviews || 0,
          averageRating: reviewStats[0]?.averageRating || 0,
          ratingsDistribution,
        },
        pagination: paginationData,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUserReview,
  showRewiewForUser,
};
