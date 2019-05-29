
const userValidation = require('../validations/user');
const userController = require('../controlers/user');
const validation = require('express-validation');
const { verifyToken } = require('../middlewares/authentication')
const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
    username: Joi.string().required().min(3).max(20),
    password: Joi.string().required().min(3).max(20)
    // access_token: [Joi.string(), Joi.number()],
    // birthyear: Joi.number().integer().min(1900).max(2013),
    // email: Joi.string().email({ minDomainSegments: 2 })
})//.with('username', 'birthyear').without('password', 'access_token');
exports.load = function(app) {
    app.get('/api/v1/users/', [ verifyToken ], userController.getListUser);
    app.post('/api/v1/login', userController.login)
	app.post('/api/v1/users/', validation(userValidation.createUser()), userController.createUser)
	app.delete('/api/v1/users/:id',[ verifyToken, validation(userValidation.deleteUser())], userController.deleteUser)
	app.put('/api/v1/users/:id', [ verifyToken, validation(userValidation.updateUser())], userController.updateUser)
    app.get('/api/v1/users/:id', [ verifyToken, validation(userValidation.getOneUser())], userController.getOneUser);
    app.post('/api/v1/forgetpassword', userController.forgetPassword);
    app.post('/api/v1/resetpassword', userController.resetPassWord);
}