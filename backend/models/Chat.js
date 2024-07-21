const mongoose = require("mongoose");
const { Schema } = mongoose;
const { MsgSchema } = require('./Msg');

const ChatSchema = new Schema({
    groupName: {
        type: String,
        required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }],
    date: {
        type: Date,
        default: Date.now
    },
    adminsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    msgs: {
        type: [MsgSchema]
    }
});

const Chat = mongoose.model('chat', ChatSchema);
module.exports = Chat;