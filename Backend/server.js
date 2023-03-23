const app = require('./app');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary');
const connectDatabase = require('./config/database');

// Handling Uncaught Error
process.on('uncaughtException', (err)=>{
    console.log("Error: ", err.message);
    console.log("Shutting down the server due to Uncaught sException");
        process.exit(1);
})

// config
dotenv.config({path: "backend/config/.env"});

connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is listing on http://localhost:${process.env.PORT}`);
})

process.on('unhandledRejection',(err) => {
    console.log("Error: ", err.message);
    console.log("Shutting down the server due to Unhandled Promise Rejection");
    server.close(() => {
        process.exit(1);
    })
});