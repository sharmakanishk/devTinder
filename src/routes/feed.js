const express = require("express")
const feedRouter = express.Router()
const { validateToken}= require("../middlewares/validateToken")
const Connection = require("../models/connection")
const User = require("../models/user")

/*
User cannot see himself
User cannot see the connections
User cannot see the rejected ones
User rejected ones cannot be shown as well
*/

feedRouter.get("/feed",validateToken ,async (req, res)=>{
    try{
        const {limit=10, page=1}= req.query;
        const loggedInUserId = req.user.userId;
        const excludedUsers = await Connection.find({
        $or:[
                {fromUserId : loggedInUserId},
                {toUserId: loggedInUserId}, 
            ]
        });
        const excludedUsersId = new Set();
        excludedUsersId.add(loggedInUserId.toString());
        excludedUsers.forEach((connection)=>{
            excludedUsersId.add(connection.fromUserId.toString())
            excludedUsersId.add(connection.toUserId.toString())
        }) 
        let userList = await User.find({
            _id: { $nin: Array.from(excludedUsersId)}
        }).limit(limit*1).skip((page-1)*limit);
        res.send(userList)
    }catch(err){
        res.send(err.message)
    }
    
})

module.exports = {feedRouter};
