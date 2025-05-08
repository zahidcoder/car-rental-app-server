const pagination = require("../../../helpers/pagination");
const Response = require("../../../helpers/respones");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const User = require("../models/User");


// // Create a new chat room
// const createChatRoom = async (req, res, next) => {
//     try {
//         const cahtMaker=req.user?._id
//         const { participant } = req.body;
//         const participants={participant,cahtMaker}

//         // Ensure participants array is provided and has at least two participants
//         if (!participants || participants.length !== 2) {
//             return res
//                 .status(400)
//                 .json(
//                     Response({
//                         status: "Failed",
//                         statusCode: 400,
//                         message: "Exactly two participants are required to create a chat room.",
//                     })
//                 );
//         }

//         // Check if the chat room between the same two participants already exists
//         const existingChatRoom = await ChatRoom.findOne({
//             participants: { $all: participants, $size: 2 },
//         });

//         if (existingChatRoom) {
//             return res
//                 .status(400)
//                 .json(
//                     Response({
//                         status: "Failed",
//                         statusCode: 400,
//                         message: "Chat room between these participants already exists.",
//                         data: existingChatRoom,
//                     })
//                 );
//         }

//         // Create a new chat room
//         const chatRoom = new ChatRoom({ participants });
//         await chatRoom.save();

//         // Success response
//         res
//             .status(200)
//             .json(
//                 Response({
//                     status: "success",
//                     statusCode: 200,
//                     message: "Chat room created successfully.",
//                     data: chatRoom,
//                 })
//             );
//     } catch (error) {
//         next(error);
//     }
// };




// Create a chat room (single or group)
// const createChatRoom = async (req, res,next) => {
//     try {
//         const { participantIds, type = 'single', groupName, description } = req.body;
//         const loggedInUserId = req.user._id;  // Logged-in user ID (from authentication middleware)

//         console.log(loggedInUserId,participantIds,"sdpjfolsdjflksdj");
//         // Handle validation for group and single chat types
//         if (type === 'group') {
//             // For group chat, participantIds should be an array of user IDs, including the creator
//             if (!Array.isArray(participantIds) || participantIds.length < 2) {
//                 return res.status(400).json(Response({status:"error",statusCode:400, message: 'Group chat must have at least two participants.' }));
//             }

//             // Add the logged-in user as the creator
//             if (!participantIds.includes(loggedInUserId)) {
//                 participantIds.push(loggedInUserId);
//             }

//             // Ensure the group has a name (for group chats)
//             if (!groupName || groupName.trim() === '') {
//                 return res.status(400).json({ message: 'Group chat must have a group name.' });
//             }

//       // Check if a group with the same participants and name already exists
//       const existingGroupChat = await ChatRoom.findOne({
//         type: 'group',
//         groupName,
//         participants: { $all: participantIds, $size: participantIds.length },
//       });

//       if (existingGroupChat) {
//         return res.status(400).json({
//           status: "error",
//           statusCode: 400,
//           message: 'A group chat with these participants and name already exists.',
//         });
//       }
//         } else {
//             // For single chat, participantIds should be a single user ID
//             if (!participantIds || participantIds.length !== 1 || participantIds[0].toString() === loggedInUserId.toString()) {
//                 return res.status(400).json(Response({status:"error",statusCode:400,message: 'For single chat, select another user to chat with.' }));
//             }

//             // Add the logged-in user as the creator
//             participantIds.push(loggedInUserId);
//         }
//          // Add the logged-in user as the creator
//       participantIds.push(loggedInUserId);

//       // Check if a single chat with the same participants already exists
//       const existingSingleChat = await ChatRoom.findOne({
//         type: 'single',
//         participants: { $all: participantIds, $size: participantIds.length },
//       });

//       if (existingSingleChat) {
//         return res.status(400).json({
//           status: "error",
//           statusCode: 400,
//           message: 'A single chat with this user already exists.',
//           data:existingSingleChat
//         });
//       }
    

//         // Create the new chat room
//         const newChatRoom = new ChatRoom({
//             participants: participantIds,
//             chatCreator: loggedInUserId,
//             type,
//             groupName: type === 'group' ? groupName : '',
//             description: type === 'group' ? description : '',
//         });

