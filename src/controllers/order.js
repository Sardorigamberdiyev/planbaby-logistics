const { errMsgFor500 } = require('../utils/statusMessages');
const { validationResult } = require('express-validator');
const { populateOrder } = require('../utils/variables');
const { msgErrorParse } = require('../utils/helpers-func');
const mongoose = require('mongoose');
const startEndDate = require('../utils/startEndDate');
const Order = require("../models/order");
const History = require('../models/history');
const Failured = require('../models//failured');
const Verified = require('../models/verified');
const ControlStatement = require('../models/controlStatement');
const OrderService = require('../services/order');

const orderService = new OrderService(Order, History, Failured, Verified, ControlStatement);

const getOrdersController = async (req, res) => {
    try {
        const { districtsId, term, status, skip, limit } = req.query;
        const { startDate, endDate } = startEndDate(req.query);
        const { verified, verifiedLength } = await orderService.getOrders(districtsId, term, status, skip, limit, startDate, endDate);

        res.status(200).json({ verified, verifiedLength });
    } catch (error) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    };
};

const getOrdersAllStatisticsController = async (req, res) => {
    try {
        const { districtsId, status } = req.query;
        const { startDate, endDate } = startEndDate(req.query);

        const statistics = await orderService.getOrdersAllStatistics(districtsId, status, startDate, endDate);

        res.status(200).json({ statistics })
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 })
    }
}

const checkOrderController = async (req, res) => {
    try {
        const { term, skip, limit } = req.query;

        const { check, checkLength } = await orderService.checkOrders(term, skip, limit);

        res.status(200).json({ check, checkLength });
    } catch (error) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    };
};

const managerStatisticsOrByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id } = req.user;
        const managerId = id ? id : _id;

        const {
            order, 
            todayMonth
        } = await orderService.managerStatistics(managerId);

        res.status(200).json({ order, todayMonth });
    } catch (e) {
        console.log(e);
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const managerOrByIdController = async (req, res) => {
    try {
        const { districtsId, term, skip, limit } = req.query;
        const { id } = req.params;
        const { _id } = req.user;
        const managerId = id ? id : _id;
        const { startDate, endDate } = startEndDate(req.query);

        const { 
            orders, 
            ordersLength 
        } = await orderService.managerOrdersOrById(managerId, districtsId, term, skip, limit, startDate, endDate);

        res.status(200).json({ orders, ordersLength });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const orderStatisticsOrByUserIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id } = req.user;
        const userId = id ? id : _id;
        const { startDate, endDate } = startEndDate(req.query);
        const dateFilter = startDate && endDate ? {date: { $gte: startDate, $lte: endDate }} : {};
        const populate = [
            { $match: { 
                isVerified: true,
                isDeleted: {$in: [false, undefined]},
                userId: mongoose.Types.ObjectId(userId), 
                ...dateFilter
            } },
            { $group: { _id: "$status", cms: { $sum: "$totalPrice" }, maxCount: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ];

        const order = await Order.aggregate(populate);

        res.status(200).json({ order });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const orderSearchController = async (req, res) => {
    try {
        const { term } = req.query;
        const filter = { code: { $regex: `^${term}`, isVerified: true }};
        const orders = await Order.find(filter);
        res.status(200).json({ orders });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    } 
};

const ordersByUserOrByUserIdController = async (req, res) => {
    try {
        const { skip, limit, districtsId, term, status } = req.query;
        const { id } = req.params;
        const { _id } = req.user;
        const userId = id ? id : _id;
        const { startDate, endDate } = startEndDate(req.query);

        const {
            orders, 
            ordersLength
        } = await orderService.ordersByUserOrByUserId(userId, skip, limit, districtsId, term, status, startDate, endDate);
        
        res.status(200).json({orders, ordersLength});
    } catch (error) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    };
};

const orderByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order
        .findById(id)
        .populate(populateOrder, '-password');

        res.status(200).json({ order });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const addOrderController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            return res.status(400).json({ errors: errors.array(), errorMessage: 'Вы не прошли ваиладцию' });

        const { _id: userId } = req.user;

        await orderService.addOrder(userId, req.body);

        res.status(201).json({ successMessage: 'Заказ принято' })
    } catch (e) {
        const {msg, status} = msgErrorParse(e);
        res.status(status).json({ errorMessage: msg });
    }
};

const recoverySendTelegramController = async (req, res) => {
    try {
        const { orderId } = req.body;

        await orderService.recoverySendTg(orderId);

        res.status(200).json({ successMessage: 'Успешно отправлено' });
    } catch (e) {
        res.status(500).json({ errorMessage: 'Что-то пошло не так, попробуйте чуть позже' });
    }
};

const orderBackStatusController = async (req, res) => {
    try {
        const { _id: cUserId } = req.user;
        const { orderId } = req.params;

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await orderService.orderBackStatus(session, cUserId, orderId);
            await session.commitTransaction();
            res.status(200).json({successMessage: 'Успешно выполнено'});
        } catch (e) {
            await session.abortTransaction();
            const { msg, status } = msgErrorParse(e);
            res.status(status).json({ errorMessage: msg });
        }
        session.endSession();
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 })
    }
}

