const mongoose = require("mongoose");

const userreviewSchema = new mongoose.Schema(
  {
    reviewGiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewRechiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookCar",
      required: true,
    },
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

const UserReview = mongoose.model("UserReview", userreviewSchema);

module.exports = UserReview;
