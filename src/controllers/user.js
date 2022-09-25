const { errMsgFor500 } = require('../utils/statusMessages');
const { validationResult } = require('express-validator');
const { forAdminRoles } = require('../utils/variables');
const ControlStatement = require('../models/controlStatement');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const getAboutUserController = async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const filter = {
            _id: userId, 
            isDeleted: {$in: [false, undefined]}
        };
        const user = await User.findOne(filter);
        res.status(200).json({ user });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getUserByNameController = async (req, res) => {
    try {
        const { term } = req.query;
        const { _id: managerId } = req.user;

        const { operators } = await ControlStatement
        .findOne({managerId})
        .select('-__v');

        const filter = {
            _id: {$in: operators},
            $or: [
                { firstName: {$regex: `${term}`} }, 
                { lastName: {$regex: `${term}`} }, 
                { phone: {$regex: `${term}`} }
            ], 
            role: 'operator',
            isDeleted: {$in: [false, undefined]}
        };

        const users = await User
        .find(filter)
        .select('-__v -password');

        res.status(200).json(users)
    } catch (e) {
        console.log(e);
        res.status(500).json({ errorMessage: errMsgFor500 })
    }
};

const getUsersAllContrller = async (req, res) => {
    try {
        const { role: currentUserRole } = req.user;
        const { byRole } = req.query;
        const pipelinePushUser = {
            _id: "$_id",
            firstName: "$firstName",
            lastName: "$lastName",
            login: "$login",
            role: "$role",
            phone: "$phone",
            regionId: "$regionId"
        };

        const pipelineAdditionalPushUser = {
            _id: "$_id",
            firstName: "$firstName",
            lastName: "$lastName",
            login: "$login",
            phone: "$phone",
            role: "$role"
        }

        const additionalPipelineByRole = byRole === 'courier' ? [
            { $group: { _id: "$regionId", couriers: { $push:  pipelineAdditionalPushUser } } }, 
            { $lookup: { from: 'regions', localField: '_id', foreignField: '_id', as: 'regionId' } },
            { $unwind: { path: '$regionId' } } ] : [];

        const filterIsDeleted = {isDeleted: {$in: [false, undefined]}}
        const matchByRole = currentUserRole === 'admin' ? { role: { $in: forAdminRoles }, ...filterIsDeleted } : {...filterIsDeleted};
        
        const pipeline = byRole ? [{ $match: { role: byRole, ...filterIsDeleted } }, ...additionalPipelineByRole] : [
            { $match: { ...matchByRole } },
            { $sort: { firstName: 1 } }, 
            { $group: { _id: "$role", users: { $push: pipelinePushUser } } }, 
            { $sort: { _id: 1 }}];

        const users = await User.aggregate(pipeline);

        res.status(200).json({ users });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getUserByIdController = (req, res) => {
    const { id: userId } = req.params;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).json({ errorMessage: errMsgFor500 });
        res.status(200).json({ user });
    });
};

const getUserByRoleManagerController = async (req, res) => {
    try {
        const managers = await User.find({ role: 'manager', isDeleted: {$in: [false, undefined]} });
        res.status(200).json({ managers });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getOperatorController = async (req, res) => {
    try {
        const pipeline = [
            { 
                $group: {
                    _id: 'operators',
                    operators: { $push: '$operators' }
                } 
            }, 
            {
                $project: {
                    operatorsIds: {
                        $reduce: {
                            input: '$operators',
                            initialValue: [],
                            'in': { $concatArrays: ['$$value', '$$this'] }
                        }
                    }
                }
            }
        ];

        const operatorsIds = (await ControlStatement.aggregate(pipeline))[0]?.operatorsIds;
        const filter = { _id: { $nin: operatorsIds }, role: 'operator', isDeleted: {$in: [false, undefined]} };
        const operators = await User.find(filter);

        res.status(200).json({ operators });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getCourierByRegionController = (req, res) => {
    const { regionId } = req.params;
    User.find({ role: 'courier', regionId, isDeleted: {$in: [false, undefined]} }, (err, users) => {
        if (err) return res.status(500).json({ errorMessage: 'Что-то пошло не так, попробуйте чуть позже' });
        res.status(200).json({ users });
    });
};

const editUserController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            return res.status(400).json({ errors: errors.array(), errorMessage: 'Вы не прошли валидацию' });

        const { id } = req.params;
        const { firstName, lastName, login, phone, role, regionId, password } = req.body;

        const user = await User.findById(id);
        const candidate = await User.findOne({ login });

        if ((user.login !== login) && candidate) 
            return res.status(400).json({ errorMessage: 'Уже существует пользователь с таким именем' });

        const hashPassword = await bcrypt.hash(password, 12);

        user.firstName = firstName;
        user.lastName = lastName;
        user.login = login;
        if (password) 
            user.password = hashPassword;
        user.phone = phone;
        user.role = role;
        if (role === 'courier' && regionId) 
            user.regionId = regionId;

        await user.save();
        res.status(200).json({ successMessage: 'Данные пользователя изменены' });
    } catch (e) {
        res.status(500).json({ errorMessage: 'Что-то пошло не так, попробуйте чуть позже' });
    }
};

module.exports = {
    getAboutUserController,
    getUsersAllContrller,
    getUserByIdController,
    getUserByRoleManagerController,
    getOperatorController,
    getCourierByRegionController,
    editUserController,
    getUserByNameController
}