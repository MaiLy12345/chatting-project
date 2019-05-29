const Joi = require('joi');
const createUser = () => {
   return {
       body:{
            username: Joi.string().min(3).max(30).required(),
            password: Joi.string().min(3).max(30).required()
       }
   }
    
};
const  updateUser = () => {
    return {
        // query: {
        //     _id : Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        // },
        // body: {
        //     username: Joi.string().min(6).max(30).required(),
        //     password: Joi.string().min(6).max(30).required()
        // },
       
    }
};

    
const getOneUser = ()  => {
    return {
        query:{
            _id : Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        }
        // access_token: [Joi.string(), Joi.number()],
        // birthyear: Joi.number().integer().min(1900).max(2013),
        // email: Joi.string().email({ minDomainSegments: 2 })
        };
    };
    
const  deleteUser = () => {
   return {
       query:{
        _id : Joi.string().regex(/^[0-9a-fA-F]{24}$/)
       }
    }
};
const login = () => {
    return {
        body:{
            username: Joi.string().min(3).max(30).required(),
            password: Joi.string().min(3).max(30).required()
       },
    };
};
    
    
module.exports = {
    createUser,
    updateUser,
    getOneUser,
    deleteUser,
    login
};
