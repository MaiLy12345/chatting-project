const Joi = require('joi');
const createMessage = () => {
   return {
    body:{
        content: Joi.string().min(6).max(30).required(),
        author: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        group: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
   }
}
    
};
const  updateMessage = () => {
    return {
        body: {
            content: Joi.string().min(6).max(30).required(),
       },
       params: {
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
       },
    }
};

    
const getOneMessage = ()  => {
    return {
        params: {
            _id : Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        }
    }
};
    
const  deleteMessage = () => {
   return {
       params: {
        _id : Joi.string().regex(/^[0-9a-fA-F]{24}$/)
       },
    };
};
    
    
module.exports = {
    createMessage,
    updateMessage,
    getOneMessage,
    deleteMessage,
};
