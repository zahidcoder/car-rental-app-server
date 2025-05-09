const mongoose = require("mongoose");

// Define the location schema
const bookCarSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driverPickupLocation: {
      type: {
        type: String, // This will always be 'Point' for GeoJSON data
        enum: ["Point"], // Only allow 'Point' as type
        required: false,
        default: "Point",
      },
      coordinates: {
        type: [Number], // Array of numbers: [longitude, latitude]
        required: false,
        default: [0, 0], // Default to [longitude, latitude]
      },
    },
    pickupFromAgency: { type: Boolean, default: false },
    isBookingAceptedByAgency: { type: Boolean, default: false },
    // bookingStart:{type:String, required:true},
    // bookingEnd:{type:String, required:true},
    isSuperior: { type: Boolean, required: true },
    isWifi: { type: Boolean, required: false, default: false },
    bosterSeat: { type: String, required: false, default: "0" },
    orderAmount: { type: String, required: true },
    dueAmount: { type: String, required: false },
    payableAmount: { type: String, required: false },

    bookingStartDate: { type: String, required: true },
    bookingEndDate: { type: String, required: true },
    bookingStartTime: { type: String, required: true },
    bookingEndTime: { type: String, required: true },
    //   uplodLicence:{type:Object,required:false},
    transectionId: { type: String, default: null },
    isdriverAccept: { type: String, required: false },
    isCarReturned: { type: String, default: false },
    totalDiscount:{type:Number,required:false,default:0},


    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      required: false,
    },
    status: {
      type: String,
      enum: [
        "inprogress",
        "newOrder",
        "accept",
        "paid",
        "ongoing",
        "delivered",
        "cancelled",
        "returnCar",
        "assigneDriver",
      ],
      default: "newOrder",
    },
    BookingStatus: {
      type: String,
      enum: [
        "inprogress",
        "ongoing",
        "accept",
        "paid",
        "newOrder",
        "delivered",
        "returnCar",
        "cancelled",
      ],
      default: "newOrder",
    },
    driverStatus: {
      type: String,
      enum: [
        "inprogress",
        "delivered",
        "accept",
        "cancelled",
        "newOrder",
        "arrivedinAgency",
        "returnCar",
        "arrivedToUser",
      ],
      default: "newOrder",
    },
    driverDeliveryStatuse: {
      type: String,
      enum: [
        "ontheWayToPicup",
        "arriveStore",
        "carPicked",
        "onthewaytoDeliver",
        "arrivedAttlocation",
        "arrivedinAgency",
        "arrivedToUser",
        "track",
      ],
      default: null,
    },
    reviewNotificationSent: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

bookCarSchema.index({ driverPickupLocation: "2dsphere" });

const BookCar = mongoose.model("BookCar", bookCarSchema);
module.exports = BookCar;
