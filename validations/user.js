const Joi =  require('joi');

const condition = {
    username: Joi.string().alphanum().min(3).max(30),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    email: Joi.string().email({ minDomainSegments: 2 }),
    gender: Joi.string().valid('Female', 'Male', 'other')
};
    
const creatUser = () => {  
    return {
        body: {
            username: condition.username.required(),
            password: condition.password.required(),
            email: condition.email.required(),
            gender: condition.gender.required()
        }
    };   
}

const updateUser = () => {
    return {
        body: {
            username: condition.username,
            password: condition.password,
            email: condition.email,
            gender: condition.gender

        },
        params: {
            id: condition._id.required()
        }
    };
};

const getUser = () => {
    return {
        params: {
            id: condition._id.required()
        }
    };
}

const deleteUser = () => {
    return {
        params: {
            id: condition._id.required()
        }
    };
}

module.exports = {
    creatUser,
    updateUser,
    getUser,
    deleteUser
}