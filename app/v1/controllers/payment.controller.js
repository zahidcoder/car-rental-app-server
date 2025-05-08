const { sendNotification } = require("../../../config/push-notifaction");
const BookCar = require("../models/BookCar");
const Car = require("../models/Car");
const Payment = require("../models/Payment");


const createPayment = async (req, res, next) => {
    try {
        const userId=req.user._id
        const {  bookingId, transactionId, amount } = req.body;
        const formattedAmount = parseFloat(amount).toFixed(2);

      

        // Validate required fields
        if ( !bookingId || !transactionId || !amount) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Missing required fields: userId, bookingId, transactionId, or amount.',
            });
        }

        // Create a new payment record
        const newPayment = await Payment.create({
            userId,
            bookingId,
            transactionId,
            amount:formattedAmount,
        });

        const agency=await BookCar.findById(bookingId)
        console.log(agency,"booking all the information");

        await BookCar.findByIdAndUpdate(bookingId,{transectionId:transactionId,status:"paid",BookingStatus:"paid"},{new:true})
        const dataNotifaction=  await sendNotification({
            userId:userId, // Optional sender
            receiverId: agency.agencyId,
            bookingId: bookingId,
            title: "Payment succesfully",
            body: `User paid for the rent has been accepted.`,
            type: "payment",
            metadata: { carId: agency.carId._id },
          });
 
        //   await Car.findByIdAndUpdate(
        //     agency.carId._id, // carId should be the first argument
        //     {
        //       isRent: true,
        //       bookedDates: agency.bookingEndDate,
        //     },
        //     { new: true } // This option ensures that the updated document is returned
        //   );

         // Update car availability
    const car = await Car.findById(agency.carId._id);
    if (car) {
      const updatedBookedDates = [
        ...car.bookedDates,
        {
          startDate: agency.bookingStartDate,
          endDate: agency.bookingEndDate,
          startTime: agency.inputStartTime,
          endTime: agency.inputEndTime,
        },
      ];

      await Car.findByIdAndUpdate(
        agency.carId._id,
        {
          isRent: true,
          bookedDates: updatedBookedDates,
        },
        { new: true }
      );
    }

        res.status(200).json({
            status: 'success',
            statusCode: 200           ,
            message: 'Payment record created successfully.',
            data: newPayment,
        });
    } catch (error) {
        next(error); // Pass the error to the global error handler
    }
};

module.exports = { createPayment };
