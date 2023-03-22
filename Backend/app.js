const express = require('express');
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

// Importing Routes
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const orderRoute = require('./routes/orderRoute');

app.use('/api/v1', productRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', orderRoute);

// Middleware for Error Handling
app.use(errorMiddleware)
module.exports = app;