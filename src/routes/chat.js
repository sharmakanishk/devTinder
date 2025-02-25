const express = require("express")
const { validateToken } = require("../middlewares/validateToken")
const chatRouter = express.Router()
const {Chat} = require("../models/chat")

chatRouter.get("/chat/:toUserId",validateToken, async (req, res)=>{
    try{
        const id = req.user.userId;
        const toUserId = req.params.toUserId;
        let chat = await Chat.findOne({
            $or:[
                {userId1:id, userId2:toUserId},
                {userId1:toUserId, userId2:id},
            ]
        }).populate("messages")
        if(!chat){
            chat = new Chat({
                userId1:id,
                userId2:toUserId,
            })
            await chat.save()
        }
            res.send(chat)
    }catch(err){
        res.send(err.message)
    }
})

module.exports = chatRouter;