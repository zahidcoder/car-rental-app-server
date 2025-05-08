const pagination = require("../../../helpers/pagination");
const Response = require("../../../helpers/respones");
const Car = require("../models/Car");
const Review = require("../models/Review");
const User = require("../models/User");


// create review


const createReview = async (req, res, next) => {
    try {
      const { carId, reviewComment, reviewStar } = req.body;
      const userId = req.user._id; // Assuming user ID is extracted from the authenticated token
  
      // Check for required fields
      if (!carId || !reviewStar) {
        return res.status(400).json(Response({
          status: "error",
          statusCode: 400,
          message: "Car ID and review star are required.",
        }));
      }
  
      // Find the car to retrieve agency ID
      const car = await Car.findById(carId);
      if (!car) {
        return res.status(404).json(Response({
          status: "error",
          statusCode: 404,
          message: "Car not found.",
        }));
      }

        // Check if the user has already reviewed the car
    const existingReview = await Review.findOne({ carId, userId, isDeleted: false });
    if (existingReview) {
      return res.status(400).json(Response({
        status: "error",
        statusCode: 400,
        message: "You have already reviewed this car.",
      }));
    }

  
      // Create the review
      const newReview = new Review({
        userId,
        carId,
        agencyId: car.userId, // Assuming agencyId is stored in the car document's userId field
        reviewComment,
        reviewStar,
      });
  
      await newReview.save();
  
      // Calculate the updated average rating for the agency
      const reviews = await Review.find({ agencyId: car.userId, isDeleted: false });
  
      const totalRating = reviews.reduce((sum, review) => sum + review.reviewStar, 0);
      const averageRating = (totalRating / reviews.length).toFixed(2); // Calculate and format to 2 decimal places
  
      const reviewsCar = await Review.find({ carId:carId, isDeleted: false });

  
      const totalRatingCar = reviewsCar.reduce((sum, review) => sum + review.reviewStar, 0);
      
      const averageRatingCar = (totalRatingCar / reviewsCar.length).toFixed(2); // Calculate and format to 2 decimal places
          console.log(reviewsCar,averageRatingCar);
      // Update the agency's rating
      await User.findByIdAndUpdate(car.userId, { rating: averageRating },{new:true});
      await Car.findByIdAndUpdate(carId, { ratings: averageRatingCar },{new:true});
  
      res.status(200).json(Response({
        status: "success",
        statusCode: 200,
        message: "Review created successfully and agency rating updated.",
        data: newReview,
      }));
    } catch (error) {
      next(error);
    }
  };

  

  // rating show the user withe persentage 
