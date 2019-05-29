const { mongoose } = require('./index');

const Userschema = new mongoose.Schema({
  username: {
      type: String,
      min: 3,
      max: 30,
      required: true,
      unique:true
  },
  password: {
      type: String,
      min: 3,
      max: 30,
      required: true,
  },
  email: {
      type: String,
      required: [true, 'Email is required field'],
      maxlength: [30, 'Email is too long!'],
      unique: true
    },
  codeResetPassword: {
      type: String,
      default: null
    },
  genCodeAt: {
    type: Date,
    default: null
  },
  deleteAt: {
    type: Date,
    default: null
  },
}, { timestamps: true });

const User = mongoose.model('User', Userschema)

module.exports = User;