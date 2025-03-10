const { Server} = require("socket.io")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const { Chat, Message } = require("../models/chat")



const secureRoom = (toUserId, id)=>{
    return crypto.createHmac('sha256', process.env.SECRET_CRYPTO)
    .update([id,toUserId].sort().join("_"))
    .digest('hex')
}

const socketBackendConnection = (httpServer)=> {
    const io = new Server(httpServer, {
        path: process.env.NODE_ENV === "production" ? "/api/socket.io" : "/socket.io", 
        cors: {
            origin:"http://localhost:5173",
            credentials: true,
    },
    });

    io.use((socket,next)=>{
        try{
            const token = socket.handshake.auth?.token
            if(!token){
                throw new Error("Token is not present")
            }
            const decoded = jwt.verify(token, process.env.SECRET)
            if(!decoded){
                throw new Error("Invalid token")
            }
            next();

        }catch(err){
            return next(new Error("Authentication failed: Invalid token"));
        }
    
    })
    io.on("connection",(socket)=>{
        socket.on("joinChat", async ({id,firstname,toUserId})=>{
            const roomId = secureRoom(id, toUserId)
            console.log(firstname+" joined "+ roomId)
            socket.join(roomId)
            let chat = await Chat.findOne({
                $or:[
                    {userId1:id, userId2:toUserId},
                    {userId1:toUserId, userId2:id},
                ]
            })
            if(!chat){
                chat = new Chat({
                    userId1:id,
                    userId2:toUserId,
                })
                await chat.save()
            }
    
        })
        socket.on("sendMessage",async ({id,firstname, toUserId, text})=>{
            const roomId = secureRoom(id, toUserId);
            console.log(firstname+" : "+text)
            
            let chat = await Chat.findOne({
                $or:[
                    {userId1:id, userId2:toUserId},
                    {userId1:toUserId, userId2:id},
                ]
            });
            const message = new Message({
                chatId:chat._id,
                userId:id,
                text,
            });
            await message.save()
            io.to(roomId).emit("receivedMessage",{textId: message._id,id, text})
        })
        socket.on("disconnect",()=>{
        })
    });
}
module.exports = socketBackendConnection
