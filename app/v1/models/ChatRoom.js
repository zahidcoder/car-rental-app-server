// const mongoose = require('mongoose');

// const ChatRoomSchema = new mongoose.Schema({
//     participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//     chatCreater:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
// },{timestamps:true});

// module.exports = mongoose.model('ChatRoom', ChatRoomSchema);

const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    chatCreator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
        type: String, 
        enum: ['single', 'group'], 
        default: 'single' 
    },
    groupName: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }  // Reference to the last message
}, { timestamps: true });

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);
