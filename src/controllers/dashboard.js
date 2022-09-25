const { 
    pCountByUser, 
    pTotalPriceByStatus, 
    pTotalPriceBySources,
    pCountByDate,
    pCountByPreparation,
    pCountBySources
} = require('../utils/helpers-func');
const { errMsgFor500 } = require('../utils/statusMessages');
const Order = require('../models/order');
const DeliveryDetails = require('../models/deliveryDetails');
const startEndDate = require('../utils/startEndDate');

const dOrdersController = async (req, res) => {
    try {
        const { startDate, endDate } = startEndDate(req.query);
        const findByDate = startDate && endDate ? { date: { $gte: startDate, $lte: endDate } } : {};
        const filter = {
            isVerified: true, 
            isDeleted: {$in: [false, undefined]},
            sourceId: { $type: 'objectId' }, 
            ...findByDate
        }
        const orders = await Order
        .find(filter)
        .populate('regionId sourceId')
        .select('source sourceId regionId totalPrice');

        res.status(200).json(orders);
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const dOrdersStatusesCountController = async (req, res) => {
    try {
        const { startDate, endDate } = startEndDate(req.query);
        const findByDate = startDate && endDate ? { date: { $gte: startDate, $lte: endDate } } : {};
        const ordersCount = await Order.aggregate([
            { $match: {...findByDate, isDeleted: {$in: [false, undefined]}} },
            { $group: {_id: '$status', count: {$sum: 1}} },
            { $sort: { _id: 1} }
        ]);
        res.status(200).json(ordersCount);
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const dCountByUserController = async (req, res) => {
    try {
        const { skip, limit } = req.query;
        const { startDate, endDate } = startEndDate(req.query);
        const operators = await Order.aggregate(pCountByUser(startDate, endDate, Number(skip), Number(limit)));
        res.status(200).json({ operators });
    } catch (e) {
        console.log(e);
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const dCountByUserCourierController = async (req, res) => {
    try {
        const { skip, limit } = req.query;
        const { startDate, endDate } = startEndDate(req.query);
        const couriers = await DeliveryDetails.aggregate(pCountByUser(startDate, endDate, skip, limit, 'delivered'));
        res.status(200).json({ couriers });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const dTotalPriceByStatusController = async (req, res) => {
    try {
        const { startDate, endDate } = startEndDate(req.query);
        const statuses = await Order.aggregate(pTotalPriceByStatus(startDate, endDate));
        res.status(200).json({ statuses });
    } catch (e) {
        console.log(e);
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const dTotalPriceBySourcesController = async (req, res) => {
    try {
        const { sourceId, city } = req.query;
        const { startDate, endDate } = startEndDate(req.query);
        const totalPriceBySources = await Order.aggregate(pTotalPriceBySources(startDate, endDate, sourceId, city));
        res.status(200).json(totalPriceBySources[0] && totalPriceBySources[0].total);
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const dCountBySourcesController = async (req, res) => {
    try {
        const { startDate, endDate } = startEndDate(req.query);
        const sourcesCount = await Order.aggregate(pCountBySources(startDate, endDate));
        res.status(200).json(sourcesCount);
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 })
    }
};

const dCountByDateController = async (req, res) => {
    try {
        const { userId, preparationId } = req.query;
        const { startDate, endDate } = startEndDate(req.query);
        const preparations = await Order.aggregate(pCountByDate(startDate, endDate, userId, preparationId));
        res.status(200).json(preparations);
    } catch (e) {
        console.log(e);
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const dCountByPreparationController = async (req, res) => {
    try {
        const { userId } = req.query;
        const { startDate, endDate } = startEndDate(req.query);
        const preparations = await Order.aggregate(pCountByPreparation(startDate, endDate, userId));
        res.status(200).json(preparations);
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

module.exports = {
    dOrdersController,
    dOrdersStatusesCountController,
    dCountByUserController,
    dCountByUserCourierController,
    dTotalPriceByStatusController,
    dTotalPriceBySourcesController,
    dCountBySourcesController,
    dCountByDateController,
    dCountByPreparationController
}