const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email id: " + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        // validate(value) {
        //     if(validator.isStrongPassword(value)) {
        //         throw new Error("Enter a strong password: " +value)
        //     }
        // }
    },
    gender: {
        type: "String",
        validate(value) {
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://t3.ftcdn.net/jpg/14/32/54/48/240_F_1432544801_KCFe2R9rk24i96JsyMCv88wOkhRH2c7U.jpg",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid URL", +value)
            } 
        }
    },
    about: {
        type: String,
        default: "This is default description of the user.!"
    },
    skills: {
        type: [String]
    }
}, 
{
    timestamps: true,
});

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({_id: user._id}, "Muj@convocation-portal@123", {
        expiresIn: "7d" 
    })

    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash =  user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)

    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;