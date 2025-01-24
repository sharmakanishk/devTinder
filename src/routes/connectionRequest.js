const express = require("express")
const connectionRouter = express.Router()
const Connection = require("../models/connection")
const User = require("../models/user")
const { validateToken} = require("../middlewares/validateToken")

const VISIBLE_DATA= "firstname lastname gender age skills profilepic"

connectionRouter.post("/connect/:status/:toUserId",validateToken, async (req, res)=>{
    try{
        const { status, toUserId} = req.params;
        const fromUserId = req.user.userId;
        const parameters = ["interested", "ignored"]
        if(!parameters.includes(status)){
            throw new Error("The mentioned status is not allowed")
        }
        const toUser = await User.findById(toUserId)
        if(!toUser){
            throw new Error("The user doesn't exist")
        }
        const data = await Connection.findOne({
            $or: [
                {toUserId, fromUserId},
                {toUserId: fromUserId, fromUserId: toUserId}
            ]
        })
        if(data){
            throw new Error("Conection request was already sent, cannot connect again")
        }
        if(fromUserId.toString()=== toUserId.toString()){
            throw new Error("Cannot send connect request to yourself")
        }
        const userConnection = new Connection({
            toUserId,
            fromUserId,
            status
        });
        await userConnection.save();
        res.json({
            message: `Connection request sent to ${toUser.firstname}`, 
            data:userConnection})
    }catch(err){
        res.send(err.message)
    }
})

connectionRouter.post("/connect/review/:status/:requestId", validateToken, async (req, res)=>{
    try{
        const {status, requestId}= req.params;
        const loggedInUserId = req.user.userId;
        const validStatus = ["accepted","rejected"]
        if(!validStatus.includes(status)){
            throw new Error("Invalid status type! Valid status: accepted or rejected.")
        }
        const data = await Connection.findOne({
            _id:requestId,
            toUserId: loggedInUserId,
            status: "interested"
        });
        if(!data){
            throw new Error("You are not authorized to change the status")
        }
        data.status = status;
        await data.save();
        res.json({message:`The status has been updated to ${status}`})
    }catch(err){
        res.send(err.message)
    }
})

connectionRouter.get("/connect/details", validateToken,async (req, res)=>{
    try{
        const loggedInUserId = req.user.userId;
        const data = await Connection.find({
            //$or only works on top level, if use more than one, combine in 
            // single or, otherwise it will take the last or
            // $or: [
            //     { toUserId: loggedInUserId },
            //     { fromUserId: loggedInUserId }
            // ],
            // $or: [
            //     { status: "interested" },
            //     { status: "accepted" }
            // ]
            //The above didn't work
            $or: [
                { toUserId: loggedInUserId, status: { $in: ["interested", "accepted"] } },
                { fromUserId: loggedInUserId, status: { $in: ["interested", "accepted"] } }
            ]
        })
        if(!data){
            throw new Error("There are no connections yet")
        }
        //  data.forEach(async (v)=>{
        //     if(v.toUserId.toString()===loggedInUserId.toString()){
        //         await v.populate("fromUserId")
        //     }
        //     else{
        //         await v.populate("toUserId")
        //     }
        // })
        //async await doesn't work properly with forEach, either use For of or Promise.all with map
        for (let v of data) {
            if (v.toUserId.toString() === loggedInUserId.toString()) {
                await v.populate("fromUserId", VISIBLE_DATA);
            } else {
                await v.populate("toUserId", VISIBLE_DATA);
            }
        }
        res.json({
            message: "Please find the connection details",
            data: data
        })
    }catch(err){

    }
    
})

module.exports = {connectionRouter};