const Joi = require('joi');
const createGroup = () => {
   return {
    body:{
        name: Joi.string().min(6).max(30).required(),
        author: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        members: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
   }
}
    
};
const  updateGroup = () => {
    return {
        body: {
            name: Joi.string().min(6).max(30).required(),
            author: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            members: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
       },
       params: {
           id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
       },
    }
};

    
const getOneGroup = ()  => {
    return {
        params: {
            _id : Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        }
    }
};
    
const  deleteGroup = () => {
   return {
       params: {
        _id : Joi.string().regex(/^[0-9a-fA-F]{24}$/)
       },
    };
};

const addMemers = () => {
    return {
        body: {
            members: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
        },
        params: {
            _id : Joi.string().regex(/^[0-9a-fA-F]{24}$/)
           },
    };
};
    
    
module.exports = {
    createGroup,
    updateGroup,
    getOneGroup,
    deleteGroup,
    addMemers
};
