console.log('🚀 =================================');
console.log('🚀 NOTIFICATION SCHEDULER LOADING...');
console.log('🚀 Time:', new Date().toISOString());
console.log('🚀 =================================');


const cron = require('node-cron');
const BookCar = require('../app/v1/models/BookCar');
const Payment = require('../app/v1/models/Payment');
const { sendNotification } = require('../config/push-notifaction');

// const User = require('./models/User');
// const sendNotification = require('./utils/sendNotification'); // Your existing FCM sender

// // Run every day at 11:00 AM
// cron.schedule('0 11 * * *', async () => {
//   try {
//     const today = new Date().toISOString().split('T')[0]; // e.g., '2025-04-11'

//     const bookings = await BookCar.find({ 
//       bookingEndDate: today 
//     }).populate('userId'); // Get user info (token, etc.)

//     for (const booking of bookings) {
//       const user = booking.userId;

//       // Only send if booking is not already marked as 'reviewNotified' (optional logic)
//       // And status is delivered or returnCar or similar
//       if (user && user.fcmToken) {
//         await sendNotification({
//           token: user.fcmToken,
//           title: 'Rate Your Experience',
//           body: 'Your trip has ended. Please leave a review for your ride.',
//         });

//         console.log(`Sent review notification to user: ${user._id}`);
        
//         // Optional: mark as notified to avoid repeat sending
//         // booking.reviewNotificationSent = true;
//         // await booking.save();
//       }
//     }

//   } catch (err) {
//     console.error('Failed to send review notifications:', err);
//   }
// });

// cron.schedule('0 11,12 * * *', async () => {
//   console.log('Checking for bookings that ended...');

//   try {
//     const now = new Date();
//     const currentHour = now.getHours().toString().padStart(2, '0');
//     const currentMinute = now.getMinutes().toString().padStart(2, '0');
//     const currentTime = `${currentHour}${currentMinute}`;

//     // Query only unnotified bookings
//     const bookings = await BookCar.find({
//       bookingEndTime: currentTime,
//       reviewNotificationSent: false,
//       BookingStatus: "paid"
//     }).populate('userId agencyId carId');

//     console.log(`Found ${bookings.length} unnotified bookings to process`);

//     for (const booking of bookings) {
//       const { userId, agencyId, _id: bookingId, carId } = booking;

//       // Update booking status
//       await BookCar.findByIdAndUpdate(bookingId, {
//         BookingStatus: "delivered",
//         status: "delivered",
//         reviewNotificationSent: true
//       });

//       // Send notifications
//       await sendNotification({
//         userId: userId._id,
//         receiverId: userId._id,
//         bookingId,
//         title: "How was everything?",
//         body: "It's time to rate your agency.",
//         type: "rating",
//         metadata: { carId: carId._id }
//       });

//       await sendNotification({
//         userId: userId._id,
//         receiverId: userId._id,
//         bookingId,
//         title: "How was everything?",
//         body: "It's time to rate your client.",
//         type: "userRating",
//         metadata: { carId: carId._id }
//       });
//     }

//     console.log(`Successfully processed ${bookings.length} bookings`);
//   } catch (err) {
//     console.error("Error sending review notifications:", err);
//   }
// });

// Second cron job - unpaid orders
cron.schedule('0 0 * * *', async () => {
    console.log('Checking for unpaid orders...');

    try {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        console.log(`Current date for comparison: ${formattedDate}`);

        const paidBookingIds = await Payment.distinct('bookingId');

        await BookCar.updateMany(
            {
                bookingStartDate: { $lte: formattedDate },
                _id: { $nin: paidBookingIds }
            },
            {
                $set: { BookingStatus: 'cancelled', status: 'cancelled' }
            }
        );

        // Mark paid bookings as ongoing on start date
        await BookCar.updateMany(
            {
                bookingStartDate: { $lte: formattedDate },
                _id: { $in: paidBookingIds },
                BookingStatus: { $ne: 'ongoing' }
            },
            {
                $set: { BookingStatus: 'ongoing', status: 'ongoing' }
            }
        );

        console.log(`Unpaid orders cancelled and paid bookings marked as ongoing if applicable.`);
    } catch (error) {
        console.error('Error checking unpaid orders:', error);
    }
});

cron.schedule('* * * * *', async () => {
    console.log('Checking for paid bookings to mark as delivered...');

    try {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        console.log(`Current date for comparison: ${formattedDate}`);

        const paidBookingIds = await Payment.distinct('bookingId');

        // Find bookings to be marked as delivered
        const bookingsToDeliver = await BookCar.find({
            _id: { $in: paidBookingIds },
            bookingEndDate: { $lte: formattedDate },
            BookingStatus: { $ne: 'delivered' }
        }).populate('userId agencyId carId');

        // Mark as delivered
        const result = await BookCar.updateMany(
            {
                _id: { $in: paidBookingIds },
                bookingEndDate: { $lte: formattedDate },
                BookingStatus: { $ne: 'delivered' }
            },
            {
                $set: { BookingStatus: 'delivered', status: 'delivered' }
            }
        );

        // Send notification to user and agency for each delivered booking
        for (const booking of bookingsToDeliver) {
            await sendNotification({
                userId: booking.agencyId._id || booking.agencyId,
                receiverId: booking.userId._id || booking.userId,
                bookingId: booking._id,
                title: "How was everything?",
                body: "It's time to rate your agency.",
                type: "rating",
                metadata: { carId: booking.carId._id || booking.carId }
            });

            // Send notification to agency
            await sendNotification({
                userId: booking.userId._id || booking.userId,
                receiverId: booking.agencyId._id || booking.agencyId,
                bookingId: booking._id,
                title: "How was everything?",
                body: "It's time to rate your Client.",
                type: "userRating",
                metadata: { carId: booking.carId._id || booking.carId }
            });
        }

        console.log(`Marked ${result.modifiedCount} paid bookings as delivered if end date has arrived.`);
    } catch (error) {
        console.error('Error marking bookings as delivered:', error);
    }
});