//         await newChatRoom.save();

//         // Optionally create an initial message
//         const initialMessage = new Message({
//             chatRoom: newChatRoom._id,
//             sender: loggedInUserId,
//             message: type === 'group' ? 'Welcome to the group!' : 'Hello!',
//         });

//         await initialMessage.save();

//         // Update the chat room with the last message reference
//         newChatRoom.lastMessage = initialMessage._id;
//         await newChatRoom.save();

//         // Populate lastMessage and return the chat room
//         const chatRoomWithLastMessage = await ChatRoom.findById(newChatRoom._id)
//             .populate('lastMessage')
//             .exec();

//         return res.status(201).json({
//             message: 'Chat room created successfully!',
//             chatRoom: chatRoomWithLastMessage,
//         });
//     } catch (error) {
//         next(error)
//     }
// };

const createChatRoom = async (req, res, next) => {
    try {
      const { participantIds, type = 'single', groupName, description } = req.body;
      const loggedInUserId = req.user._id; // Logged-in user ID (from authentication middleware)
  
      console.log(loggedInUserId, participantIds, "Debug Info");
  
      if (type === 'group') {
        // For group chat, participantIds should be an array of user IDs, including the creator
        if (!Array.isArray(participantIds) || participantIds.length < 2) {
          return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: 'Group chat must have at least two participants.',
          });
        }
  
        // Add the logged-in user as the creator
        if (!participantIds.includes(loggedInUserId)) {
          participantIds.push(loggedInUserId);
        }
  
        // Ensure the group has a name (for group chats)
        if (!groupName || groupName.trim() === '') {
          return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: 'Group chat must have a group name.',
          });
        }
  
        // Check if a group with the same participants and name already exists
        const existingGroupChat = await ChatRoom.findOne({
          type: 'group',
          groupName,
          participants: { $all: participantIds, $size: participantIds.length },
        });
  
        if (existingGroupChat) {
          return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: 'A group chat with these participants and name already exists.',
            chatRoom:existingGroupChat
          });
        }
      } else {
        // For single chat, participantIds should be a single user ID
        if (!participantIds || participantIds.length !== 1 || participantIds[0].toString() === loggedInUserId.toString()) {
          return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: 'For single chat, select another user to chat with.',
          });
        }
  
        // Add the logged-in user as the creator
        participantIds.push(loggedInUserId);
  
        // Check if a single chat with the same participants already exists
        const existingSingleChat = await ChatRoom.findOne({
          type: 'single',
          participants: { $all: participantIds, $size: participantIds.length },
        });
  
        if (existingSingleChat) {
          return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: 'A single chat with this user already exists.',
            chatRoom:existingSingleChat

          });
        }
      }
  
      // Create the new chat room
      const newChatRoom = new ChatRoom({
        participants: participantIds,
        chatCreator: loggedInUserId,
        type,
        groupName: type === 'group' ? groupName : '',
        description: type === 'group' ? description : '',
      });
  
      await newChatRoom.save();
  
      // Optionally create an initial message
      // const initialMessage = new Message({
      //   chatRoom: newChatRoom._id,
      //   sender: loggedInUserId,
      //   message: type === 'group' ? 'Welcome to the group!' : 'Hello!',
      // });
  
      // await initialMessage.save();
  
      // // Update the chat room with the last message reference
      // newChatRoom.lastMessage = initialMessage._id;
      // await newChatRoom.save();
  
      // // Populate lastMessage and return the chat room
      // const chatRoomWithLastMessage = await ChatRoom.findById(newChatRoom._id)
      //   .populate('lastMessage')
      //   .exec();
  
      return res.status(201).json({
        message: 'Chat room created successfully!',
        chatRoom: newChatRoom,
      });
    } catch (error) {
      next(error);
    }
  };
  



// Get all chat rooms for the current user


// const getChatRooms = async (req, res, next) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;

//         const userId = req.user._id; // Authenticated user's ID
//         const { role } = req.query; // Extract role filter from query parameters

//         // Step 1: Fetch chat rooms where the user is a participant
//         let chatRoomQuery = { participants: userId };

