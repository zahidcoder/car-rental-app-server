
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Recipient's user ID
 
  bookingId:{ type: mongoose.Schema.Types.ObjectId, ref: "BookCar", required: true },
 
 transactionId:{type:String,required:true},
 amount:{type:Number,required:true}

},{timestamps:true});

module.exports = mongoose.model("Payment", paymentSchema);
