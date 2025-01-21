const User = require("../models/user")
const validate = require("validator")

function validateInput(req, res, next){
    try{
        if(!validate.isEmail(req.body.email)){
            throw new Error("Please enter a valid email ID.")
        }
        else if(!validate.isStrongPassword(req.body.password)){
            throw new Error("Please enter a strong password")
        }
        // else if(!validate.isMobilePhone((req.body?.phone).toString())){
        //     throw new Error("Please enter a valid phone number")
        // }
        // else if(!validate.isURL(req.body?.profilepic)){
        //     throw new Error("Please enter a valid URL")
        // }
        next();
    }catch(err){
        res.status(501).send(err.message)
    }
}

function validateInputKeys(req, res, next){
    try{
        const REQ_ATTRIBUTES=["email", "firstname", "lastname", "skills", "phone", "gender", "profilepic", "age", "password"]
        const ans = Object.keys(req.body).every((v)=>(REQ_ATTRIBUTES.includes(v)))
        if(!ans){
            throw new Error("The parameter is not valid!")
        }
        next()
    }catch(err){
        res.status(501).send(err.message)
    }
}

module.exports = {
    validateInput,
    validateInputKeys
}