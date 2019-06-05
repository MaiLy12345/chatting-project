const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const port = 3000;
const userRoute = require('./apis/user.js');
const groupRoute = require('./apis/groups.js');
const messageRoute = require('./apis/messages')
const models = require('./models');
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
 
models
.connectDB()
.then(console.log('connect db ok'))
.catch(function (e) {
    console.error(e);
    process.exit(1);
});
    //load route
userRoute.load(app);
groupRoute.load(app);
messageRoute.load(app);

io.on('connection', function (socket) {
    socket.on('recieving-message', function(data, callback) {
        try {
            console.log(data);
            // throw new Error('aaaa');
            socket.broadcast.emit('sending-message', data);
            return callback(null, data);
        } catch (e) {
            return callback(e);
        }
    })
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});
app.use(function (err, req, res, next) {
    //   console.log(JSON.stringify(err, null, 2));
    if (Array.isArray(err.errors)) {
        const messagese = err.errors.map(function(item) {
            return item.message;
        });
        return res.status(400).json({
            error : messagese
        });
    }
    return res.json({
        message: err.message || 'have error'
    });
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});