

// const mongoose = require('mongoose');

// const MessageSchema = new mongoose.Schema({
//     chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
//     sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     message: { type: String, required: true },
//     messageType: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
// }, { timestamps: true });

// module.exports = mongoose.model('Message', MessageSchema);
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: {
      type: mongoose.Schema.Types.Mixed, // Allows storing both strings and objects
      required: true,
    },
    isSeen:{type:Boolean,default:false},
    // isSenderSeen:{type:Boolean,default:true},
    messageType: {
      type: String,
      enum: ['text', 'image', 'video'],
      default: 'text',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);
