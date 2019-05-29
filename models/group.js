const { mongoose } = require('./index');

const Groupchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    members: 
    [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
    
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
      },
      type: {
        type: String,
        enum : ['individual','group'],
        default: 'individual'
    },
    name:{
        type: String,
        required: true
    }
 }, { timestamps: true })

const Group = mongoose.model('Group', Groupchema)

module.exports = Group;