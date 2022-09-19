const express = require('express')
const cors = require('cors')

const userRoutes = require("./routes/userRoutes.js");
const sequelize = require('./db')

const app = express()
require('dotenv').config()

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const {PORT, dbDialect, dbUsername, dbPassword} = process.env


app.use("/api/auth", userRoutes)

app.get('/', (req, res) => {
    res.send('oi')
})

sequelize.sync()
    // conn.sync({force:true})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}, link para acesso: http://localhost:${PORT}`)
        })
    })
    .catch(error => {
        console.log(error)
    })