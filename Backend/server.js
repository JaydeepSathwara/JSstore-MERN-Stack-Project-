const app = require('./app');

const dotenv = require('dotenv');
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