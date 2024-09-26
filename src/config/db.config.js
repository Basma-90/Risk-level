const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("Database connected successfully");
    } catch (error) {
        console.error(error);
        console.log("Database connection failed");
    }
};

module.exports = dbConnection;