const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    senderNick : {
        type: String,
        required : true,
    },
    senderName : {
        type: String,
        required : true,
    },
    receiverNick:{
        type: String,
    },
    text: {
        type: String,
        required : true,
    }
}, { collection: 'messages' });


MessageSchema.plugin(timestamps)

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message