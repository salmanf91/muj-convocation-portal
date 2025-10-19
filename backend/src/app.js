const express = require('express')

const connectDB = require('./config/database')

const app = express();

connectDB()
    .then(() => {
        console.log("Database is connected")
    })
    .error((err) => {
        console.log("Can not be connected to database", err)
    })

const PORT = 7777;

app.listen(PORT, ()=> {
    console.log(`Server is listenig on ${PORT}`)
})