const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken');
const { sign } = require('../helpers/jwt-helper');
const sendMail = require('../nodemailer/sendmail')
const deleteUser = async (req, res, next) => { // API delete one user
	try {
		const userId = req.params.id;
		const user = await User.findById(userId).where({ deleteAt: null });
		if (!user) {
			return next(new Error('USER_NOT_FOUND'));
		}
		user.deleteAt = new Date();
		user.save();
		return res.json({
			message: 'Delete _id ' + userId + ' successfully!'
		});

	} catch (e) {
		return next(e);
	}
};
const createUser = async (req, res, next) => { // API create new user
	try {
		const {
			username,
			password,
			email
		} = req.body
		const salt = bcrypt.genSaltSync(2)
		const hashpassword = bcrypt.hashSync(password, salt)
		const newUser = new User({
			username,
			password: hashpassword,
			email
		});
		const data = await newUser.save();
		delete data._doc.password;
		return res.status(201).json({
			message: 'Add succesful',
			data: data
		});
	} catch (e) {
		return next(e);
	}
};

const login = async (req, res, next) => {
	try {
		const username = req.body.username;
		const password = req.body.password;
		const user = await User.findOne({ username });
		if (!user) {
			return next(new Error('err user'))
		}
		const comparepassword = bcrypt.compareSync(password, user.password)
		if (!comparepassword) {
			return next(new Error('err password'));
		}
		const token = sign({ _id: user.id });
		return res.status(201).json({
			message: 'login user succesful',
			access_token: token
		});
	} catch (e) {
		return next(e);
	}
}

const updateUser = async (req, res, next) => {

	try {
		const _id = req.params.id;
		const body = req.body;
		if (body.password) {
			const salt = bcrypt.genSaltSync(2);
			body.password = bcrypt.hashSync(password, salt);
		}
		const updateInfo = { $set: body };
		//newUser.password = hashpassword;
		const user = await User.findByIdAndUpdate(_id, updateInfo).lean().select('-password');
		if (!user) {
			return next(new Error('USER NOT FOUND'));
		}
		return res.status(200).json({
			message: 'update user succesful',
			olduser: user,
			data: updateInfo
		});

	} catch (e) {
		return next(e);
	}
};

const getListUser = async (req, res, next) => { // API get list users
	try {
		const users = await User.find().lean().select('-password').where({ deleteAt: null });
		return res.json({
			message: 'List users',
			data: users
		});

	} catch (e) {
		return next(e);
	}
};

const getOneUser = async (req, res, next) => {
	try {
		const userId = req.params.id;
		//const user = await User.findById(userId).lean().select('-password').where({deleteAt: null});
		const user = await User.findById(userId).lean().select('-password').where({ deleteAt: null });
		if (!user) {
			return next(new Error('USER NOT FOUND'));
		}
		return res.json({
			message: 'users',
			data: user
		});

	} catch (e) {
		return next(e);
	}
};

const forgetPassword = async (req, res, next) => {
	try {
		const { email } = req.body;
		let user = await User.findOne({ email });
		//console.log(user);
		if (!user) {
			return next(new Error('EMAIL_NOT_FOUND'));
		}
		let randomCode = Math.random().toString(36).substring(3, 10).toUpperCase();
		user.codeResetPassword = randomCode;
		user.genCodeAt = new Date;
		await user.save();
		await sendMail(email, randomCode);
		return res.status(200).json({
			message: "create user  successfully",
		})
	} catch (e) {
		return next(e);

	}
};
const resetPassWord = async (req, res, next) => {
	try {
		const { email, code, newPassword, confirdmPassword } = req.body;
		const user = await User.findOne().where({
			codeResetPassword: code,
			email: email
		});
		if (!user) {
			return next(new Error('CANNOT_RESET_PASSWORD'));
		}
		if (new Date() - user.genCodeAt > 1000 * 60 * 30) {
			return next(new Error('CODE_EXPIRED'));
		}
		if (newPassword !== confirmPassword) {
			return next(new Error('PASSWORD NOT THE SAME!'));
		}

		const salt = bcrypt.genSaltSync(2);
		const hashPassword = bcrypt.hashSync(newPassword, salt);
		user.password = hashPassword,
			user.codeResetPassword = null;
		user.genCodeAt = null;
		user.save();
		console.log(user);
		return res.status(200).json({
			message: 'change password successful',
		});

	} catch (e) {
		return next(e);
	}
}

module.exports = {
	deleteUser,
	createUser,
	updateUser,
	getOneUser,
	getListUser,
	login,
	forgetPassword,
	resetPassWord

}