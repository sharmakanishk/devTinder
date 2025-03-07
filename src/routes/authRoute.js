const express = require("express")
const authRouter = express.Router();
const { validateInput, validateInputKeys} = require("../middlewares/validation")
const User = require("../models/user")
const bcrypt = require("bcrypt")


authRouter.post("/signup",validateInputKeys, validateInput, async (req, res)=>{
    try{
        const {firstname, lastname, email, password}= req.body;
        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
            firstname,
            lastname,
            email,
            password: hashPassword
        })
        await user.save();
        const token = user.getJWT();
        res.cookie("token",token)
        res.send(user)
    }catch(err){
        if(err.code === 11000){
            res.status(403).send("Email ID already exist. Kindly try another email");
        }
        res.status(403).send(err.message)
    }
})

authRouter.post("/login",async (req, res)=>{
    try{
        const {email, password}= req.body;
        const user = await User.findOne({email});
        if(!user){
            throw new Error("Invalid credentials")
        }
        const result = await bcrypt.compare(password, user.password);
        if(result){
            const token = user.getJWT();
            res.cookie("token", token)
            res.send(user)
        }
        else{
            throw new Error("Invalid credentials")
        }
    }catch(err){
        res.status(401).send(err.message)
    }
})

authRouter.post("/logout", (req, res)=>{
    res.cookie("token", null, {expires: new Date(0)})
    res.send("Logout Successful!!")
})


module.exports = {authRouter}