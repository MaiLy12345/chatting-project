const messageController = require('../controlers/messages');
const { verifyToken } = require('../middlewares/authentication');



exports.load = function(app) {
    app.post('/api/v1/messages', [ verifyToken ], messageController.create);
   

}