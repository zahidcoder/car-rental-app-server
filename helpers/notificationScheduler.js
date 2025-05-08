// const cron = require('node-cron');
// const BookCar = require('./models/BookCar'); // Adjust path if needed
// const User = require('./models/User'); // Assuming you send notifications via user FCM token
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

const cron = require('node-cron');
const { sendNotification } = require('../config/push-notifaction');
const BookCar = require('../app/v1/models/BookCar');
// const BookCar = require('../models/BookCar');
// const sendNotification = require('../utils/sendNotification');

cron.schedule('0 11,12 * * *', async () => {// Runs every hour at minute 0
  console.log('Checking for bookings that ended...');
  console.log("i am cheking the expaiyery");

  try {
    // const today = new Date().toISOString().split('T')[0]; // e.g., "2025-04-11"

    // const bookings = await BookCar.find({
    //   bookingEndDate: today,
    //   status: 'delivered',
    //   reviewNotificationSent: { $ne: true }, // Optional: avoid duplicate sends
    // }).populate('userId agencyId carId');
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // e.g., '2025-04-11'

    // Format current time as "HHMM" string (e.g., 11:00 AM => "1100")
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHour}${currentMinute}`; // e.g., "1100"

    console.log(`Checking for bookings ending at: ${currentTime}`,currentHour,currentMinute,currentTime,today,now);

    const bookings = await BookCar.find({
        // BookingStatus: "paid",
      bookingEndTime: currentTime, // string match
    //   status: 'delivered',
      reviewNotificationSent: { $ne: true },
    }).populate('userId agencyId carId');

console.log( bookings,"if booking ",currentHour,currentTime);
    for (const booking of bookings) {
      const { userId, agencyId, _id: bookingId, carId } = booking;
      console.log(userId);
      await BookCar.findByIdAndUpdate(bookingId,{BookingStatus:"delivered",status:"delivered"})

    //   // Send to user
    //   await sendNotification({
    //     userId: agencyId,
    //     receiverId: userId,
    //     bookingId,
    //     title: "How was everything?",
    //     body: "It's time to rate your agency.",
    //     type: "rating",
    //     metadata: { carId: carId._id },
    //   });

    //   // Send to agency
    //   await sendNotification({
    //     userId: userId,
    //     receiverId: agencyId,
    //     bookingId,
    //     title: "How was everything?",
    //     body: "It's time to rate your Client.",
    //     type: "userRating",
    //     metadata: { carId: carId._id },
    //   });
    
    // Send notification to the user
    const userNotification = await sendNotification({
        userId: userId, // Sender (Agency)
        receiverId: userId, // User receives this notification
        bookingId,
        title: "How was everything?",
        body: "It's time to rate your agency.",
        type: "rating",
        metadata: { carId: carId._id },
      });
  
      // Send notification to the agency
      const agencyNotification = await sendNotification({
        userId: userId, // Sender (User)
        receiverId: userId, // Agency receives this notification
        bookingId,
        title: "How was everything?",
        body: "It's time to rate your Client.",
        type: "userRating",
        metadata: { carId: carId._id },
      });

      // Optional: mark as notified to avoid sending again
      booking.reviewNotificationSent = true;
      await booking.save();
    }

    console.log(`Finished sending notifications for ${bookings.length} bookings.`);
  } catch (err) {
    console.error("Error sending review notifications:", err);
  }
});

