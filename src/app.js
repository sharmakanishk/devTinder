const express = require('express')
const db = require("./config/database")
const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser")
const bcrypt = require("bcrypt")
const app = express()
const User = require('./models/user')
const { validateInput, validateInputKeys} = require("./middlewares/validation")
const { validateToken } = require("./middlewares/validateToken")

app.use(express.json())
app.use(cookie())

db()
.then((resolve)=>{
    console.log("DB connected")
    app.listen(7777, ()=>{
        console.log("The server is listening on port 7777");
    })
}).catch((err)=>{
    console.error(err.message)
})

app.post('/user',validateInputKeys, validateInput, async (req, res)=>{
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
        res.send("User added successfully!!")
    }catch(err){
        res.status(403).send(err.message)
    }
});

app.post('/login', async (req, res)=>{
    try{
        const {email, password}= req.body;
        const user = await User.findOne({email});
        if(!user){
            throw new Error("Invalid email or password")
        }
        const result = await bcrypt.compare(password, user.password);
        if(result){
            const token = user.getJWT();
            res.cookie("token", token)
            res.send("Login successful")
        }
        else{
            res.send("Invalid username or password")
        }
    }catch(err){
        res.send(err.message)
    }
})

app.get('/profile',validateToken, async (req, res)=>{
    try{
        const user = await User.findById(req.user.userId)
        res.send("Welcome to the profile page " + user.firstname)
        //const user = await User.findById(req.userId)
    }catch(err){
        res.send(err.message)
    }
})

app.get('/user', async (req, res)=>{
    try{
        let users = await User.find({})
        console.log("User details extracted")
        res.send(users)
    }catch(err){
        console.log(err.message)
    }
})

app.delete('/user',validateToken, async (req, res)=>{
    try{
        if(req.body.userId){
            await User.findByIdAndDelete(req.body.userId)
                res.send("User has been deleted")
        }
        // console.log(req.body.userId)
        else{
            res.status(500).send("The user details doesn't match or doesn't exist")
        }
    }catch(err){
        res.status(501).send(err.message)
    }
    
    
})


// app.patch('/user', async (req, res)=>{
//     const email =req.body.email;
//     let user = await User.findOne({email})
//     const REQ_ATTRIBUTES=["email", "firstname", "lastname", "skills", "phone", "gender", "profilepic", "age"]
//     if(user){
//         try{
//             const ans = Object.keys(req.body).every((v)=>(REQ_ATTRIBUTES.includes(v)))
//             if(!ans){
//                 throw new Error("The parameter is not valid!")
//             }
//             user = await User.findOneAndUpdate({email},req.body, { new: true, runValidators: true })
//             res.send("The updated user details is " + user)
//         }catch(err){
//             res.send(err.message)
//             console.log(err.message)
//         }
//     }
//     else{
//         res.status(401).send("Something went wrong")
//     }
// })

app.patch('/user/:userId?',validateToken, validateInputKeys, async (req, res)=>{
    try{
        const userId = req.params.userId;
        let user = await User.findById(userId)
        // const REQ_ATTRIBUTES=["firstname", "lastname", "skills", "phone", "gender", "profilepic", "age"]
        if(user){
            
                // const ans = Object.keys(req.body).every((v)=>{
                //     if(v==="email"){
                //         throw new Error("Cannot change emailId, please signup with new email ID")
                //     }
                //     return (REQ_ATTRIBUTES.includes(v))})
                const ans = Object.keys(req.body).includes("email")
                if(ans){
                    throw new Error("Email ID cannot be changed, please register again.")
                }
                // if(!ans){
                //     throw new Error("The mentioned parameters not valid!")
                // }
                user = await User.findByIdAndUpdate(userId,req.body, { new: true, runValidators: true })
                res.send("The updated user details is " + user)
            
        }
        else{
            res.status(401).send("Something went wrong")
        }
    }catch(err){
        res.send(err.message)
        console.log(err.message)
    }
})




