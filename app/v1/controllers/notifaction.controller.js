const pagination = require("../../../helpers/pagination");
const Response = require("../../../helpers/respones");
const Notification = require("../models/Notification");


const getNotificationsByReceiverId = async (req, res, next) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;

    const receiverId=req.user._id

    if (!receiverId) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "Receiver ID is required.",
      });
    }

    const notificationsLength= await Notification.find({ receiverId }).countDocuments()
    const notifications = await Notification.find({ receiverId })
      .sort({ createdAt: -1 })
    
      .skip((page - 1) * limit)
        .limit(limit);

        
    // Generate pagination data
    const paginationData = pagination(notificationsLength, limit, page);

    res.status(200).json(Response({
      status: "success",
      statusCode: 200,
      message: "Notifications fetched successfully.",
      data: notifications,
      pagination:paginationData
    }));
  } catch (error) {
    next(error);
  }
};

const markNotificationAsRead = async (req, res, next) => {
    try {
      const { notificationId } = req.query;
  
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      );
  
      if (!notification) {
        return res.status(404).json({ message: "Notification not found." });
      }
  
      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Notification marked as read.",
      });
    } catch (error) {
      next(error);
    }
  };
  
  const getNotificationById = async (req, res, next) => {
    try {
      const { notificationId } = req.query;
  
      if (!notificationId) {
        return res.status(400).json({
          status: "error",
          statusCode: 400,
          message: "Notification ID is required.",
        });
      }
  
      // Find the notification by ID
      const notification = await Notification.findById(notificationId);

  
      if (!notification) {
        return res.status(404).json(Response({
          status: "error",
          statusCode: 404,
          message: "Notification not found.",
        }));
      }
      const notificati = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      );
  
      res.status(200).json(Response({
        status: "success",
        statusCode: 200,
        message: "Notification fetched successfully.",
        data: notification,
      }));
    } catch (error) {
      next(error);
    }
  };

  const adminNotifaction=async(req,res,next)=>{
    try {
    const admin=req.user.role

    if(admin!=="admin"){
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "you are not admin.",
      });
    }

    const notifaction=await Notification.find(   {type: { $in: ["payment", "booking"]} })
    .sort({ createdAt: -1 }); // Sort by `createdAt` in descending order
    res.status(200).json(Response({
      status: "success",
      statusCode: 200,
      message: "Notification fetched successfully.",
      data: notifaction,
    }));
      
    } catch (error) {
      next(error)
    }
  }

  const countNotifection=async(req,res,next)=>{
    try {

      const id=req.user._id
      console.log(id);
      const notifactionUnread=await Notification.find({receiverId:id,isRead:false}).countDocuments()
      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Notification count.",
        data: notifactionUnread,
      });
      console.log(notifactionUnread,id);
      
    } catch (error) {
      next(error)
    }
  }

module.exports={
    getNotificationsByReceiverId,
    markNotificationAsRead,
    getNotificationById,
    adminNotifaction,
    countNotifection
}
