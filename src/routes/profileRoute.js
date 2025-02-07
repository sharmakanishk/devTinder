const express = require("express")
const profileRouter = express.Router()
const {validateToken} = require("../middlewares/validateToken")
const {validateInputKeys} = require("../middlewares/validation")
const User = require("../models/user")
const bcrypt = require("bcrypt")


profileRouter.get("/profile", validateToken, async (req, res)=>{
    try{
        const user = await User.findById(req.user.userId)
        res.send(user)
    }catch(err){
        res.send(err.message)
    }
});

profileRouter.patch("/profile/update/info", validateToken, validateInputKeys, async (req, res)=>{
    try{
        const userId = req.user.userId;
        let user = await User.findById(userId)
        if(user){
                const ans = Object.keys(req.body).includes("email")
                if(ans){
                    throw new Error("Email ID cannot be changed, please register again.")
                }
                user = await User.findByIdAndUpdate(userId,req.body, { new: true, runValidators: true })
                res.send(user)
        }
        else{
            res.status(401).send("Something went wrong")
        }
    }catch(err){
        res.send(err.message)
        console.log(err.message)
    }
})

profileRouter.patch("/profile/update/password", validateToken, async (req, res)=>{
    try{
        const user = await User.findById(req.user.userId);
        const {oldPassword, newPassword} = req.body;
        const result = await bcrypt.compare(oldPassword, user.password)
        if(!result){
            throw new Error("Your old password is incorrect, please enter correct password")
        }
        const hashPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashPassword;
        await user.save();
        res.cookie("token", null, {expires: new Date(0)})
        res.send("Password updated successfully!")
    }catch(err){
        res.status(400).send(err.message)
    }
});

profileRouter.delete("/profile/delete",validateToken,async (req, res)=>{
    try{
        const user = await User.findById(req.user.userId)
        const result = await bcrypt.compare(req.body.password, user.password)
        if(!result){
            throw new Error("Incorect Password!")
        }
        await User.deleteOne({_id: req.user.userId})
        res.cookie("token", null, {expires: new Date(0)})
        res.send("Profile deleted successfully!")
    }catch(err){
        res.status(501).send(err.message)
    }
})

module.exports = {profileRouter}