const BaseRepository = require('./base-repository');
const Message = require('../models/messages');
const Group = require('../models/groups');
module.exports = class MessageRepository extends BaseRepository {
    constructor(){
        super(Message);
    }
}