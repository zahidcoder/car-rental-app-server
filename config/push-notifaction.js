const Notification = require("../app/v1/models/Notification");
const User = require("../app/v1/models/User");
const admin=require("../config/firebaseConfig")


const sendNotification = async ({ userId, receiverId, bookingId, title, body, image, linkId, type, metadata }) => {
  try {
    // Save the notification in the database
    const notification = await Notification.create({
      userId,
      receiverId,
      bookingId,
      title,
      body,
      image,
      linkId,
      type,
      metadata,
    });

    // Fetch the receiver's FCM token (assuming it's stored in the User model)
    const receiver = await User.findById(receiverId);
    if (receiver && receiver.fcmToken) {
      // Send push notification via FCM
      const message = {
        token: receiver.fcmToken,
        notification: {
          title,
          body,
        },
        data: {
          linkId: linkId || "",
          type: type || "general",
          ...(type === "payment" && bookingId ? { bookingId } : {})

        }, // Optional metadata as data payload
      };

      await admin.messaging().send(message);
    }

    return notification;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

module.exports={
    sendNotification
}