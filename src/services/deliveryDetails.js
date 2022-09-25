const { populatePaths } = require('../utils/variables');
const { pPriceQuantity, msgErrorStr } = require('../utils/helpers-func');
const todayDate = require('../utils/todayDate');

class DeliveryService {
    constructor(DeliveryDetails, User, Order, Verified, Failured, History) {
        this.DeliveryDetails = DeliveryDetails;
        this.User = User;
        this.Order = Order;
        this.Verified = Verified;
        this.Failured = Failured;
        this.History = History;
    }

    async getDeliverys(userId, districtsId, term, skip, limit, startDate, endDate) {
        try {
            const findByTerm = term ? {code: {$regex: `^${term}`}} : {};
            const findByDistrict = !term && districtsId ? { districtId: {$in: districtsId}}: {};

            const ordersIds = (await this.Order
            .find({...findByTerm, findByDistrict, isDeleted: {$in: [false, undefined]}})
            .select('_id'))
            .map((o) => o._id);

            const dateFilter = startDate && endDate ? {date: { $gte: startDate, $lte: endDate }} : {};
            const deliveryFindOption = {userId, orderId: {$in: ordersIds}, ...dateFilter };

            const deliverys = await this.DeliveryDetails
            .find(deliveryFindOption)
            .skip(skip || 0)
            .limit(limit || 6)
            .populate(populatePaths)
            .sort({date: -1});

            const deliveryLength = await this.DeliveryDetails.countDocuments(deliveryFindOption);

            return Promise.resolve({deliverys, deliveryLength})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async getAllDeliverys(condition, skip, limit, startDate, endDate) {
        try {
            const isDelivered = condition === 'delivered';
            const dateKey = isDelivered ? 'shippingDate' : 'date';
            const dateFilter = startDate && endDate ? {[dateKey]: { $gte: startDate, $lte: endDate }} : {};
            const filter = { condition, ...dateFilter };

            const orders = await this.DeliveryDetails
            .find(filter)
            .sort({ [dateKey]: -1 })
            .skip(skip)
            .limit(limit)
            .populate(populatePaths);

            const ordersLength = await this.DeliveryDetails
            .find(filter)
            .countDocuments();

            return Promise.resolve({orders, ordersLength})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async getAllDeliverysByDistrict(typeCondition, districtsId, skip, limit, startDate, endDate) {
        try {
            const isDelivered = typeCondition === 'delivered';
            const condition = isDelivered ? 'delivered' : 'not_delivered';
            const status = isDelivered ? 'success' : 'in_courier';
            const dateKey = isDelivered ? 'shippingDate' : 'date';

            const filterOrder = { 
                status, 
                isDeleted: {$in: [false, undefined]},
                isVerified: true, 
                districtId: { $in: districtsId } 
            };

            let ordersIds = null;
            if (districtsId) 
                ordersIds = (await this.Order
                .find(filterOrder)
                .select('_id'))
                .map((o) => o._id)

            const deliverysByOrderId = ordersIds ? { orderId: { $in: ordersIds } } : {};
            const filterDelivery = { ...deliverysByOrderId, condition, [dateKey]: { $gte: startDate, $lte: endDate } };

            const deliverys = await this.DeliveryDetails
            .find(filterDelivery)
            .skip(skip)
            .limit(limit)
            .sort({[dateKey]: -1})
            .populate(populatePaths);

            const ordersLength = await this.DeliveryDetails
            .find(filterDelivery)
            .countDocuments();

            return Promise.resolve({ deliverys, ordersLength })
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async getAllDeliverysByCode(typeCondition, term) {
        try {
            const isDelivered = typeCondition === 'delivered';
            const condition = isDelivered ? 'delivered' : 'not_delivered';
            const status = isDelivered ? 'success' : 'in_courier';
            const dateKey = isDelivered ? 'shippingDate' : 'date';

            const filterOrder = { 
                status, 
                isDeleted: {$in: [false, undefined]},
                isVerified: true, 
                code: { $regex: `^${term}`} 
            };

            const ordersIds = (await this.Order
            .find(filterOrder)
            .skip(0)
            .limit(50)
            .select('_id'))
            .map((o) => o._id);

            const filterDelivery = { condition, orderId: { $in: ordersIds } };

            const deliverys = await this.DeliveryDetails
            .find(filterDelivery)
            .sort({[dateKey]: -1})
            .populate(populatePaths);
            
            return Promise.resolve(deliverys)
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async getAllDeliverysStatistics(condition, districtsId, startDate, endDate) {
        try {
            const isDelivered = condition === 'delivered';
            const dateKey = isDelivered ? 'shippingDate' : 'date';
            const dateFilter = startDate && endDate ? { [dateKey]: { $gte: startDate, $lte: endDate } } : {};
            const filter = { condition, ...dateFilter };

            const statistics = (await this.DeliveryDetails.aggregate(pPriceQuantity(filter, districtsId)))[0];
            
            return Promise.resolve(statistics)
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async getByIdUserDeliverys(userId, districtsId, term, skip, limit, startDate, endDate) {
        try {
            const findByTerm = term ? {code: {$regex: `^${term}`}} : {};
            const findByDistrict = !term && districtsId ? { districtId: {$in: districtsId}}: {};

            const filterOrder = {
                isDeleted: {$in: [false, undefined]},
                ...findByTerm, 
                ...findByDistrict
            };

            const ordersIds = (await this.Order
            .find(filterOrder)
            .select('_id'))
            .map((o) => o._id);

            const orderIdsFilter = ordersIds.length ? { orderId: {$in: ordersIds} } : {}
            const dateFilter = startDate && endDate ? { date: { $gte: startDate, $lte: endDate } } : {};
            const filterDelivery = {userId, ...orderIdsFilter, ...dateFilter };

            const deliverys = await this.DeliveryDetails
            .find(filterDelivery)
            .skip(skip || 0)
            .limit(limit || 6)
            .populate(populatePaths)
            .sort({date: -1});

            const deliveryLength = await this.DeliveryDetails.countDocuments(filterDelivery);

            return Promise.resolve({deliverys, deliveryLength})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async addDeliveryCourier(session, cUserId, userId, orderId) {
        try {
            const filter = {_id: orderId, isDeleted: {$in: [false, undefined]}};
            const order = await this.Order.findOne(filter);
            if (!order)
                throw new Error(msgErrorStr('Нет такого заказа', 404));
                
            const { date } = todayDate();
            
            const oldStatus = order.status;
            order.status = 'in_courier';
            order.lastStatusDate = date;
            const {
                status: newStatus
            } = await order.save({session});

            if (!order.gprinter) 
                throw new Error(msgErrorStr('Вы не можете без gprinter copy', 400))

            const filterUser = { _id: userId, role: 'courier', regionId: order.regionId };
            const user = await this.User.findOne(filterUser);
            if (!user) 
                throw new Error(msgErrorStr('Нет такого курьера', 404))

            const busyDelivery = await this.DeliveryDetails.findOne({ orderId });
            if (busyDelivery) 
                throw new Error(msgErrorStr('Уже прикреплено к другому курьеру', 400))

            const verified = await this.Verified.findOne({orderId});
            verified.condition = 'at_courier';
            await verified.save({session});


            const newHistory = {
                orderId: order._id,
                userId: cUserId,
                action: { actionType: 'send_courier' },
                oldStatus,
                newStatus,
                date
            };
            await (new this.History(newHistory)).save({session});

            const delyveryDetails = new this.DeliveryDetails({ userId, orderId, date });
            return delyveryDetails.save({session});
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async editDelivery(session, cUserId, deliveryId, comment, cash, card, debt) {
        try {
            const { date } = todayDate();

            const delivery = await this.DeliveryDetails
            .findById(deliveryId)
            .session(session);

            const { orderId } = delivery;
            delivery.cash = cash;
            delivery.card = card;
            delivery.debt = debt;
            delivery.condition = 'delivered';
            delivery.shippingDate = date;
            await delivery.save({ session });

            const filter = {
                _id: orderId,
                isDeleted: {$in: [false, undefined]}
            }
            const order = await this.Order
            .findOne(filter)
            .session(session);

            if (!order)
                throw new Error(msgErrorStr('Нет такого заказа', 404))

            const oldStatus = order.status;
            const oldComment = order.comment;
            order.status = 'delivered_success';
            order.comment = comment;
            order.lastStatusDate = date;
            const {
                status: newStatus,
                comment: newComment
            } = await order.save({ session });

            const newHistory = {
                orderId: order._id,
                userId: cUserId,
                action: {actionType: 'delivery_finish'},
                oldStatus,
                newStatus,
                oldComment,
                newComment,
                date
            };
            await (new this.History(newHistory)).save({session});

            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async failureDelivery(session, cUserId, deliveryId, orderId, comment) {
        try {
            const filter = {_id: orderId, isDeleted: {$in: [false, undefined]}};
            const order = await this.Order
            .findOne(filter)
            .session(session);

            if (!order)
                throw new Error(msgErrorStr('Нет такого заказа', 404))

            const { date } = todayDate();

            const oldStatus = order.status;
            const oldComment = order.comment;
            order.status = 'courier_failure';
            order.comment = comment;
            order.lastStatusDate = date;
            const {
                status: newStatus,
                comment: newComment
            } = await order.save({ session });

            // const verified = await this.Verified
            // .findOne({ orderId })
            // .session(session);

            // verified.condition = 'failure_courier';
            // await verified.save({ session });

            const newHistory = {
                userId: cUserId,
                action: { actionType: 'delivery_failure' },
                orderId,
                oldStatus,
                newStatus,
                oldComment,
                newComment,
                date
            }
            await (new this.History(newHistory)).save({session});

            // const failured = new this.Failured({ userId, orderId, date, status: 'isCourier' });
            // await failured.save({ session });

            const delivery = await this.DeliveryDetails
            .findById(deliveryId)
            .session(session);
            
            delivery.condition = 'failure_delivered';
            delivery.shippingDate = date;
            return delivery.save({ session });
        } catch (e) {
            return Promise.reject(e)
        }
    }
} 

module.exports = DeliveryService