const express = require('express')

const connectDB = require('./config/database')

const {validateSignUpData} = require('./utils/validation')

const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { userAuth } = require("./middlewares/auth")

app.use(express.json());
app.use(cookieParser());

app.get("/user", async(req, res) => {
    const email = req.body.emailId;

    try {
        const user = await User.find({ emailId: email})
        if(user.length == 0) {
            res.status(400).send("User Not Found");
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(400).send("Something went wrong" + err);
    }
});

app.get("/userAll", async(req, res) => {
    try {
        const user = await User.find({})
        if(user.length !== 0) {
            res.send(user);
        } else {
            res.status(400).send("No data found");
        }
    } catch (err) {
        res.status(400).send("Something went wrong: " +err);
    }
});

app.get("/userOne", async (req, res) => {
    const email = req.body.emailId

    try {
        const user = await User.findOne({emailId: email})
        if(user.length !== 0)
            res.send(user);
        else
            res.status(400).send("No data found");
    } catch {
        res.status(400).send("Something Went Wrong: " +err);
    }
});

app.post('/signup', async (req, res)=> {
    try {
        validateSignUpData(req);

        const {firstName, lastName, emailId, password, gender} = req.body
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            gender,
        });
        
        await user.save();
        res.send("User Added Successfully");
    } catch(err) {
        res.status(400).send("ERROR:"  + err.message);
    }

});

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body

        const user = await User.findOne({ emailId : emailId})
        if(!user) {
            throw new Error("Invalid Credentials")
        }
        
        const isPasswordValid = await user.validatePassword(password)

        if(!isPasswordValid) {
            throw new Error("Invalid Credentials")
        } else {
            const token = await user.getJWT();

            res.cookie("token", token)
            res.send("User login successful")
        }
    } catch(err) {
        throw new Error("ERROR: " + err)
    }
})

app.get('/profile', userAuth, async (req, res) => {
    try {
        // const cookies  = req.cookies
        // const { token } = cookies;
        
        // if(!token) {
        //     throw new Error ("Invalid Credentials");
        // }
        // const decodedMessage = await jwt.verify(token, "Muj@convocation-portal@123")
        // const { _id } = decodedMessage

        const user = req.user;
        console.log(user)
        // if(!user) {
        //     throw new Error("Invalid Credentials")
        // }

        res.send(user);
    } catch (err) {
        throw new Error ("ERROR: " +err.message)
    }
})

app.delete("/deleteUser", async(req, res) => {

    const userId = req.body.userId

    try {
        const user = await User.findByIdAndDelete({_id: userId})
        res.send("User deleted Successfully");
    } catch (err) {
        res.status(400).send("Error deleting the user: " +err);
    }
});

app.patch('/updateUser/:userId', async(req, res) => {
    const userId = req.params.userId
    const data =  req.body;
    
    try {
        const ALLOWED_UPDATES = ["gender", "about", "photoUrl", "skills"]

        const isUpdateAllowed = Object.keys(data).every((k) => 
            ALLOWED_UPDATES.includes(k)
        ); 
        if(!isUpdateAllowed) {
            throw new Error("Update not allowed")
        }

        if(data.skills?.length > 10) {
            throw new Error("Skills should not exceed 10")
        }
        const user = await User.findByIdAndUpdate(userId, data, {returnDocument: "before", runValidators: true})
        res.send("data updated successfully");
    } catch (err) {
        res.status(400).send("Something went wrong: " + err.message);
    }
})

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