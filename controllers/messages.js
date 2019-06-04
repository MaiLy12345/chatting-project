const { messageRepository, groupRepository  } = require('../reponsitories')
const sendMessage = async (req, res, next) => {
    try {
        const data = req.body;
        const loginAuthor = req.user._id;
        const existGroup = await groupRepository.getOne({where: {_id: data.group, members: loginAuthor}});
        if (!existGroup) {
            return next(new Error('NOT_EXISTED_GROUP')); 
        }
        data.author = loginAuthor;
        const sendMessage = await messageRepository.create(data);
        await groupRepository.updateOne( { where: { _id: data.group }, data: { lastMessage: sendMessage._id }});
        return res.status(200).json({
            message: 'Send Message successfully',
            sendMessage
        });
    } catch (e) {
        return next(e);
    }
}
const getMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const message = await messageRepository.getOne({where: { _id: id }, populate: { path: 'author', select: 'username'}});
        if (!message) {
            return next(new Error('NOT_EXISTED_MESSAGE'));
        }
        return res.status(200).json({
            message: 'message ',
            message
        });
    } catch (e) {
        return next(e);
    }
}
const getListMessage = async (req, res, next) => {
    try {
        let page= parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        const messages = await messageRepository.getAll({ populate: { path: 'author', select: 'username'}, limit, page });
        return res.status(200).json({
            message: 'List Message ',
            messages
        });   
    } catch (e) {
        return next(e);
    }
}
const getListMessageOfGroup = async (req, res, next) => {
    try {
        const author = req.user._id;
        const { id } = req.params;
        let page= parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        const existGroup = groupRepository.getOne({where: { _id: id, members: author}, select: '_id'});
        if (!existGroup) {
            return next(new Error('NOT_EXISTED_GROUP'));
        }
        const messages = await messageRepository.getAll({ where : { group : id }, select: 'content author createdAt', populate: {
            path: 'author',
            select: 'username'
        }, sort: {'createAt': -1}, limit, page });
        return res.status(200).json({
            message: 'List Message ',
            messages
        });   
    } catch (e) {
        return next(e);
    }
}
const deleteMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        await messageRepository.deleteOne({ where: { _id: id, author: req.user._id }, data: {$set: { deleteAt: new Date() }} });
        return res.status(200).json({
            message: 'Delete Group successfully'
        });
    } catch (e) {
        return next(e);
    }
}
const updateMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        await messageRepository.updateOne({ where: { _id: id, }, data: { content } });
        return res.status(200).json({
            message: 'Update successfully'
        })
    } catch (e) {
        return next(e);
    }
}
module.exports = {
    sendMessage,
    getListMessage,
    getMessage,
    deleteMessage,
    getListMessageOfGroup,
    updateMessage
}