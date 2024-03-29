const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_URL, {useNewUrlParser:true, useUnifiedTopology:true}).then((data) => {
        console.log(`MongoDB connected: ${data.connection.host}`);
    })
}


module.exports = connectDatabase;