const editOrderController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            return res.status(400).json({ errors: errors.array(), errorMessage: 'Вы не прошли ваиладцию' });

        const { params: { id }, body } = req;
        const { _id: cUserId } = req.user;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await orderService.editOrder(session, cUserId, id, body);
            await session.commitTransaction();
            res.status(200).json({ successMessage: 'Updated' });
        } catch (e) {
            await session.abortTransaction();
            const { msg, status } = msgErrorParse(e);
            res.status(status).json({ errorMessage: msg });
        }
        session.endSession();
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const gprinterController = async (req, res) => {
    try {
        const { orderId } = req.params;

        await orderService.gprinter(orderId);

        res.status(200).json({ successMessage: 'Успешно изменено' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const orderVerifiedController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { _id: cUserId } = req.user;
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await orderService.orderVerified(session, cUserId, orderId);
            await session.commitTransaction();
            res.status(200).json({ successMessage: 'Успешно выполнено' });
        } catch (err) {
            const { msg, status } = msgErrorParse(err);
            await session.abortTransaction();
            res.status(status).json({ errorMessage: msg });
        }
        
        session.endSession();
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
}

const orderOfficeSuccessController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { _id: cUserId } = req.user;
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await orderService.orderOfficeSuccess(session, cUserId, orderId);
            await session.commitTransaction();
            res.status(200).json({ successMessage: 'Успешно выполнено' });
        } catch (e) {
            const { msg, status } = msgErrorParse(e);
            await session.abortTransaction();
            res.status(status).json({ errorMessage: msg });
        }

        session.endSession();
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
}

const orderSuccessController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { _id: cUserId } = req.user;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await orderService.orderSuccess(session, cUserId, orderId);
            await session.commitTransaction();
            res.status(200).json({successMessage: 'Успешно выполнено'})
        } catch (e) {
            await session.abortTransaction();
            const { msg, status } = msgErrorParse(e);
            res.status(status).json({errorMessage: msg})
        }
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 })
    }
}

const orderFailureController = async (req, res) => {
    try {
        const { comment } = req.body;
        const { orderId } = req.params;
        const { _id: cUserId } = req.user;

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await orderService.orderFailure(session, cUserId, comment, orderId);
            await session.commitTransaction();
            res.status(200).json({ successMessage: 'Успешно выполнено' });
        } catch (e) {
            await session.abortTransaction();
            const { msg, status } = msgErrorParse(e);
            res.status(status).json({ errorMessage: msg});
        }
        session.endSession()
    } catch (e) {
        res.status(500).json({ errorMessage: 'Что-то пошло не так повторите заного'});
    }
};

const orderDeleteController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { _id: userId } = req.user;

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await orderService.orderDelete(session, userId, orderId)
            await session.commitTransaction();
            res.status(200).json({ successMessage: 'Успешно удалено' });
        } catch (err) {
            const { msg, status } = msgErrorParse(err);
            await session.abortTransaction();
            res.status(status).json({ errorMessage: msg });
        }
        session.endSession();
    } catch (error) {
        res.status(500).json({ errorMessage: 'Что то пошло не так, попробуйте заного' });
    };
};

module.exports = {
    getOrdersController,
    checkOrderController,
    managerStatisticsOrByIdController,
    managerOrByIdController,
    orderStatisticsOrByUserIdController,
    orderSearchController,
    ordersByUserOrByUserIdController,
    orderByIdController,
    addOrderController,
    recoverySendTelegramController,
    editOrderController,
    gprinterController,
    orderFailureController,
    orderDeleteController,
    getOrdersAllStatisticsController,
    orderSuccessController,
    orderOfficeSuccessController,
    orderVerifiedController,
    orderBackStatusController
}