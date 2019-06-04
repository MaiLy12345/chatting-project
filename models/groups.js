const { mongoose } = require('./index.js');
const groupSchema = new mongoose.Schema({
    author: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    type: {
        type: String,
        enum: ['individual', 'group'],
        default: 'individual',
        required: true 
    },
    name: {
        type: String,
        unique: true
    },
    deleteAt: {
        type: Date
    }

}, {timestamps: true});
const Group = mongoose.model('Group', groupSchema);
module.exports = Group;