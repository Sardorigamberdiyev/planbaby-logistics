const { isValidObjectId } = require('mongoose');
const { errMsgFor500 } = require('../utils/statusMessages');
const { msgErrorParse } = require('../utils/helpers-func');
const ManagerService = require('../services/manager');
const ControlStatement = require('../models/controlStatement');
const User = require('../models/user');

const managerService = new ManagerService(ControlStatement, User);

const getManagersOrByManagerIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id } = req.user;
        const managerId = id ? id : _id;

        const controlStatement = await ControlStatement
        .findOne({ managerId })
        .populate('operators');
        
        res.status(200).json({ controlStatement });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const addManagerOrByMangerIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id } = req.user;
        const { operators } = req.body;
        const managerId = id && isValidObjectId(id) ? id : _id;

        await managerService.addOrEditManager(managerId, operators);
            
        res.status(201).json({ successMessage: 'Успешно добавлено' });
    } catch (e) {
        const { msg, status } = msgErrorParse(e);
        res.status(status).json({ errorMessage: msg });
    }
};

const deleteOperatorFromManagerController = async (req, res) => {
    try {
        const { managerId, operatorId } = req.params;

        await managerService.deleteOperatorFromManager(managerId, operatorId);
        
        res.status(200).json({ successMessage: 'Успешно удалено' });
    } catch (e) {
        const { msg, status } = msgErrorParse(e);
        res.status(status).json({ errorMessage: msg });
    }
};

module.exports = {
    getManagersOrByManagerIdController,
    addManagerOrByMangerIdController,
    deleteOperatorFromManagerController
}