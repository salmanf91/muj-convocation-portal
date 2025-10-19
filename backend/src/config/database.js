const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://salmanfrs91:OEoH1wCvmPzFLJiO@salmancluster.fvacibu.mongodb.net/muj-convocation-portal"
    )
};

module.exports = connectDB;