const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser")

function validateToken(req, res, next){
    try{
        const token = req.cookies.token;
        if(!token){
            throw new Error("Please Login or Signup first")
        }
        const result = jwt.verify(token, process.env.SECRET);
        req.user = result;
        next()
    }catch(err){
        res.status(401).send(err.message)
    }
}

module.exports = { validateToken}