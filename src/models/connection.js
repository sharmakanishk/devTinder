const mongoose = require("mongoose");
const User = require("./user");

const connectionSchema = mongoose.Schema({
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User
    },
    status: {
        type: String,
        required: true,
        enum:{
            values:["accepted", "ignored", "interested", "rejected"],
            message: '{VALUE} status is not supported'
        }
    }
},
{timestamps: true});

module.exports = mongoose.model("Connection", connectionSchema);