const mongoose = require('mongoose');
module.exports = {
    connectDB: () => {
        return mongoose.connect('mongodb://localhost:27017/hello-server')
    },
    mongoose
}