const getReviewsByCarId = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { carId } = req.query; 

    // Check if carId is provided
    if (!carId) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "Car ID is required.",
      });
    }

    // Find all reviews for the specified carId
    const reviewsLength = await Review.find({ carId, isDeleted: false }).countDocuments(); // Exclude soft-deleted reviews
    const reviews = await Review.find({ carId, isDeleted: false }) // Exclude soft-deleted reviews
      .populate("userId") // Populate user details (if needed)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit); // Sort reviews by most recent

 

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        status: "error",
        statusCode: 404,
        message: "No reviews found for this car.",
      });
    }

  
    
  
    const paginationData = pagination(reviewsLength, limit, page);

    res.status(200).json(Response({
      status: "success",
      statusCode: 200,
      message: "Reviews fetched successfully.",
      data:  reviews ,
      pagination: paginationData,
    }));
  } catch (error) {
    next(error);
  }
};
const reviewChartByCarId = async (req, res, next) => {
  try {
   
    const { carId } = req.query; 

    // Check if carId is provided
    if (!carId) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "Car ID is required.",
      });
    }

    // Find all reviews for the specified carId
    const reviewsLength = await Review.find({ carId, isDeleted: false }).countDocuments(); // Exclude soft-deleted reviews
    const reviews = await Review.find({ carId, isDeleted: false }) // Exclude soft-deleted reviews
   
    const car = await Car.findById(carId);

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        status: "error",
        statusCode: 404,
        message: "No reviews found for this car.",
      });
    }

  
    
    const reviewStats = await Review.aggregate([
      {
        $match: {
          carId: car._id, // Match reviews for this car
          isDeleted: false, // Exclude soft-deleted reviews
        },
      },
      {
        $addFields: {
          roundedStar: { $floor: "$reviewStar" }, // Round down the reviewStar to the nearest integer
        },
      },
      {
        $group: {
          _id: "$roundedStar", // Group by rounded star rating
          count: { $sum: 1 }, // Count the number of reviews for each star
        },
      },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: "$count" }, // Calculate total reviews
          stars: {
            $push: {
              star: "$_id",
              count: "$count",
            },
          },
        },
      },
      {
        $unwind: "$stars",
      },
      {
        $addFields: {
          "stars.percentage": {
            $round: [
              {
                $multiply: [
                  { $divide: ["$stars.count", "$totalReviews"] }, // Calculate percentage
                  100,
                ],
              },
              1, // Round to 1 decimal place
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          // totalReviews: { $first: "$totalReviews" },
          ratings: { $push: "$stars" },
        },
      },
      {
        $project: {
          _id: 0,
          totalReviews: 1,
          ratings: 1,
        },
      },
    ]);
    
    const reviewData = {
      totalReviews: reviewsLength,
      averageTotalReview: car.ratings,
      ratingStatus: reviewStats[0] || { totalReviews: 0, ratings: [] }, // Add the percentage of ratings
    };

  

    res.status(200).json(Response({
      status: "success",
      statusCode: 200,
      message: "Reviews fetched successfully.",
      data:  reviewData,
      
    }));
  } catch (error) {
    next(error);
  }
};

// const reviewChartByCarId = async (req, res, next) => {
//   try {
//     const { carId } = req.query;

//     // Check if carId is provided
//     if (!carId) {
//       return res.status(400).json({
//         status: "error",
//         statusCode: 400,
//         message: "Car ID is required.",
//       });
//     }

//     // Check if the car exists
//     const car = await Car.findById(carId);
//     if (!car) {
//       return res.status(404).json({
//         status: "error",
//         statusCode: 404,
//         message: "Car not found.",
//       });
//     }

//     // Find all reviews for the car
//     const reviews = await Review.find({ carId, isDeleted: false });

//     // Initialize rating counts for 1 to 5 stars
//     const ratings = {
//       1: { star: 1, count: 0, percentage: 0 },
//       2: { star: 2, count: 0, percentage: 0 },
//       3: { star: 3, count: 0, percentage: 0 },
//       4: { star: 4, count: 0, percentage: 0 },
//       5: { star: 5, count: 0, percentage: 0 },
//     };

//     // Calculate counts for each star rating
//     reviews.forEach((review) => {
//       const roundedStar = Math.floor(review.reviewStar);
//       if (ratings[roundedStar]) {
//         ratings[roundedStar].count += 1;
//       }
//     });

//     // Calculate total reviews
//     const totalReviews = reviews.length;

//     // Calculate percentages for each star rating
//     if (totalReviews > 0) {
//       Object.keys(ratings).forEach((star) => {
//         ratings[star].percentage = ((ratings[star].count / totalReviews) * 100).toFixed(1);
//       });
//     }

//     // Convert ratings object to array for response
//     const ratingStats = Object.values(ratings);

//     // Prepare response data
//     const reviewData = {
//       totalReviews,
//       averageTotalReview: car.ratings || 0,
//       ratingStats,
//     };

//     res.status(200).json({
//       status: "success",
//       statusCode: 200,
//       message: "Review chart fetched successfully.",
//       data: reviewData,
//     });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };






  

module.exports={
    createReview,
    getReviewsByCarId,
    reviewChartByCarId
}