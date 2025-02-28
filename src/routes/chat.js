const express = require("express")
const { validateToken } = require("../middlewares/validateToken")
const chatRouter = express.Router()
const {Chat, Message} = require("../models/chat")

chatRouter.get("/chat/:toUserId/messages",validateToken, async (req, res)=>{
    try{
        const id = req.user.userId;
        const {page=1} = req.query;
        const toUserId = req.params.toUserId;
        let chat = await Chat.findOne({
            $or:[
                {userId1:id, userId2:toUserId},
                {userId1:toUserId, userId2:id},
            ]
        })
        if (!chat) {
            return res.send([]);
        }
            const messages = await Message.find({chatId:chat._id})
            .sort({createdAt: -1}).limit(10).skip((page-1)*10).exec();
            res.send(messages)
    }catch(err){
        res.send(err.message)
    }
})


module.exports = chatRouter;