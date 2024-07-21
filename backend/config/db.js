const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/groupchat";
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoURI, {
            dbName: 'groupchat'
        });
        console.log(`MongoDB connected on PORT: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
};

module.exports = connectDB;