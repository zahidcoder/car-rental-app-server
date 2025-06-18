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

cron.schedule('* * * * *', async () => { // Every minute for testing
    console.log('🔍 TEST: Checking for paid bookings to mark as delivered...');
    
    try {
        const today = new Date();
        today.setDate(today.getDate() + 1); // Use tomorrow (19th) for testing
        const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        
        console.log('🗓️ Testing with date:', formattedDate); // Should show 2025-6-19
        
        const paidBookingIds = await Payment.distinct('bookingId');
        console.log('💳 Total paid bookings:', paidBookingIds.length);

        const bookingsToDeliver = await BookCar.find({
            _id: { $in: paidBookingIds },
            bookingEndDate: { $lte: formattedDate },
            BookingStatus: { $ne: 'delivered' }
        }).populate('userId agencyId carId');

        console.log(`📦 Found ${bookingsToDeliver.length} bookings ending on/before ${formattedDate}`);

        if (bookingsToDeliver.length > 0) {
            console.log('Details:', bookingsToDeliver.map(b => ({
                id: b._id,
                endDate: b.bookingEndDate,
                status: b.BookingStatus
            })));

            for (const booking of bookingsToDeliver) {
                await BookCar.findByIdAndUpdate(booking._id, {
                    BookingStatus: 'delivered'
                });
                console.log(`✅ Marked booking ${booking._id} as delivered`);

                await sendNotification({
                    userId: booking.agencyId._id || booking.agencyId,
                    receiverId: booking.userId._id || booking.userId,
                    bookingId: booking._id,
                    title: "How was everything?",
                    body: "It's time to rate your agency.",
                    type: "rating"
                });
                console.log(`🔔 Notification sent for booking ${booking._id}`);
            }
        }

    } catch (error) {
        console.error('❌ Test cron error:', error);
    }
});

