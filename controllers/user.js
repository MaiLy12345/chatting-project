const bcrypt = require('bcrypt-nodejs')
const { userRepository, groupRepository,messageRepository } = require('../reponsitories');
const lodash = require('lodash');
const { sign } = require('../helpers/jwt-helper');
const sendMail = require('../helpers/mail-helper');
const randomstring = require('randomstring');
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userDelete = await userRepository.getOne({ where: { _id: id }, select: '_id' });
        if (!userDelete) {
            return next(new Error('USER_NOT_FOUND'));
        }
        await userRepository.updateOne({ where: { _id: id }, data: {$set: { deleteAt: new Date() }} });
        await groupRepository.updateMany({ where: { members: userDelete._id }, data : { $pull: {members: userDelete._id}} });
        return res.status(200).json({
            message : 'delete user successful',
        });
    } catch (e) {
        return next(e);
    }
};

const login = async (req, res, next) => {
    try {
        const data = req.body;
        const salt  = bcrypt.genSaltSync('10');
        const hashPassword = bcrypt.hashSync(data.password, salt);
        const user = await userRepository.getOne({ where: { username: data.username } });
        if (!user) {
            return next(new Error('User not exist'));
        }
        const isValidatePassword = bcrypt.compareSync(data.password, user.password);
        if (!isValidatePassword) {
            return next(new Error('Password incorrect'));
        }
        const token = sign({ _id: user._id });
        return res.status(201).json({
            message: "login successfully",
            access_token: token
        });
    } catch (e) {
        return next(e);
    }
};
const createUser = async (req, res, next) => {
    try {
        const data = req.body;
        const salt = bcrypt.genSaltSync(2);
        const hashPassword = bcrypt.hashSync(data.password, salt);
        data.password = hashPassword;
        const creatUser = await userRepository.create(data);
        return res.status(200).json({
            message: "create user  successfully",
            creatUser
        })
    } catch (e) {
        return next(e);
    };
}
const getListUser = async (req, res, next) => {
    try {
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit); 
        const users = await userRepository.getAll({ select: '-password', limit, page });
        return res.status(200).json({
            message: 'List users',
            data: users
        });
    } catch (e) {
        return next(e);
    }
};

const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userRepository.getOne({ where: { _id: id }, select: '-password'});       
        if (!user) {
            return next(new Error('User not found'));
        }
        return res.status(200).json({
            message: 'User',
            data: user
        });
    } catch (e) {
        return next(e);
    }
};


const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const salt = bcrypt.genSaltSync(2);
        const hashPassword = bcrypt.hashSync(data.password, salt);
        data.password = hashPassword;
        lodash.omitBy(data, lodash.isNull);
        const existedUser = await userRepository.getOne({where: { _id: id }, select: '_id'});
        if (!existedUser) {
            return next(new Error(' User not found'));
        }
        const updateInfo = { $set: data };
        const userUpdate = await userRepository.updateOne({ where: { _id: id }, data: updateInfo })
        
        return res.status(200).json({
            message : 'update successful',
            data: userUpdate,
            data_update: newValues
        });
    } catch (e) {
        return next(e);
    }
};

const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const existedEmail = await userRepository.getOne({ where: { email } });
        if (!existedEmail) {
            return next(new Error('Email not found'));
        }
        const code = randomstring.generate({
            length: 6,
            charset: 'alphanumeric',
            capitalization: 'uppercase'
        });
        await sendMail(email, code);
        await userRepository.updateOne({ where : { email }, data: { verifyCode: code, verifyCodeExpiredAt: new Date() }});
        await User.updateOne({ email }, { verifyCode: code, verifyCodeExpiredAt: new Date() });
        return res.status(200).json({
            message: 'Sent mail'
        });
    } catch (e) {
        return next(new Error(e));
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await userRepository.getOne({ where: { email }, select: 'verifyCode verifyCodeExpiredAt' });
        if (!user) {
            return next(new Error('Email invalid'));
        }
        if (user.verifyCode === null) {
            return next(new Error('You are not requested forget password')); 
        }
        if (code !== user.verifyCode) {
            return next(new Error('Code invalid'));
        }
        if (new Date() - user.verifyCodeExpiredAt > 1000*60*5) {
            return next(new Error(' code expired'));       
        }
        const salt = bcrypt.genSaltSync(2);
        const hashPassword = bcrypt.hashSync(newPassword, salt);
        await userRepository.updateOne({ where: { email }, data: { password: hashPassword, verifyCode: undefined }});
        return res.status(200).json({
            message : 'change password successful',
        });
    } catch (error) {
        return next(error);
    } 
};
module.exports = {
    deleteUser,
    createUser,
    login,
    getListUser,
    getUser,
    updateUser,
    forgetPassword,
    resetPassword
};