const validator = require("validator");

const validateSignUpData = (data) => {
    const {firstName, lastName, emailId, password} = data.body;
   
    if(!firstName || !lastName) {
        throw new Error("Name is not valid")
    } else if(!validator.isEmail(emailId)) {
        throw new Error("Email is not valid")
    } else if(!validator.isStrongPassword(password)) {
        throw new Error("Pleae enter a strong password")
    }
}

module.exports = {
    validateSignUpData,
}