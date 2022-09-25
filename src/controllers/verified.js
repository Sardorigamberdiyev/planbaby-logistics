const { errMsgFor500 } = require('../utils/statusMessages');
const { pPriceQuantity, msgErrorParse } = require('../utils/helpers-func');
const VerifiedService = require('../services/verified');
const mongoose = require('mongoose');
const todayDate = require('../utils/todayDate');
const startEndDate = require('../utils/startEndDate');
const Order = require('../models/order');
const Verified = require('../models/verified');
const History = require('../models/history');

const verifiedService = new VerifiedService(Verified, Order, History);

const getVerifiedsController = async (req, res) => {
    try {
        const { skip, limit, condition } = req.query;
        const { startDate, endDate } = startEndDate(req.query);

        const { 
            orders, 
            ordersLength, 
            typeOrder 
        } = await verifiedService.getVerified(condition, skip, limit, startDate, endDate);

        const jsonData = {
            orders, 
            typeOrder,
            ordersLength
        }
        
        res.status(200).json(jsonData);
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getVerifiedsByDistrictController = async (req, res) => {
    try {
        const { skip, limit, districtsId, condition } = req.query;
        const { startDate, endDate } = startEndDate(req.query);

        const { 
            verifieds, 
            verifiedsLength, 
            typeOrder 
        } = await verifiedService.getVerifiedByDistrict(condition, skip, limit, districtsId, startDate, endDate);

        const jsonData = {
            typeOrder,
            ordersLength: verifiedsLength, 
            orders: verifieds, 
        };

        res.status(200).json(jsonData);
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getVerifiedsByCodeController = async (req, res) => {
    try {
        const { term, typeCondition } = req.query;

        const { verifieds } = await verifiedService.getVerifiedByCode(term, typeCondition);

        res.status(200).json({ orders: verifieds, typeOrder: typeCondition });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500});
    }
};

const getVerifiedsAllStatisticsController = async (req, res) => {
    try {
        const { districtsId, condition } = req.query;
        const { startDate, endDate } = startEndDate(req.query);

        const isFromWarehouse = condition === 'from_warehouse';
        const dateKey = isFromWarehouse ? 'shipmentDateFromWarehouse' : 'date';

        const dateFilter = startDate && endDate ? { [dateKey]: { $gte: startDate, $lte: endDate } } : {};
        const findOption = { condition, ...dateFilter };

        const statistics = (await Verified.aggregate(pPriceQuantity(findOption, districtsId)))[0];

        res.status(200).json({ statistics });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getVerifiedsStatisticsController = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id } = req.user;
        const userId = id ? id : _id;

        const { startDate, endDate } = startEndDate(undefined, true);
        const populate = [
            { $match: { 
                userId: mongoose.Types.ObjectId(userId), 
                date: { $gte: startDate, $lte: endDate } 
            } },
            { $group: { _id: "$userId", count: { $sum: 1 } } }
        ];

        const verifieds = (await Verified.aggregate(populate))[0];

        const { month } = todayDate();

        res.status(200).json({ verifieds, todayMonth: month });
    } catch (e) {
        console.log(e);
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getVerifiedByUserIdController = async (req, res) => {
    try {
        const { skip, limit, districtsId, term } = req.query;
        const { id } = req.params;
        const { _id } = req.user;
        const userId = id ? id : _id;
        const { startDate, endDate } = startEndDate(req.query);

        const {
            verifieds,
            verifiedsCount
        } = await verifiedService.getVerifiedByUserId(userId, term, skip, limit, districtsId, startDate, endDate);

        res.status(200).json({ verifieds, verifiedsCount });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

module.exports = {
    getVerifiedsController,
    getVerifiedsByDistrictController,
    getVerifiedsByCodeController,
    getVerifiedsAllStatisticsController,
    getVerifiedsStatisticsController,
    getVerifiedByUserIdController
}