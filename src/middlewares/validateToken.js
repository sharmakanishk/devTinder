const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser")

function validateToken(req, res, next){
    try{
        const token = req.cookies.token;
        if(!token){
            throw new Error("Please Login or Signup first")
        }
        const result = jwt.verify(token, "DEVTINDER@123");
        req.user = result;
        next()
    }catch(err){
        res.send(err.message)
    }
}

module.exports = { validateToken}