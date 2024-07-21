const mongoose = require('mongoose');
const { Schema} = mongoose;

const MsgSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    likes: {
        type: [String]
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Msg = mongoose.model('msg', MsgSchema);
module.exports = {
    Msg,
    MsgSchema
};