const mongoose = require('mongoose')

// const mongoConnect =  ()=>{
//     return  mongoose.connect("mongodb+srv://kanishk:hE6KojOwulJNFrEx@test.g88k5.mongodb.net/?retryWrites=true&w=majority&appName=Test/devTinder")
// }

// const mongoConnect =  ()=>{
//     return  mongoose.connect("mongodb+srv://Kanishk:qIyPnIaOWXxJ5CwP@cluster0.teczp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/devTinder")
// }
const mongoConnect =  ()=>{
    return  mongoose.connect("mongodb+srv://Kanishk:qIyPnIaOWXxJ5CwP@cluster0.teczp.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Cluster0")
}


module.exports = mongoConnect;
