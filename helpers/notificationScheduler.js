const cron = require('node-cron');
const BookCar = require('../app/v1/models/BookCar');
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
        
        // Find unpaid orders where booking start date has passed
        const unpaidOrders = await BookCar.find({
            BookingStatus: { $nin: ['paid', 'cancelled'] },
            bookingStartDate: { $lte: formattedDate }
        });

        console.log(`Found ${unpaidOrders.length} unpaid orders to cancel`);
        
        // Update them to cancelled
        for (const order of unpaidOrders) {
            console.log(`Cancelling order ${order._id}, start date: ${order.bookingStartDate}`);
            await BookCar.findByIdAndUpdate(order._id, {
                BookingStatus: 'cancelled',
                status: 'cancelled'
            });
        }

        console.log(`Cancelled ${unpaidOrders.length} unpaid orders`);
    } catch (error) {
        console.error('Error checking unpaid orders:', error);
    }
});

