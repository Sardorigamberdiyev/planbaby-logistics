const { msgErrorParse } = require('../utils/helpers-func');
const { errMsgFor500 } = require('../utils/statusMessages');
const mongoose = require('mongoose');
const todayDate = require('../utils/todayDate');
const startEndDate = require('../utils/startEndDate');
const DeliveryDetails = require('../models/deliveryDetails');
const User = require('../models/user');
const Order = require('../models/order');
const Verified = require('../models/verified');
const Failured = require('../models/failured');
const DeliveryService = require('../services/deliveryDetails');
const History = require('../models/history');

const deliveryService = new DeliveryService(DeliveryDetails, User, Order, Verified, Failured, History);


const getDeliverysController = async (req, res) => {
    try {
        const { districtsId, term, skip, limit } = req.query;
        const { _id: userId } = req.user;
        const { startDate, endDate } = startEndDate(req.query);
        
        const { 
            deliverys, 
            deliveryLength 
        } = await deliveryService.getDeliverys(userId, districtsId, term, skip, limit, startDate, endDate);

        res.status(200).json({ deliverys, deliveryLength });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getAllDeliverysController = async (req, res) => {
    try {
        const { skip, limit, condition } = req.query;
        const { startDate, endDate } = startEndDate(req.query);

        const { 
            orders, 
            ordersLength 
        } = await deliveryService.getAllDeliverys(condition, skip, limit, startDate, endDate);

        const jsonData = {
            orders,
            ordersLength,
            typeOrder: 'deliverys'
        };

        res.status(200).json(jsonData);
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getAllDeliverysByDistrictContoller = async (req, res) => {
    try {
        const { skip, limit, districtsId, typeCondition } = req.query;
        const { startDate, endDate } = startEndDate(req.query);

        const {
            deliverys,
            ordersLength
        } = await deliveryService.getAllDeliverysByDistrict(typeCondition, districtsId, skip, limit, startDate, endDate);

        const jsonData = {
            ordersLength, 
            orders: deliverys, 
            typeOrder: typeCondition
        };

        res.status(200).json(jsonData);
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getAllDeliverysByCodeController = async (req, res) => {
    try {
        const { term, typeCondition } = req.query;
        
        const deliverys = await deliveryService.getAllDeliverysByCode(typeCondition, term);

        res.status(200).json({ orders: deliverys, typeOrder: typeCondition });
    } catch (e) {
        console.log(deliverys);
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getAllDeliverysStatisticsController = async (req, res) => {
    try {
        const { districtsId, condition } = req.query;
        const { startDate, endDate } = startEndDate(req.query);

        const statistics = await deliveryService.getAllDeliverysStatistics(condition, districtsId, startDate, endDate);
        
        res.status(200).json({ statistics });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getStatisticsOrByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id } = req.user;
        const userId = id ? id : _id;
        
        const { startDate, endDate } = startEndDate(undefined, true);
        const { month } = todayDate();
        const pipeline = [
            { $match: { 
                userId: mongoose.Types.ObjectId(userId), 
                date: { 
                    $gte: startDate, 
                    $lte: endDate 
                } 
            } },
            { $group: { 
                _id: '$condition', 
                count: { $sum: 1 } 
            } }
        ]

        const deliverys = await DeliveryDetails.aggregate(pipeline);

        res.status(200).json({ deliverys, todayMonth: month });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getByIdUserDeliverysController = async (req, res) => {
    try {
        const { districtsId, term, skip, limit } = req.query;
        const { userId } = req.params;
        const { startDate, endDate } = startEndDate(req.query);

        const {
            deliverys,
            deliveryLength
        } = await deliveryService.getByIdUserDeliverys(userId, districtsId, term, skip, limit, startDate, endDate)

        res.status(200).json({ deliverys, deliveryLength });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const addDeliveryCourierController = async (req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { userId, orderId } = req.body;
            const { _id: cUserId } = req.user;

            await deliveryService.addDeliveryCourier(session, cUserId, userId, orderId);

            await session.commitTransaction();
            res.status(201).json({ successMessage: 'Успешно отправлен куреру' });
        } catch (err) {
            const { msg, status } = msgErrorParse(err);
            await session.abortTransaction();
            res.status(status).json({ errorMessage: msg });
        }
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const editDeliveryController = async (req, res) => {
    try {
        const { deliveryId } = req.params;
        const { comment, cash, card, debt } = req.body;
        const { _id: cUserId } = req.user;

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await deliveryService.editDelivery(session, cUserId, deliveryId, comment, cash, card, debt);

            await session.commitTransaction();
            res.status(200).json({ successMessage: 'Успешно изменено' });
        } catch (err) {
            await session.abortTransaction();
            res.status(500).json({ errorMessage: errMsgFor500 });
        }
        session.endSession();
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const failureDeliveryController = async (req, res) => {
    try {
        const { id: deliveryId } = req.params;
        const { orderId, comment } = req.body;
        const { _id: cUserId } = req.user;

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await deliveryService.failureDelivery(session, cUserId, deliveryId, orderId, comment);

            await session.commitTransaction();
            res.status(200).json({ successMessage: 'Успешно изменено' });
        } catch (err) {
            await session.abortTransaction();
            res.status(500).json({ errorMessage: errMsgFor500 });
        }
        session.endSession();
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

module.exports = {
    getDeliverysController,
    getAllDeliverysController,
    getAllDeliverysByDistrictContoller,
    getAllDeliverysByCodeController,
    getAllDeliverysStatisticsController,
    getStatisticsOrByIdController,
    getByIdUserDeliverysController,
    addDeliveryCourierController,
    editDeliveryController,
    failureDeliveryController
}