const express = require('express')

const connectDB = require('./config/database')

const app = express();
const User = require('./models/user');

app.post('/signup', async (req, res)=> {
    const userObj = {
        fistName: "Salman",
        lastName: "Farees",
        emailId: "salmanfrs91@gmail.com",
        password: "Eternal@123"
    }

    //Creating a new instance of user model.
    const user = new User(userObj);

    try {
        await user.save();
        res.send("User Added Successfully");
    } catch(err) {
        res.status(400).send("Error saving the user:"  + err.message);
    }

});

connectDB()
    .then(() => {
        console.log("Database is connected");
        app.listen(PORT, ()=> {
            console.log(`Server is listenig on ${PORT}`)
        })
    })
    .catch((err) => {
        console.log("Can not be connected to database", err)
    })

const PORT = 7777;