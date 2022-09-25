const { validationResult } = require('express-validator');
const { errMsgFor500 } = require('../utils/statusMessages');
const todayDate = require('../utils/todayDate');
const Task = require('../models/task');

const addTaskController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({
                errorMessage: 'Вы не прошли валидацию',
                errors: errors.array()
            })

        const { _id: managerId } = req.user;
        await (new Task({...req.body, managerId})).save()
        res.status(201).json({ successMessage: 'Успешно добавлено'})
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500})
    }
}

const getTasksByCurrentUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id } = req.user;
        const userId = id || _id;

        const {date} = todayDate(); 
        const filter = {
            userId,
            start: {$lte: date},
            end: {$gte: date}
        }

        const tasks = await Task
        .find(filter)
        .populate('managerId', '-__v -password')
        .select('-__v')

        res.status(200).json(tasks)
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 })
    }
}

module.exports = {
    addTaskController,
    getTasksByCurrentUserController
}