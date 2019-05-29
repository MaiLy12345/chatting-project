const groupController = require('../controlers/group');
const { verifyToken } = require('../middlewares/authentication');



exports.load = function(app) {
    app.post('/api/v1/groups', [ verifyToken ], groupController.create);
    app.get('/api/v1/groups', [ verifyToken ], groupController.getAllGroup);
    app.get('/api/v1/groups/:id', [ verifyToken ], groupController.getOneGroup);
    app.delete('/api/v1/groups/:id', [ verifyToken ], groupController.deleteGroup);
    app.put('/api/v1/groups/:id', [ verifyToken ], groupController.updateGroup);
    app.post('/api/v1/groups/addMember/:id', [ verifyToken ], groupController.addMembers);

}