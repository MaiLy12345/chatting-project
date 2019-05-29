
const Joi = require('joi');
const createProduct = () => {
   return {
       body:{
            name: Joi.string().min(6).max(30).required(),
            userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            colors: Joi.array().items(Joi.string().required()),
            price: Joi.number().integer().min(0).max(10000),
            isAvailable: Joi.boolean().invalid(0),
            payload: Joi.object().keys({
                expiredAt: Joi.date().required(),
		        releasedAt: Joi.date().required(),
            }).with('expiredAt', 'releasedAt'),
       }
   }
    
};
const  updateProduct = () => {
    return {
        query: {
            _id : Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        },
        body:{
            name: Joi.string().min(6).max(30).required(),
            userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            colors: Joi.array().items(Joi.string().required()),
            price: Joi.number().integer().min(0).max(10000),
            isAvailable: Joi.boolean().invalid(0),
            payload: Joi.object().keys({
                expiredAt: Joi.date().required(),
		        releasedAt: Joi.date().required(),
            }).with('expiredAt', 'releasedAt'),
       }
       
    }
};

    
const getOneProduct = ()  => {
    return {
        query:{
            _id : Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        }
        // access_token: [Joi.string(), Joi.number()],
        // birthyear: Joi.number().integer().min(1900).max(2013),
        // email: Joi.string().email({ minDomainSegments: 2 })
        };
    }
    
const  deleteProduct = () => {
   return {
       query:{
        _id : Joi.string().regex(/^[0-9a-fA-F]{24}$/)
       }
    }
}
    
    
module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getOneProduct
};