//         // const chatRoomsLength = await ChatRoom.find(chatRoomQuery).countDocuments();
//         const chatRooms = await ChatRoom.find(chatRoomQuery)
//             .populate('participants', 'name email role') // Ensure role is fetched from User schema
//             .sort({ updatedAt: -1 })
//             .skip((page - 1) * limit)
//             .limit(limit);

//         // Step 2: Apply role filter if provided
//         let filteredChatRooms = chatRooms;
//         if (role) {
//             filteredChatRooms = chatRooms.filter((room) =>
//                 room.participants.some(
//                     (participant) => participant.role === role && participant._id.toString() !== userId.toString()
//                 )
//             );
//         }

//         // Step 3: Generate pagination data
//         const paginationOfaichatbot = pagination(filteredChatRooms.length, limit, page);

//         // Step 4: Respond with filtered chat rooms
//         res.status(200).json(
//             Response({
//                 status: "success",
//                 statusCode: 200,
//                 message: "Chat rooms retrieved successfully.",
//                 data: filteredChatRooms,
//                 pagination: paginationOfaichatbot,
//             })
//         );
//     } catch (error) {
//         next(error); // Pass error to the centralized error handler
//     }
// };

// const getChatRooms = async (req, res, next) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;

//         const userId = req.user._id; // Authenticated user's ID
//         const { role } = req.query; // Extract role filter from query parameters

//         // Step 1: Fetch chat rooms where the user is a participant
//         let chatRoomQuery = { participants: userId };

//         const chatRooms = await ChatRoom.find(chatRoomQuery)
//         .populate([
//             { path: 'participants', select: 'name email role' }, // Fetch participants with specific fields
//             { path: 'lastMessage', select: 'message messageType createdAt' } // Fetch lastMessage fields
//         ])            .sort({ updatedAt: -1 })
//             .skip((page - 1) * limit)
//             .limit(limit);

//         // Step 2: Apply role filter if provided
//         let filteredChatRooms = chatRooms;
//         if (role) {
//             filteredChatRooms = chatRooms.filter((room) =>
//                 room.participants.some(
//                     (participant) => participant.role === role && participant._id.toString() !== userId.toString()
//                 )
//             );
//         }

//         // Step 3: Generate pagination data
//         const totalChatRooms = role ? filteredChatRooms.length : await ChatRoom.countDocuments(chatRoomQuery);
//         const paginationOfaichatbot = pagination(totalChatRooms, limit, page);

//         // Step 4: Respond with filtered chat rooms
//         res.status(200).json(
//             Response({
//                 status: "success",
//                 statusCode: 200,
//                 message: "Chat rooms retrieved successfully.",
//                 data: filteredChatRooms,
//                 pagination: paginationOfaichatbot,
//             })
//         );
//     } catch (error) {
//         next(error); // Pass error to the centralized error handler
//     }
// };

const getChatRooms = async (req, res, next) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const userId = req.user._id; // Authenticated user's ID
      const { role } = req.query; // Extract role filter from query parameters

      // Step 1: Fetch chat rooms where the user is a participant
      let chatRoomQuery = { participants: userId };

      const chatRooms = await ChatRoom.find(chatRoomQuery)
          .populate([
              { path: 'participants', select: 'name email role' }, // Fetch participants with specific fields
              { path: 'lastMessage', select: 'message messageType createdAt sender' } // Fetch lastMessage including sender
          ])
          .sort({ updatedAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit);

      // Step 2: Count unseen messages per chat room for other participants (excluding sender)
      const chatRoomIds = chatRooms.map(room => room._id);
      const unseenMessages = await Message.aggregate([
          {
              $match: {
                  chatRoom: { $in: chatRoomIds },
                  isSeen: false,
                  sender: { $ne: userId } // Exclude messages sent by the current user
              }
          },
          {
              $group: {
                  _id: "$chatRoom",
                  count: { $sum: 1 }
              }
          }
      ]);

      // Convert unseen messages count into an object for easy lookup
      const unseenMessageCounts = unseenMessages.reduce((acc, item) => {
          acc[item._id.toString()] = item.count;
          return acc;
      }, {});

      // Step 3: Apply role filter if provided
      let filteredChatRooms = chatRooms;
      if (role) {
          filteredChatRooms = chatRooms.filter((room) =>
              room.participants.some(
                  (participant) => participant.role === role && participant._id.toString() !== userId.toString()
              )
          );
      }

      // Step 4: Add unseen message count to each chat room
      const finalChatRooms = filteredChatRooms.map(room => ({
          ...room.toObject(),
          unseenMessages: room.lastMessage?.sender.toString() === userId.toString()
              ? 0  // If the last message sender is the current user, show 0 unseen messages
              : unseenMessageCounts[room._id.toString()] || 0 // Otherwise, show unseen messages count
      }));

      // Step 5: Generate pagination data
      const totalChatRooms = role ? filteredChatRooms.length : await ChatRoom.countDocuments(chatRoomQuery);
      const paginationOfaichatbot = pagination(totalChatRooms, limit, page);

      // Step 6: Respond with filtered chat rooms including unseen message count
      res.status(200).json(
          Response({
              status: "success",
              statusCode: 200,
              message: "Chat rooms retrieved successfully.",
              data: finalChatRooms,
              pagination: paginationOfaichatbot,
          })
      );
  } catch (error) {
      next(error); // Pass error to the centralized error handler
  }
};


