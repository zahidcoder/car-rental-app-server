// const  mongoose = require("mongoose");


// const reviewSchema=new mongoose.Schema({
//     userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
//     carId:{type:mongoose.Schema.Types.ObjectId,ref:"Car",required:true}, 
//     reviewComment:{type:String,required:false},
//     reviewStar:{type:String,required:false},


// },{timestamps:true})

// const Review = mongoose.model('Review', reviewSchema);
// module.exports = Review;

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    reviewComment: { type: String, trim: true, required: false },
    reviewStar: { type: Number, min: 1.0, max: 5.0, required: true }, // Ensure it's a valid star rating
   
    isDeleted: { type: Boolean, default: false }, // Optional soft delete
    replies: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ], // Optional replies field
  },
  { timestamps: true }
);


const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
