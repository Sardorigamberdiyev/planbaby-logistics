const { Types: { ObjectId } } = require('mongoose');
const { populateOrder } = require('../utils/variables');
const { msgErrorStr } = require('../utils/helpers-func');
const sendTelegram = require('../utils/sendTelegram');
const todayDate = require('../utils/todayDate');

class OrderService {
    constructor(Order, History, Failured, Verified, ControlStatement) {
        this.Order = Order;
        this.History = History;
        this.Failured = Failured;
        this.Verified = Verified;
        this.ControlStatement = ControlStatement;
    }

    async getOrders(districtsId, term, status, skip, limit, startDate, endDate) {
        try {
            const skipValue = skip ? Number(skip) : 0;
            const limitValue = limit ? Number(limit) : 0;
            const districtFilter = districtsId ? { districtId: { $in: districtsId } } : {};
            const statusFilter = status ? { status } : {};
            const termFilter = term ? { code: { $regex: `${term}`}} : {};
            const dateFilter = startDate && endDate ? { lastStatusDate: { $gte: startDate, $lte: endDate } } : {};
            const filter = { isDeleted: {$in: [false, undefined]}, ...termFilter, ...statusFilter, ...districtFilter, ...dateFilter};

            const verified = await this.Order
            .find(filter)
            .skip(skipValue)
            .limit(limitValue)
            .sort({ lastStatusDate: -1 })
            .populate(populateOrder, "-password");

            const verifiedLength = await this.Order
            .find(filter)
            .countDocuments();

            return Promise.resolve({verified, verifiedLength});
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getOrdersAllStatistics(districtsId = [], status = null, startDate = null, endDate = null) {
        try {
            const dIds = districtsId.map((d) => ObjectId(d));
            const filterDistrictsId = dIds?.length ? {districtId: {$in: dIds}} : {};
            const filterDate = startDate && endDate ? {lastStatusDate: {$gte: startDate, $lte: endDate}} : {};
            const statusFilter = status ? {status} : {};
            const pipeline = [
                { $match: {
                    isDeleted: {$in: [false, undefined]},
                    ...filterDistrictsId, 
                    ...filterDate,
                    ...statusFilter
                }},
                { $group: {
                    _id: '$status',
                    count: {$sum: 1}, 
                    cms: {$sum: '$totalPrice'}
                }}
            ];
    
            const ordersStatistics = await this.Order.aggregate(pipeline);
            
            return Promise.resolve(status ? ordersStatistics[0] : ordersStatistics);
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async checkOrders(term, skip, limit) {
        try {
            const termFilter = term ? { code: { $regex: `^${term}` } } : {};
            const filter = {
                isDeleted: {$in: [false, undefined]},
                isVerified: false,
                ...termFilter
            }

            const check = await this.Order
            .find(filter)
            .populate(populateOrder)
            .skip(skip || 0)
            .limit(limit || 0)
            .sort({ date: -1 });

            delete filter.code;
            const checkLength = await this.Order
            .find(filter)
            .countDocuments();

            return Promise.resolve({check, checkLength})
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async managerStatistics(managerId) {
        try {
            const { month: todayMonth } = todayDate();

            const controlStatement = await this.ControlStatement.findOne({managerId});
            if (!controlStatement) 
                return Promise.resolve({order: [], todayMonth})
            
            const { operators } = controlStatement;
            const pipeline = [
                { $match: {
                    userId: {$in: operators} 
                } },
                { $group: { _id: '$status', cms: { $sum: '$totalPrice' }, maxCount: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ];

            const order = await this.Order.aggregate(pipeline);

            return Promise.resolve({order, todayMonth})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async managerOrdersOrById(managerId, districtsId, term, skip, limit, startDate, endDate) {
        try {
            const dateFilter = startDate && endDate ? { date: { $gte: startDate, $lte: endDate } } : {};
            const districtFilter = districtsId ? { districtId: { $in: districtsId } } : {};
            const codeFilter = term ? { code: { $regex: `${term}` } } : {};

            const controlStatement = await this.ControlStatement.findOne({ managerId });
            if (!controlStatement) 
                return Promise.resolve({orders: [], ordersLength: 0})
            
            const { operators } = controlStatement;

            const filter = {
                isDeleted: {$in: [false, undefined]},
                userId: { $in: operators }, 
                ...dateFilter, 
                ...districtFilter, 
                ...codeFilter
            };
            const orders = await this.Order
            .find(filter)
            .populate(populateOrder)
            .skip(skip)
            .limit(limit)
            .sort({date: -1})

            const ordersLength = await this.Order
            .find(filter)
            .countDocuments();

            return Promise.resolve({orders, ordersLength})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async ordersByUserOrByUserId(userId, skip, limit, districtsId, term, status, startDate, endDate) {
        try {
            const skipValue = skip ? Number(skip) : 0;
            const limitValue = limit ? Number(limit) : 0;
            const districtFilter = districtsId ? { districtId: { $in: districtsId } } : {};
            const statusFilter = status ? { status } : {};
            const termFilter = term ? { code: { $regex: `${term}`}} : {};
    
            const dateFilter = startDate && endDate ? { date: {$gte: startDate, $lte: endDate } } : {};
            const filter = { userId, ...dateFilter, ...districtFilter, ...statusFilter, ...termFilter, isDeleted: {$in: [false, undefined]} };
            
            const orders = await this.Order
            .find(filter)
            .skip(skipValue)
            .limit(limitValue)
            .sort({date: -1})
            .populate(populateOrder, "-password");
    
            const ordersLength = await this.Order
            .find(filter)
            .countDocuments();

            return Promise.resolve({orders, ordersLength})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async addOrder(userId, body) {
        try {
            const { firstName, lastName, address, plot, phones, products, code, payment, totalPrice, sourceId, comment, regionId, districtId } = body;

            const candidateFilter = { code, status: {$ne: 'office_failure'}, isDeleted: {$in: [false, undefined]} };
            const orderCandidate = await this.Order
            .findOne(candidateFilter);

            if (orderCandidate) 
                throw new Error(msgErrorStr('С таки кодом брон уже существует', 400))

            if (!comment.match(/^[A-Za-zА-Яа-я0-9\s\-]+$/) && comment.length !== 0) 
                throw new Error(msgErrorStr('Допустимые символы "A-Za-zА-Яа-я0-9"', 400))

            const { date } = todayDate();

            const newOrder = new this.Order({
                firstName,
                lastName,
                address,
                plot,
                phones,
                products,
                code,
                payment,
                totalPrice,
                sourceId,
                comment,
                userId,
                regionId,
                districtId,
                date,
                lastStatusDate: date
            });

            return newOrder.save();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async orderBackStatus(session, cUserId, orderId) {
        try {
            const filter = {_id: orderId, isDeleted: [false, undefined]};

            const order = await this.Order.findOne(filter);
            if (!order)
                throw new Error(msgErrorStr('Нет такого заказа', 404));

            const { date } = todayDate();
            
            const oldStatus = order.status;
            order.status = 'active';
            order.lastStatusDate = date;
            const {
                status: newStatus
            } = await order.save({session});
            const newHistory = {
                userId: cUserId,
                action: {actionType: 'back_status'},
                orderId,
                oldStatus,
                newStatus,
                date
            };

            await (new this.History(newHistory)).save({session});

            return Promise.resolve()
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async editOrder(session, cUserId, orderId, body) {
        try {
            const { firstName, lastName, address, plot, phones, products, code, payment, totalPrice, sourceId, comment, regionId, districtId } = body;

            const filterCandidate = { code, status: {$ne: 'office_failure'}, isDeleted: {$in: [false, undefined]} };
            const orderCandidate = await this.Order.findOne(filterCandidate);

            const filter = { _id: orderId, isDeleted: {$in: [false, undefined]} };
            const order = await this.Order.findOne(filter);

            if (!order)
                throw new Error(msgErrorStr('Нет такого заказа', 404))

            if (orderCandidate && order.code !== code) 
                throw new Error(msgErrorStr('Брон с таким id существует', 400))

            order.firstName = firstName;
            order.lastName = lastName;
            order.address = address;
            order.plot = plot;
            order.phones = phones;
            order.code = code;
            order.totalPrice = totalPrice;
            order.payment = payment;
            order.sourceId = sourceId;
            order.comment = comment;
            order.products = products;
            order.regionId = regionId;
            order.districtId = districtId || order.districtId;
            await order.save({session});

            const { date } = todayDate();
            const newHistory = {
                userId: cUserId,
                orderId: order._id,
                action: { actionType: 'edit_order' },
                date
            };
            await (new this.History(newHistory)).save({session});

            return Promise.resolve() 
        } catch (e) {
            console.log(e);
            return Promise.reject(e)
        }
    }

    async orderVerified(session, cUserId, orderId) {
        try {
            const filter = { _id: orderId, isDeleted: {$in: [false, undefined]} };

            const order = await this.Order
            .findOne(filter)
            .populate(populateOrder)
            .session(session);

            if (!order) 
                throw new Error(msgErrorStr('Нет такого заказа', 404))

            if (order.isVerified)
                throw new Error(msgErrorStr('Этот заказ уже подверждено', 400))

            const { date } = todayDate();
            
            const oldStatus = order.status;
            order.isVerified = true;
            order.status = 'active';
            order.lastStatusDate = date;
            const {
                status: newStatus
            } = await order.save({session});


            const newHistory = {
                orderId: order._id,
                action: { actionType: 'confirm' },
                userId: cUserId,
                oldStatus,
                newStatus,
                date
            }
            await (new this.History(newHistory)).save({session});
            
            const verified = new this.Verified({ orderId, userId: cUserId, date });
            await verified.save({session});

            sendTelegram(order)
            .then(() => console.log('sended true'))
            .catch(() => console.log('sended error'));

            return Promise.resolve()
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async orderOfficeSuccess(session, cUserId, orderId) {
        try {
            const { date } = todayDate();

            const filter = {_id: orderId, isDeleted: {$in: [false, undefined]}};
            const order = await this.Order
            .findOne(filter)
            .session(session);

            if (!order)
                throw new Error(msgErrorStr('Нет такого заказа', 404))

            if (!order.gprinter) 
                throw new Error(msgErrorStr('Вы не использовали Gprinter', 400))
            
            const oldStatus = order.status;
            order.status = 'office_success';
            order.lastStatusDate = date;
            const { 
                status: newStatus
            } = await order.save({session});
            const newHistory = {
                orderId: order._id,
                userId: cUserId,
                action: { actionType: 'office_finish' },
                oldStatus,
                newStatus,
                date
            };
            await (new this.History(newHistory)).save({session});
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async orderSuccess(session, cUserId, orderId) {
        try {
            const filter = {_id: orderId, isDeleted: {$in: [false, undefined]}};
            const order = await this.Order.findOne(filter);
            
            if (!order)
                throw new Error(msgErrorStr('Нет такого заказа', 404))

            if (!order.gprinter)
                throw new Error(msgErrorStr('Вы не использовали gprinter', 400))
            
            const { date } = todayDate();

            const oldStatus = order.status;
            order.status = 'delivered_success';
            order.lastStatusDate = date;
            const {
                status: newStatus
            } = await order.save({session});

            const newHistory = {
                orderId: order._id,
                userId: cUserId,
                action: { actionType: 'admin_delivery_finish' },
                oldStatus,
                newStatus,
                date
            };
            await (new this.History(newHistory)).save({session});

            return Promise.resolve()
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async orderFailure(session, cUserId, comment, orderId) {
        try {
            const filter = {_id: orderId, isDeleted: {$in: [false, undefined]}}
            const order = await this.Order
            .findOne(filter)
            .session(session);

            if (!order)
                throw new Error(msgErrorStr('Нет такого заказа', 404))

            if (!order.gprinter)
                throw new Error(msgErrorStr('Вы не использовали gprinter', 400))

            const { date } = todayDate();
            
            const oldComment = order.comment;
            const oldStatus = order.status;
            order.status = 'courier_failure';
            order.comment = comment;
            order.lastStatusDate = date;
            const updateOrder = await order.save({session});


            const history = new this.History({
                userId: cUserId, 
                newComment: updateOrder.comment,
                newStatus: updateOrder.status,
                action: {actionType: 'admin_delivery_failure'},
                orderId,
                oldComment,
                oldStatus,
                date
            });
            await history.save({session});

            return Promise.resolve()
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async orderDelete(session, userId, orderId) {
        try {
            const filter = {
                _id: orderId, 
                isDeleted: {$in: [false, undefined]}
            };
            const order = await this.Order
            .findOne(filter)
            .session(session);

            if (!order) 
                throw Error('Этот брон уже проверено или удалено, обновите страницу', 404)
            
            order.isDeleted = true;
            await order.save({session});

            const { date } = todayDate();

            const newHistory = { 
                userId, 
                orderId,
                action: { actionType: 'delete' },
                date 
            }
            await (new this.History(newHistory)).save({session});

            return Promise.resolve();
        } catch (e) {
            console.log(e);
            return Promise.reject(e)
        }
    }

    async recoverySendTg(orderId) {
        try {
            const order = await this.Order
            .findById(orderId)
            .populate(populateOrder);

            await sendTelegram(order);
            order.isSendTelegram = true;

            return order.save();
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async gprinter(orderId) {
        try {
            const order = await this.Order.findById(orderId);
            order.gprinter = true;
            return order.save();
        } catch (e) {
            return Promise.reject(e)
        }
    }
}

module.exports = OrderService