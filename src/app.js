const express = require('express')
const { createServer} = require("http")
const db = require("./config/database")
const cookie = require("cookie-parser")
const app = express()
const {authRouter } = require("./routes/authRoute")
const {profileRouter} = require("./routes/profileRoute")
const {connectionRouter} = require("./routes/connectionRequest")
const {userRouter}= require("./routes/userRoute")
const {feedRouter} = require("./routes/feed")
const cors = require("cors")
require("dotenv").config()

const socketBackendConnection = require("./utils/webSockets")
const chatRouter = require('./routes/chat')

const httpServer = createServer(app)
socketBackendConnection(httpServer)

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    optionSuccessStatus:200
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookie())

const DEFAULT_PORT = process.env.NODE_ENV === "production" ? 7777 : 5000;
db()
.then((resolve)=>{
    console.log("DB connected")
    httpServer.listen(DEFAULT_PORT, ()=>{
        console.log("The server is listening on port " + DEFAULT_PORT);
    })
}).catch((err)=>{
    console.error(err.message)
})

app.use('/',authRouter);
app.use('/',profileRouter)
app.use('/', connectionRouter)
app.use('/',userRouter)
app.use('/', feedRouter)
app.use('/', chatRouter)