// const getChatRooms = async (req, res, next) => {
//   try {
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;

//       const userId = req.user._id; // Authenticated user's ID
//       const { role } = req.query; // Extract role filter from query parameters

//       // Step 1: Fetch chat rooms where the user is a participant
//       let chatRoomQuery = { participants: userId };

//       const chatRooms = await ChatRoom.find(chatRoomQuery)
//           .populate([
//               { path: 'participants', select: 'name email role' }, // Fetch participants with specific fields
//               { path: 'lastMessage', select: 'message messageType createdAt' } // Fetch lastMessage fields
//           ])
//           .sort({ updatedAt: -1 })
//           .skip((page - 1) * limit)
//           .limit(limit);

//       // Step 2: Count unseen messages per chat room
//       const chatRoomIds = chatRooms.map(room => room._id);
//       const unseenMessages = await Message.aggregate([
//           { $match: { chatRoom: { $in: chatRoomIds }, isSeen: false } }, // Filter unseen messages
//           { $group: { _id: "$chatRoom", count: { $sum: 1 } } } // Count unseen messages per chatRoom
//       ]);

//       // Convert unseen messages count into an object for easy lookup
//       const unseenMessageCounts = unseenMessages.reduce((acc, item) => {
//           acc[item._id.toString()] = item.count;
//           return acc;
//       }, {});

//       // Step 3: Apply role filter if provided
//       let filteredChatRooms = chatRooms;
//       if (role) {
//           filteredChatRooms = chatRooms.filter((room) =>
//               room.participants.some(
//                   (participant) => participant.role === role && participant._id.toString() !== userId.toString()
//               )
//           );
//       }

//       // Step 4: Add unseen message count to each chat room
//       const finalChatRooms = filteredChatRooms.map(room => ({
//           ...room.toObject(),
//           unseenMessages: unseenMessageCounts[room._id.toString()] || 0 // Default to 0 if no unseen messages
//       }));

//       // Step 5: Generate pagination data
//       const totalChatRooms = role ? filteredChatRooms.length : await ChatRoom.countDocuments(chatRoomQuery);
//       const paginationOfaichatbot = pagination(totalChatRooms, limit, page);

//       // Step 6: Respond with filtered chat rooms including unseen message count
//       res.status(200).json(
//           Response({
//               status: "success",
//               statusCode: 200,
//               message: "Chat rooms retrieved successfully.",
//               data: finalChatRooms,
//               pagination: paginationOfaichatbot,
//           })
//       );
//   } catch (error) {
//       next(error); // Pass error to the centralized error handler
//   }
// };


// Send a message

// const sendMessage = async (req, res, next) => {
//     try {
//         // Extract authenticated user's ID (assumes `user` is set by authentication middleware)
//         const sender = req.user?._id;
//         console.log(req.user);

//         // Extract other fields from request body
//         const { chatRoomId, message, messageType } = req.body;

//         // Validate required fields
//         if (!chatRoomId || !message) {
//             return res.status(400).json(Response({
//                 status: "error",
//                 statusCode: 400,
//                 message: 'Missing required fields. "chatRoomId" and "message" are mandatory.',
//             }));
//         }

