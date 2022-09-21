const express = require('express')
const cors = require('cors')
const socket = require('socket.io')

const userRoutes = require("./routes/userRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const sequelize = require('./db')

const app = express()
require('dotenv').config()

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const {PORT, dbDialect, dbUsername, dbPassword} = process.env


app.use("/api/auth", userRoutes)
app.use("/api/messages", messageRoutes)

app.get('/', (req, res) => {
    res.send('oi')
})

sequelize.sync()
//     sequelize.sync({force:true})
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}, link para acesso: http://localhost:${PORT}`)
        })
        const io = socket(server, {
            cors: {
                origin: 'http://localhost:3000',
                credentials: true
            }
        })

        global.onlineUsers = new Map()

        io.on("connection", (socket) => {
            global.chatSocket = socket
            socket.on("add-user", (userId) => {
                onlineUsers.set(userId, socket.id)
            })

            socket.on("send-msg", (data) => {
                const sendUserSocket = onlineUsers.get(data.to)
                if (sendUserSocket) {
                    socket.to(sendUserSocket).emit("msg-recieve", data.message)
                }
            })
        })
    })
    .catch(error => {
        console.log(error)
    })