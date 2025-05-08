const { connectToDatabase } = require('../../../config/database');
const { calculateDistance } = require('../../../helpers/calculation');
const BookCar = require('../models/BookCar');
const ChatRoom = require('../models/ChatRoom');
const Location = require('../models/Location');
const Message = require('../models/Message');
const User = require('../models/User');



connectToDatabase();

const socketIO = (io) => {
    console.log("Socket server is listening...");

    // Map to track active users
    const activeUsers = new Map();

    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        // // User joins a specific chat room
        socket.on('joinRoom', ({ userId, chatRoomId }) => {
            console.log(`User ${userId} joined room ${chatRoomId}`);
            activeUsers.set(userId, socket.id); // Save userId -> socketId mapping
            socket.join(chatRoomId); // Join the specified chat room
        });

    
        

        socket.on('sendMessage', async (data, ack) => {
            try {
                // Parse the incoming data
                const { senderId, chatRoomId, message, messageType } = data;
        
                // Validate required fields
                if (!senderId || !chatRoomId || !message) {
                    throw new Error('Missing required fields: chatRoomId, message, or senderId.');
                }
        
                // Validate that the sender exists
                const sender = await User.findById(senderId, 'name email role image'); // Only fetch necessary fields
                if (!sender) {
                    throw new Error('Sender not found');
                }
        
                // Validate that the chat room exists
                const chatRoom = await ChatRoom.findById(chatRoomId);
                if (!chatRoom) {
                    throw new Error('Chat room not found');
                }
        
                // Create the new message
                const newMessage = await Message.create({
                    chatRoom: chatRoomId,
                    sender: senderId,
                    message,
                    messageType: messageType || 'text', // Default to 'text'
                    isSeen:false
                });
        
                // Update the chat room's lastMessage and updatedAt fields
                await ChatRoom.findByIdAndUpdate(
                    chatRoomId,
                    { lastMessage: newMessage._id, updatedAt: Date.now() },
                    { new: true }
                );
        
                // Format the response to match the desired structure
                const responseMessage = {
                    _id: newMessage._id,
                    chatRoom: newMessage.chatRoom,
                    sender: {
                        _id: sender._id,
                        name: sender.name,
                        email: sender.email,
                        role: sender.role,
                        image: sender.image, // Assuming 'image' is already an object with necessary properties
                    },
                    message: newMessage.message,
                    messageType: newMessage.messageType,
                    createdAt: newMessage.createdAt,
                    updatedAt: newMessage.updatedAt,
                    __v: newMessage.__v,
                };
        
                // Emit the new message to the chat room
                const messageEvent = `newMessage::${chatRoomId}`;
                io.emit(messageEvent, { success: true, data: {attributes:[responseMessage]} });
                console.log("this is message docket------------------",);
                
        
        //          // Emit unseen message count to all chat room participants
        // chatRoom.participants.forEach(async (participantId) => {
        //     const unseenMessages = await Message.countDocuments({
        //         chatRoom: chatRoomId,
        //         isSeen: false
        //     });

        //     io.emit(`messageStackUpdate::${participantId}`, {
        //         success: true,
        //         unseenMessages
        //     });

        //     console.log(`Emitted messageStackUpdate::${participantId} with ${unseenMessages} unseen messages`);
        // });
        
        // Emit unseen message count to all chat room participants, excluding the sender
        chatRoom.participants.forEach(async (participantId) => {
            if (participantId.toString() !== senderId) { // Exclude the sender
                const unseenMessages = await Message.countDocuments({
                    chatRoom: chatRoomId,
                    isSeen: false,
                    sender: { $ne: participantId } // Exclude the sender's own messages
                });

                io.emit(`messageStackUpdate::${participantId}`, {
                    success: true,
                    unseenMessages
                });

                console.log(`Emitted messageStackUpdate::${participantId} with ${unseenMessages} unseen messages`);
            }
        });
                // Send acknowledgment if provided
                if (ack) { 
                    ack({ success: true, data: {attributes:[responseMessage]} });
                }
               
            } catch (error) {
                console.error('Error handling sendMessage:', error.message);
        
                // Send error response via acknowledgment if available
                if (ack) {
                    ack({ success: false, error: error.message });
                }
        
                // Emit an error event if acknowledgment is not provided
                socket.emit('error', { message: 'Failed to send message.', error: error.message });
            }
        });



        // // message for the show is not read
        // //-----------------------------------------------------------
        // socket.io('messageStack',async(data,ack)=>{
        //     const {id}=data

        //     const lastMessage=await ChatRoom.find()
        // })


        // socket.on('messageStack', async (data, ack) => {
        //     try {
        //         const { userId } = data; // Participant ID
        
        //         // Find chat rooms where the user is a participant
        //         const chatRooms = await ChatRoom.find({ participants: userId })
        //             .populate('participants', 'name email')
        //             .populate('lastMessage');
        
        //         if (chatRooms.length==[]) {
        //             return ({ success: true, isSeen: 'seen' });
        //         }
        
        //         // Format the response for each chat room
        //         const formattedChatRooms = chatRooms.map(chatRoom => {
        //             const isLastMessageSeen = chatRoom.lastMessage?.isSeen || false;
        
        //             return {
        //                 // chatRoomId: chatRoom._id,
        //                 // participants: chatRoom.participants,
                       
                        
        //                     isSeen: isLastMessageSeen ? 'Seen' : 'NotSeen'}
                      
        //         });
        
        //         // Send acknowledgment response with multiple chat rooms
        //         ack({ success: true, chatRooms: formattedChatRooms });
        
              
        //         // Emit message only to the specific user's socket
        //         const messageEvent = `messageStackUpdate::${userId}`;
        //         io.emit(messageEvent, { success: true, data: formattedChatRooms });
        
        //         console.log(messageEvent,"this is message event stack=======================--------------------------");
        //     } catch (error) {
        //         console.error('Error fetching chat by participant:', error);
        //         ack({ success: false, message: 'Server error' });
        //     }
        // });

        // socket.on('messageStack', async (data, ack) => {
        //     try {
        //         const { userId } = data; // Extract participant ID
        
        //         // Find all chat rooms where this user is a participant
        //         const chatRooms = await ChatRoom.find({ participants: userId })
        //             .populate('participants', 'name email')
        //             .populate('lastMessage');
        
        //         // If no chat rooms are found, return a response
        //         if (chatRooms.length === 0) {
        //             return ack({ success: true, message: 'No chat rooms found', isSeen: 'seen' });
        //         }
        
        //         // Extract chat room IDs from the fetched chat rooms
        //         const chatRoomIds = chatRooms.map(room => room._id);
        
        //         // Find the count of unseen messages
        //         const unseenMessageCount = await Message.countDocuments({
        //             chatRoom: { $in: chatRoomIds }, // Use $in to match multiple chat rooms
        //             isSeen: false,
        //         });
        
        //         // Acknowledge the response with chat room details and unseen messages
        //         ack({
        //             success: true,
        //             chatRooms: chatRooms,
        //             unseenMessages: unseenMessageCount,
        //         });
        
        //         // Emit unseen message count only to the requesting user
        //         const messageEvent = `messageStackUpdate::${userId}`;
        //         socket.to(userId).emit(messageEvent, {
        //             success: true,
        //             unseenMessages: unseenMessageCount,
        //         });
        
        //         console.log(`${messageEvent} event emitted for unseen messages (${unseenMessageCount})`);
        
        //     } catch (error) {
        //         console.error('Error in messageStack:', error);
        //         ack({ success: false, message: 'Server error' });
        //     }
        // });

        // Handle unread messages
        // socket.on('messageStack', async (data, ack) => {
        //     try {
        //         const { userId } = data;

        //         const chatRooms = await ChatRoom.find({ participants: userId })
        //             .populate('participants', 'name email')
        //             .populate('lastMessage');

        //         if (chatRooms.length === 0) {
        //             return ack({ success: true, message: 'No chat rooms found', isSeen: 'seen' });
        //         }

        //         const chatRoomIds = chatRooms.map(room => room._id);
        //         const unseenMessageCount = await Message.countDocuments({
        //             chatRoom: { $in: chatRoomIds },
        //             isSeen: false,
        //         });

        //         ack({ success: true, chatRooms, unseenMessages: unseenMessageCount });

        //         socket.to(userId).emit(`messageStackUpdate::${userId}`, {
        //             success: true,
        //             unseenMessages: unseenMessageCount
        //         });

        //         console.log(`messageStackUpdate::${userId} event emitted for unseen messages (${unseenMessageCount})`);

        //     } catch (error) {
        //         console.error('Error in messageStack:', error);
        //         ack({ success: false, message: 'Server error' });
        //     }
        // });








        // socket.on('messageStack', async (data, ack) => {
        //     try {
        //         const { userId } = data;
        
        //         const chatRooms = await ChatRoom.find({ participants: userId })
        //             .populate('participants', 'name email')
        //             .populate('lastMessage');
        
        //         if (chatRooms.length === 0) {
        //             return ack({ success: true, message: 'No chat rooms found', isSeen: 'seen' });
        //         }
        
        //         const chatRoomIds = chatRooms.map(room => room._id);
        
        //         const unseenMessageCount = await Message.countDocuments({
        //             chatRoom: { $in: chatRoomIds },
        //             isSeen: false,
        //         });
        
        //         ack({
        //             success: true,
        //             chatRooms,
        //             unseenMessages: unseenMessageCount,
        //         });
        
        //         console.log(`Sent unseen message count (${unseenMessageCount}) to ${userId}`);
        
        //     } catch (error) {
        //         console.error('Error in messageStack:', error);
        //         ack({ success: false, message: 'Server error' });
        //     }
        // });
        
        socket.on('messageStack', async (data, ack) => {
            try {
                const { userId } = data;
            
                // Find chat rooms that the user is a participant of
                const chatRooms = await ChatRoom.find({ participants: userId })
                    .populate('participants', 'name email')
                    .populate('lastMessage');
            
                if (chatRooms.length === 0) {
                    return ack({ success: true, message: 'No chat rooms found', isSeen: 'seen' });
                }
            
                // Get the list of chat room IDs
                const chatRoomIds = chatRooms.map(room => room._id);
            
                // Count unseen messages from other participants, excluding the sender's own messages
                const unseenMessageCount = await Message.countDocuments({
                    chatRoom: { $in: chatRoomIds },
                    isSeen: false,
                    sender: { $ne: userId }, // Exclude the sender's own messages
                });
            
                // Send the result to the client
                ack({
                    success: true,
                    chatRooms,
                    unseenMessages: unseenMessageCount,
                });
            
                console.log(`Sent unseen message count (${unseenMessageCount}) to ${userId}`);
            
            } catch (error) {
                console.error('Error in messageStack:', error);
                ack({ success: false, message: 'Server error' });
            }
        });
        
      
        // socket.on('messageStack', async (data, ack) => {
        //     try {
        //         const { userId } = data; // Participant ID
        
        //         const chatRooms = await ChatRoom.find({ participants: userId })
        //             .populate('participants', 'name email')
        //             .populate('lastMessage');
        
        //         if (chatRooms.length === 0) {
        //             return ack({ success: true, isSeen: 'seen' });
        //         }
        
        //         // // Format the response for each chat room
        //         // const formattedChatRooms = chatRooms.map(chatRoom => {
        //         //     const isLastMessageSeen = chatRoom.lastMessage?.isSeen || false;
        //         //     return {
        //         //         chatRoomId: chatRoom._id,
        //         //         isSeen: isLastMessageSeen ? 'Seen' : 'NotSeen',
        //         //     };
        //         // });

        //         const message=await Message.find({chatRoom:chatRooms,isSeen:false}).countDocuments()
        
              
        //         // Acknowledge response
        //         ack({ success: true, chatRooms: chatRooms });
        
        //         // Emit unseen message notifications to user
        //         const messageEvent = `messageStackUpdate::${userId}`;
        //         io.emit(messageEvent, { success: true, data: message });
        
        //         console.log(`${messageEvent} event emitted for unseen messages`);
        //     } catch (error) {
        //         console.error('Error in messageStack:', error);
        //         ack({ success: false, message: 'Server error' });
        //     }
        // });
        
    
        socket.on('locationUpdate', async (data, ack) => {
            try {
                const { bookingId, latitude, longitude } = data;
        
                // Validate input
                if (!bookingId || !latitude || !longitude) {
                    return ack({
                        status: "error",
                        message: "Booking ID, latitude, and longitude are required.",
                    });
                }
        
                // Find the booking and the agency details
                const book = await BookCar.findById(bookingId);
                if (!book) {
                    return ack({
                        status: "error",
                        message: "Booking not found.",
                    });
                }
        
                const agency = await User.findById(book.agencyId);
                if (!agency) {
                    return ack({
                        status: "error",
                        message: "Agency not found.",
                    });
                }
        
                const driverId = book.driverId;
                if (!driverId) {
                    return ack({
                        status: "error",
                        message: "Driver ID not found in booking.",
                    });
                }
        
                // Parse coordinates
                const driverCoordinates = [parseFloat(longitude), parseFloat(latitude)];
                const agencyCoordinates = agency.currentLocation.coordinates;
                const userCoordinates = book.driverPickupLocation.coordinates;
        
                if (driverCoordinates.some(coord => isNaN(coord))) {
                    return ack({
                        status: "error",
                        message: "Invalid latitude or longitude values.",
                    });
                }
        
                // Update driver's location in the Location model
                const driverLocation = await Location.findOneAndUpdate(
                    { userId: driverId },
                    {
                        location: {
                            type: "Point",
                            coordinates: driverCoordinates,
                        },
                    },
                    { new: true, upsert: true }
                );
        
                // Update the driver's location in the User model
                const updatedDriver = await User.findByIdAndUpdate(
                    driverId,
                    {
                        currentLocation: {
                            type: "Point",
                            coordinates: driverCoordinates,
                        },
                    },
                    { new: true }
                );
        
                // Calculate distance between driver and agency/user locations
                const distanceToAgency = calculateDistance(driverCoordinates, agencyCoordinates);
                const distanceToUser = calculateDistance(driverCoordinates, userCoordinates);
        
                // Transition `driverDeliveryStatuse` based on distances and current status
                let newStatus = book.driverDeliveryStatuse;
        
                if (newStatus === "ontheWayToPicup") {
                    // If driver is near the agency (1 meter)
                    if (distanceToAgency <= 50) {
                        newStatus = "arriveStore";
                    }
                } else if (newStatus === "carPicked") {
                    // If driver starts towards the user's location
                    newStatus = "onthewaytoDeliver";
                } else if (newStatus === "onthewaytoDeliver") {
                    // If driver is near the user's location (5 meters)
                    if (distanceToUser <= 50) {
                        newStatus = "arrivedToUser";
                        book.BookingStatus = "delivered";
                        book.status = "delivered";
                        book.driverStatus = "delivered";
                    }
                }
        
                // Save the updated status
                book.driverDeliveryStatuse = newStatus;
                await book.save();
        
                // Acknowledge the update
                ack({
                    status: "success",
                    message: "Driver location updated and status transitioned successfully.",
                    data: {
                        driverlocation: driverLocation,
                        user: updatedDriver,
                        book,
                        agencyLocation:agency,
                        distanceToAgency,
                        distanceToUser,
                    },
                });
        
                // Use `io.emit` with a dynamic event scoped to the booking ID
                const eventName = `driverLocationUpdated::${bookingId}`;
                io.emit(eventName, {
                    data: {
                        driverlocation: driverLocation,
                        user: updatedDriver,
                        book,
                        agencyLocation:agency,
                        distanceToAgency,
                        distanceToUser,
                    },
                });
                console.log(eventName,"envet name");
            } catch (error) {
                console.error("Error updating driver location:", error);
                ack({
                    status: "error",
                    message: "An error occurred while updating driver location.",
                });
            }
        });
        

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            for (let [userId, socketId] of activeUsers.entries()) {
                if (socketId === socket.id) {
                    activeUsers.delete(userId); // Remove from active users
                    break;
                }
            }
        });
    });
};

module.exports = socketIO;
