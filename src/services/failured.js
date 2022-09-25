const { populatePaths } = require('../utils/variables');
const { pPriceQuantity } = require('../utils/helpers-func');
const todayDate = require('../utils/todayDate');

class FailuredService {
    constructor(Failured, Order, History) {
        this.Failured = Failured;
        this.Order = Order;
        this.History = History;
    }

    async getFailureds(skip, limit, startDate, endDate) {
        try {
            const dateFilter = startDate && endDate ? {date: { $gte: startDate, $lte: endDate }} : {};
            const filter = { ...dateFilter };

            const orders = await this.Failured
            .find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ date: -1 })
            .populate(populatePaths);

            const ordersLength = await this.Failured
            .find(filter)
            .countDocuments();

            return Promise.resolve({orders, ordersLength})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async getFailuredsByDistricts(skip, limit, districtsId, startDate, endDate) {
        try {
            const dateFilter = startDate && endDate ? { date: { $gte: startDate, $lte: endDate } } : {};
            const filterOrder = { 
                status: 'failure', 
                isVerified: true, 
                districtId: { $in: districtsId } 
            };

            const ordersIds = (await this.Order
            .find(filterOrder)
            .select('_id'))
            .map((o) => o._id);

            const filterByOrderId = ordersIds.length ? { orderId: { $in: ordersIds } } : {};
            const filterFailured = { ...filterByOrderId, ...dateFilter };

            const failureds = await this.Failured
            .find(filterFailured)
            .skip(skip)
            .limit(limit)
            .sort({ date: -1 })
            .populate(populatePaths);

            const ordersLength = await this.Failured
            .find(filterFailured)
            .countDocuments();

            return Promise.resolve({failureds, ordersLength})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async getFailuredsByCode(term) {
        try {
            const filterOrder = { 
                status: 'failure', 
                code: {$regex: `^${term}`}
            };

            const ordersIds = (await this.Order
            .find(filterOrder)
            .select('_id'))
            .map((o) => o._id);

            const filterFailured = {
                orderId: { $in: ordersIds }
            };

            const failureds = await this.Failured
            .find(filterFailured)
            .populate(populatePaths);

            return Promise.resolve(failureds)
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async getFailuredsStatistics(districtsId, startDate, endDate) {
        try {
            const dateFilter = startDate && endDate ? { date: { $gte: startDate, $lte: endDate } } : {};
            const filter = { ...dateFilter };

            const statistics = (await this.Failured.aggregate(pPriceQuantity(filter, districtsId)))[0];

            return Promise.resolve(statistics)
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async deleteFailured(session, userId, failuredId) {
        try {
            const failured = await this.Failured
            .findById(failuredId)
            .populate('userId')
            .session(session);
            
            const { orderId: { _id: orderId, code } } = failured;

            const { date } = todayDate();

            const history = new this.History({
                orderId,
                userId,
                date,
                action: {
                    actionType: 'delete',
                    broneCode: code
                }
            });
            await history.save({session});
            
            return this.Failured
            .deleteOne({ _id: failuredId })
            .session(session);
        } catch (e) {
            return Promise.reject(e)
        }
    }
}

module.exports = FailuredService