//         // Create a new message object
//         const newMessage = new Message({
//             chatRoom: chatRoomId,
//             sender: sender,
//             message,
//             messageType: messageType || 'text', // Defaults to 'text'
//         });

//         // Save the message to the database
//         await newMessage.save();

//         // Respond with success
//         return res.status(200).json(Response({
//             status: "success",
//             statusCode: 200,
//             message: 'Message sent successfully!',
//             data: newMessage,
//         }));
//     } catch (error) {
//         next(error);
//     }
// };
const sendMessage = async (req, res, next) => {
    try {
        // Extract authenticated user's ID (assumes `user` is set by authentication middleware)
        const sender = req.user?._id;
        console.log(req.user);

        // Extract other fields from request body
        const { chatRoomId, message, messageType } = req.body;

        // Validate required fields
        if (!chatRoomId || !message) {
            return res.status(400).json(
                Response({
                    status: "error",
                    statusCode: 400,
                    message: 'Missing required fields. "chatRoomId" and "message" are mandatory.',
                })
            );
        }

        // Create a new message object
        const newMessage = new Message({
            chatRoom: chatRoomId,
            sender: sender,
            message,
            messageType: messageType || 'text', // Defaults to 'text'
        });

        // Save the message to the database
        await newMessage.save();

        // Update the lastMessage field in the associated chat room
        await ChatRoom.findByIdAndUpdate(
            chatRoomId,
            { lastMessage: newMessage._id, updatedAt: Date.now() }, // Update lastMessage and updatedAt
            { new: true } // Return the updated document
        );

        // Respond with success
        return res.status(200).json(
            Response({
                status: "success",
                statusCode: 200,
                message: 'Message sent successfully!',
                data: newMessage,
            })
        );
    } catch (error) {
        next(error); // Pass error to centralized error handler
    }
};


// Get all messages from a chat room
// Show messages

// const showMessages = async (req, res, next) => {
//     try {
//         const { chatRoomId, role } = req.query; // Extract role from query parameters
//         let page = parseInt(req.query.page, 10) || 1;  // Default to 1 if not provided
//         let limit = parseInt(req.query.limit, 10) || 20; // Default to 20 if not provided
        
//         // Validate required fields
//         if (!chatRoomId) {
//             return res.status(400).json(
//                 Response({
//                     status: "error",
//                     statusCode: 400,
//                     message: 'Chat room ID is required.',
//                 })
//             );
//         }

//         // Construct query object
//         const query = { chatRoom: chatRoomId };
      

//         // Fetch messages for the chat room
//         const messages = await Message.find(query)
//             // .sort({ createdAt: -1 }) // Sort by latest messages first
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .populate('sender', 'name email role image'); // Populate sender details

//             console.log(messages.length,"how many message are ther -------------");
//               // If there are messages, mark them as seen for the specific user
//         if (messages.length > 0) {
//           await Message.updateMany(
//               { _id: { $in: messages.map(message => message._id) } },
//               { $set: { isSeen: true } } // Set isSeen to true for all retrieved messages
//           );
//           console.log("is seen-------------------------------------");
//       }

//         // Count total messages for pagination
//         const totalMessages = await Message.countDocuments(query);

//         // Generate pagination data
//         const paginationOfaichatbot = pagination(totalMessages, limit, page);
//         console.log(paginationOfaichatbot,limit,page);

//         // Respond with success
//         return res.status(200).json(
//             Response({
//                 status: "success",
//                 statusCode: 200,
//                 message: 'Messages retrieved successfully!',
//                 data: messages,
//                 pagination: paginationOfaichatbot,
//             })
//         );
//     } catch (error) {
//         next(error); // Pass error to centralized error handler
//     }
// };

