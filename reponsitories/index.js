const GroupRepository = require('./group-repository');
const MessageRepository = require('./message-repository');
const UserRepository = require('./user-repository');
console.log(GroupRepository);
console.log(UserRepository);
module.exports = {
    groupRepository: new GroupRepository(),
    messageRepository: new MessageRepository(),
    userRepository: new UserRepository()
}