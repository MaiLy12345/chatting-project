const { mongoose } = require('./index');

const Messageschema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    group: {
        type: String,
        ref: 'Group'
    }
 }, { timestamps: true })

const Messages = mongoose.model('Messages', Messageschema)

module.exports = Messages;