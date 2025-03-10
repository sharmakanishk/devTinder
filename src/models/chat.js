const mongoose = require('mongoose')
const User = require('./user')

const messageSchema = new mongoose.Schema({
    chatId:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat",
        required:true,
    },
    userId:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    text: {
        type:String,
        required: true
    },
},
{timestamps:true}
)

const Message = mongoose.model("Message", messageSchema)

const chatSchema = new mongoose.Schema({
    userId1: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    userId2:  {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
},
{timestamps:true})

const Chat = mongoose.model("Chat", chatSchema)

module.exports = {Chat,Message};