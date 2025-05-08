const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Recipient's user ID
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  bookingId:{ type: mongoose.Schema.Types.ObjectId, ref: "BookCar", required: false },
 
  title: { type: String, required: true }, // Notification title
  body: { type: String, required: true }, // Notification message
  image: { type: Object, required: false },
  linkId: { type: String, required: false },
  type: { type: String, enum: ["booking", "general","signup","chagepassword","car","payment","rating","userRating"], default: "general" }, // Type of notification
  metadata: { type: mongoose.Schema.Types.Mixed }, // Extra data (e.g., carId, bookingId)
  isRead: { type: Boolean, default: false }, // Read status
 
},{timestamps:true});

module.exports = mongoose.model("Notification", notificationSchema);
