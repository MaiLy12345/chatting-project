const Message = require('../models/messages');
const Group = require('../models/group')
exports.create = async (req, res, next) => {
    try {
        const author = req.user._id;
        const { content, group } = req.body;
        const ismember = await Group.find(). where({ _id: group, members: author}).select('name')
        console.log(ismember)
        if (!ismember.length) {
            return next(new Error('User does not exist in this group!'));
        }
        const messages = await Message.create({ author, content, group});
        await messages.save();
        return res.status(200).json({
            message: 'Create new messages successfully',
            messages
        });
    } catch (e) {
        return next(e);
    }
};
//?///