const showMessages = async (req, res, next) => {
  try {
      const { chatRoomId, role, userId } = req.query; // Extract userId from query parameters
      let page = parseInt(req.query.page, ) ;  // Default to 1 if not provided
      let limit = parseInt(req.query.limit, ); // Default to 20 if not provided
      
      // Validate required fields
      if (!chatRoomId) {
          return res.status(400).json(
              Response({
                  status: "error",
                  statusCode: 400,
                  message: 'Chat room ID is required.',
              })
          );
      }

      // Construct query object
      const query = { chatRoom: chatRoomId };

      // Fetch messages for the chat room
      const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      
          .skip((page - 1) * limit)
          .limit(limit)
     
          .populate('sender', 'name email role image'); // Populate sender details

      console.log(messages.length, "how many messages are there -------------");

       // **Reverse to ascending order before sending**
       messages.reverse();
      // Mark messages as seen for the specific user
      await markMessagesAsSeen(messages, userId);

      // Count total messages for pagination
      const totalMessages = await Message.countDocuments(query);

      // Generate pagination data
      const paginationOfaichatbot = pagination(totalMessages, limit, page);
      console.log(paginationOfaichatbot, limit, page);

      // Respond with success
      return res.status(200).json(
          Response({
              status: "success",
              statusCode: 200,
              message: 'Messages retrieved successfully!',
              data: messages,
              pagination: paginationOfaichatbot,
          })
      );
  } catch (error) {
      next(error); // Pass error to centralized error handler
  }
};

// Function to mark messages as seen
const markMessagesAsSeen = async (messages, userId) => {
  if (messages.length > 0) {
      // Find messages not sent by the current user (messages they are viewing)
      const unseenMessages = messages.filter(msg => msg.sender.toString() !== userId);

      if (unseenMessages.length > 0) {
          await Message.updateMany(
              { _id: { $in: unseenMessages.map(msg => msg._id) } },
              { $set: { isSeen: true } }
          );

          console.log("Marked messages as seen for user:", userId);
      }
  }
};


// const sendImage = async (req, res, next) => {
//     try {
//       const userId = req.user._id; // Assuming user info is extracted from auth middleware
//       const { chatId } = req.body; // Extract chatId and reciverId from request body
  
//       if (!chatId ) {
//         return res.status(400).json(
//           Response({
//             statusCode: 400,
//             message: 'Chat ID   are required',
//             status: 'failed',
//           })
//         );
//       }
  
//       // Check if the chat room exists
//       const chatRoom = await ChatRoom.findById(chatId);
//       if (!chatRoom) {
//         return res.status(404).json(
//           Response({
//             statusCode: 404,
//             message: 'Chat room not found',
//             status: 'failed',
//           })
//         );
//       }
  
//       const { messageImage } = req.files;
//         const files = [];
    
//         // If an image is uploaded, store the public URL and file path
//         if (messageImage && req.files) {
//             messageImage.forEach((img) => {
//             const publicFileUrl = `/images/users/${img.filename}`;
//             files.push({
//               publicFileUrl,
//               path: img.filename,
//             });
//           });
//         }
  
//       if (files.length === 0) {
//         return res.status(400).json(
//           Response({
//             statusCode: 400,
//             message: 'Please upload at least one image',
//             status: 'failed',
//           })
//         );
//       }
  
//       // Prepare the message data
//       const data = {
//         chatRoom: chatId,
//         sender: userId,
//         message: files[0], // Save the first image in `message`
//         messageType: 'image',
//       };
  
//       // Save the message to the database
//       const newMessage = await Message.create(data);
//       const responseMessage = {
//         _id: newMessage._id,
//         chatRoom: newMessage.chatRoom,
//         sender: {
//           _id: sender._id,
//           name: sender.name,
//           email: sender.email,
//           role: sender.role,
//           image: sender.image,
//         },
//         message: newMessage.message,
//         messageType: newMessage.messageType,
//         createdAt: newMessage.createdAt,
//         updatedAt: newMessage.updatedAt,
//         __v: newMessage.__v,
//       };
  
//       io.to(`newMessage::${chatId}`).emit('newMessage', responseMessage);
  
//       // Emit the new image message to the chat room
//       const messageEvent = `sendMessage::${chatId}`;
//       io.to(messageEvent, { message: createImageMessage });
  
