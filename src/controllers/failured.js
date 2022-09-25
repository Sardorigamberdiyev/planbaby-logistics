const { errMsgFor500 } = require('../utils/statusMessages');
const mongoose = require('mongoose');
const startEndDate = require('../utils/startEndDate');
const Failured = require('../models/failured');
const Order = require('../models/order');
const History = require('../models/history');
const FailuredService = require('../services/failured');

const failuredService = new FailuredService(Failured, Order, History);

const getFailuredsController = async (req, res) => {
    try {
        const { skip, limit } = req.query;
        const { startDate, endDate } = startEndDate(req.query);

        const { 
            orders, 
            ordersLength 
        } = await failuredService.getFailureds(skip, limit, startDate, endDate);

        const jsonData = {
            orders,
            ordersLength,
            typeOrder: 'failureds'
        }

        res.status(200).json(jsonData);
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getFailuredsByDistrictsController = async (req, res) => {
    try {
        const { skip, limit, districtsId } = req.query;
        const { startDate, endDate } = startEndDate(req.query);

        const {
            failureds,
            ordersLength
        } = await failuredService.getFailuredsByDistricts(skip, limit, districtsId, startDate, endDate);

        const jsonData = {
            ordersLength, 
            orders: failureds, 
            typeOrder: 'failureds'
        };

        res.status(200).json(jsonData);
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getFailuredsByCodeController = async (req, res) => {
    try {
        const { term } = req.query;

        const failureds = await failuredService.getFailuredsByCode(term);

        res.status(200).json({ orders: failureds, typeOrder: 'failureds' });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getFailuredsStatisticsController = async (req, res) => {
    try {
        const { districtsId } = req.query;
        const { startDate, endDate } = startEndDate(req.query);

        const statistics = await failuredService.getFailuredsStatistics(districtsId, startDate, endDate);

        res.status(200).json({ statistics });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const deleteFailuredController = async (req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id: failuredId } = req.params;
            const { _id: userId } = req.user;

            await failuredService.deleteFailured(session, userId, failuredId);

            await session.commitTransaction();
            res.status(200).json({ successMessage: 'Успешно удалено' });
        } catch (err) {
            await session.abortTransaction();
            res.status(500).json({ errorMessage: errMsgFor500 })
        }
        session.endSession();
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

module.exports = {
    getFailuredsController,
    getFailuredsByDistrictsController,
    getFailuredsByCodeController,
    getFailuredsStatisticsController,
    deleteFailuredController
}