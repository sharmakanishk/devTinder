const express = require("express")
const userRouter = express.Router()
const { validateToken}= require("../middlewares/validateToken")
const Connection = require("../models/connection")
const SAFE_DATA= "firstname lastname gender age skills profilepic about"

userRouter.get("/user/connection/request", validateToken, async (req, res)=>{
    try{
            const loggedInUserId = req.user.userId;
            const data = await Connection.find({
                toUserId: loggedInUserId,
                status: "interested"
            }).populate("fromUserId", SAFE_DATA)
            if(data.length === 0){
                throw new Error("There are no request pending!")
            }
            res.send(data)
        }catch(err){
            res.status(400).json({
                message: err.message
            });
        }
})

userRouter.get("/user/connection", validateToken, async (req, res) => {
    try {
        const loggedInUserId = req.user.userId;

        // Find the connections where either 'toUserId' or 'fromUserId' match the logged in user, and the status is "accepted"
        const data = await Connection.find({
            $or: [
                { toUserId: loggedInUserId },
                { fromUserId: loggedInUserId }
            ],
            status: "accepted"
        });

        // If no data found, throw an error
        if (data.length === 0) {
            throw new Error("There are no connections yet");
        }
        // Populate user details for each connection
        const populatedData = await Promise.all(data.map(async (v) => {
            if (v.toUserId.toString() === loggedInUserId.toString()) {
                await v.populate("fromUserId", SAFE_DATA);
            } else {
                await v.populate("toUserId", SAFE_DATA);
            }
            return v; // Return the populated connection document
        }));
    
        // Send the response with the populated data
        res.json({
            message: "Please find the connection details",
            data: populatedData
        });

    } catch (err) {
        // Send the error response with status 400 and the error message
        res.status(400).json({
            message: err.message
        });
    }
});
module.exports = {userRouter}