//       // Return the response
//       return res.status(200).json(
//         Response({
//           statusCode: 200,
//           message: 'Image sent successfully.',
//           status: 'success',
//           data: createImageMessage,
//         })
//       );
//     } catch (error) {
//       // Handle errors and pass them to the error middleware
//       next(error);
//     }
//   };
const sendImage = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { chatId } = req.body;
  
      if (!chatId) {
        return res.status(400).json({
          statusCode: 400,
          message: 'Chat ID is required',
          status: 'failed',
        });
      }
  
      const chatRoom = await ChatRoom.findById(chatId);
      if (!chatRoom) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Chat room not found',
          status: 'failed',
        });
      }
  
      const { messageImage } = req.files;
      const files = messageImage.map((img) => ({
        publicFileUrl: `/images/users/${img.filename}`,
        path: img.filename,
      }));
  
      if (files.length === 0) {
        return res.status(400).json({
          statusCode: 400,
          message: 'Please upload at least one image',
          status: 'failed',
        });
      }
  
      const messageData = {
        chatRoom: chatId,
        sender: userId,
        message: files[0],
        messageType: 'image',
      };
  
      const newMessage = await Message.create(messageData);
      console.log(newMessage,"sdlkfjlsdkjflksdfj");

      await ChatRoom.findByIdAndUpdate(
        chatId,
        { lastMessage: newMessage._id, updatedAt: Date.now() },
        { new: true }
    );
     
                    
                      
      const sender = await User.findById(userId, 'name email role image');
      const responseMessage = {
        _id: newMessage._id,
        chatRoom: newMessage.chatRoom,
        sender: {
          _id: sender._id,
          name: sender.name,
          email: sender.email,
          role: sender.role,
          image: sender.image,
        },
        message: newMessage.message,
        messageType: newMessage.messageType,
        createdAt: newMessage.createdAt,
        updatedAt: newMessage.updatedAt,
        __v: newMessage.__v,
      };
  
    
      const messageEvent=`newMessage::${chatId}`
      console.log("=========",messageEvent)
      io.emit(messageEvent,  {data: {attributes:[responseMessage] }});
     
  
      return res.status(200).json({
        statusCode: 200,
        message: 'Image sent successfully.',
        status: 'success',
        data: { attributes: [responseMessage] },
      });
    } catch (error) {
      next(error);
    }
  };
  

  // make the user show how many message are there 
  //-----------------------------------------------
  // const myMessageLength=async(req,res,next)=>{
  //   try {
  //     const id=req.user._id
  //     const message=await 

      
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  const getUnseenMessageCount = async (req, res, next) => {
    try {
        const userId = req.user._id; // Assuming user ID is available from authentication middleware

        // Count the number of messages where the user is the recipient and isSeen is false
        const unseenMessageCount = await Message.countDocuments({
            chatRoom: { $in: await getUserChatRooms(userId) }, // Get user's chat rooms
            sender: { $ne: userId }, // Exclude messages sent by the user
            isSeen: false
        });

        // Emit real-time update via socket
        io.to(userId.toString()).emit('unseenMessages', { unseenMessages: unseenMessageCount });

        res.status(200).json({ unseenMessages: unseenMessageCount });
    } catch (error) {
        next(error);
    }
};

// Helper function to get chat rooms where the user is a participant
const getUserChatRooms = async (userId) => {
    const chatRooms = await ChatRoom.find({ participants: userId }).select('_id');
    return chatRooms.map(room => room._id);
};

//   const getUnseenMessageCount = async (req, res, next) => {
//     try {
//         const userId = req.user._id; // Assuming user ID is available from authentication middleware

//         // Count the number of messages where the user is the recipient and isSeen is false
//         const unseenMessageCount = await Message.countDocuments({
//             chatRoom: { $in: await getUserChatRooms(userId) }, // Get user's chat rooms
//             sender: { $ne: userId }, // Exclude messages sent by the user
//             isSeen: false
//         });

//         console.log(userId,unseenMessageCount);

//         res.status(200).json({ unseenMessages: unseenMessageCount });
//     } catch (error) {
//         next(error);
//     }
// };

// // Helper function to get chat rooms where the user is a participant
// const getUserChatRooms = async (userId) => {
//     const chatRooms = await ChatRoom.find({ participants: userId }).select('_id');
//     return chatRooms.map(room => room._id);
// };

module.exports={
    createChatRoom,
    getChatRooms,
    sendMessage,
    showMessages,
    sendImage,
    getUnseenMessageCount
}