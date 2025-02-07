const mongoose = require("mongoose")
const validate = require("validator")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required : true,
        minLength:3,
        maxLength:50,
    },
    lastname:{
        type: String,
        required : true,
        minLength:3,
        maxLength:50,
    },
    age:{
        type: Number,
    },
    email:{
        type: String,
        required : true,
        lowercase: true,
        trim:true,
        unique:true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },
    phone:{
        type: Number,
        validate: {
            validator: function(v) {
              if(!validate.isMobilePhone(v.toString())){
                        throw new Error("Please enter a valid phone number")
                    }
            },
        },
    },
    gender:{
        type: String,
        validate:{
            validator: function(v){
                if(!["male", "female", "other"].includes(v)){
                    throw new Error("The specified gender is not valid!")
                }
            }
        }
    },
    skills:{
        type: [String],
        validate:{
            validator: function(v){
                if(v.length > 10){
                    throw new Error("Skills cannot be more than 10")
                }
            }
        },
    },
    profilepic:{
        type: String,
        default:"https://www.pngitem.com/middle/hxRbRT_profile-icon-png-default-profile-picture-png-transparent/",
        validate:{
            validator: function(v){
                if(!validate.isURL(v)){
                        throw new Error("Please enter a valid URL")
                    }
            }
        }
    },
    about:{
        type:String,
        default: "Please add your about",
    }
},
{
    timestamps: true
});


userSchema.methods.getJWT = function(){
    return jwt.sign({userId:this._id}, "DEVTINDER@123")
}



module.exports = mongoose.model("User", userSchema)
