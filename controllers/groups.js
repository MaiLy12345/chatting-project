const lodash = require('lodash');
const { groupRepository, userRepository } = require('../reponsitories')
const createGroup = async (req, res, next) => {
    try {
        const data = req.body;
        data.author = req.user._id;
        const setMembers = Array.from(new Set(data.members));
        const countUser = await userRepository.count({ where: { _id : setMembers } });
        if (countUser !== setMembers.length) {
            throw new Error('invalid member');
        }
        if (!setMembers.includes(data.author)) {
            setMembers.push(data.author);
        }
        data.members = setMembers;
        const newGroup = await groupRepository.create(data);
        return res.status(200).json({
            message: 'Create new group successfully',
            data: newGroup
        });
    } catch (e) {
        return next(e);
    }
}

const inviteGroup = async (req, res, next) => {
    try {
        const { id } = req.params;
        const invitingGroup = await groupRepository.updateOne({ where: {_id: id, members: req.user._id}, data: { $addToSet : { members: req.body.members }}});
        if (invitingGroup.nModified === 0) {
            return next(new Error('member is existed or invalid'));
        }   
        return res.status(200).json({
            message: 'Invite successfully'
        });
    } catch (e) {
        return next(e);
    }
} 
const leaveGroup = async (req, res, next) => {
    const { id } = req.params;
    const existGroup = await groupRepository.getOne({ where: { _id: id, members: req.user._id} });
    if (!existGroup) {
        return next(new Error('Group is not existed'));
    }
    const leavingGroup = await groupRepository.updateOne({ where: { _id: id }, data: { $pull: { members: req.user._id }}});
    if (leavingGroup.nModified === 0) {
        return next(new Error('Group is not existed'));
    }
    return res.status(200).json({
        message: 'Leave group sucessfully'
    })
}
const getGroup = async (req, res, next) => {
    try {
        const { id } = req.params;
        const group = await groupRepository.getOne({ where: { _id: id, members: req.user._id }, populate: [
            {
                path: 'members author',
                select: 'username'
            },
            {
                path: 'lastMessage',
                select: 'author content',
                populate: {
                    path: 'author',
                    select: 'username'
                }
            }
        ]});
        if (!group) {
            return next(new Error('NOT_FOUND_GROUP'));
        }
        return res.status(200).json({
            message: 'Info Group',
            group
        });
    } catch (e) {
        return next(e);
    }
    
}
const getListGroup = async (req, res, next) => {
    try {
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        const user = req.user._id;
        const listGroup = await groupRepository.getAll({ where: { members: user }, populate: [
            {
                path: 'members author',
                select: 'username'
            },
            {
                path: 'lastMessage',
                select: 'author content',
                populate: {
                    path: 'author',
                    select: 'username'
                }
            }     
        ], page, limit});
        if (!listGroup) {
            return res.status(200).json({
                message: 'Currently, You have not joined any group',
                listGroup
            });
        }
        return res.status(200).json({
            message: 'List Group',
            listGroup
        });
    } catch (e) {
        return next(e);
    }
}
const deleteGroup = async (req, res, next) => {
    try {
        const { id } = req.params;
        const loginAuthor = req.user._id;
        const existGroup = await groupRepository.getOne({ where: { _id: id }, select: 'author'});
        if (!existGroup) {
            return next(new Error('GROUP_NOT_FOUND'));
        }
        await groupRepository.deleteOne({ where: { _id: id }});
        return res.status(200).json({ 
            message: 'Delete group successfully ',
            deletedGroup: existGroup
        });
    } catch (e) {
        return next(e);
    }
}
const updateGroup = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = lodash.pick(req.body, ['author', 'name', 'lastMessage', 'type']); // omit
        const author = req.user._id;
        let existGroup = await groupRepository.getOne({ where: { _id: id }, select: 'author' });
        if (!existGroup) {
            return next(new Error('Group is not found'));
        }
        if (JSON.stringify(existGroup.author)!== JSON.stringify(author)) {
            return next(new Error('Group can not update'));
        }
        if (author) {
            const existUser = await groupRepository.getOne({ where: { _id: id, members: author }}).lean();
            if (!existUser) {
                return next(new Error('You does have access update'));
            }
        }
        const newValues = { $set: data };
        await groupRepository.updateOne({ where: { _id: id } , data : newValues } ).lean();
        return res.status(200).json({
            message: 'Update Group successfully'
        });
    } catch (e) {
        return next(e);
    }
    
}
module.exports = {
    createGroup,
    getGroup,
    getListGroup,
    deleteGroup,
    updateGroup,
    inviteGroup,
    leaveGroup
}