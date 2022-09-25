const { populatePaths } = require('../utils/variables');

class VerifiedService {
    constructor(Verified, Order, History) {
        this.Verified = Verified;
        this.Order = Order;
        this.History = History;
    }

    async getVerified(condition, skip, limit, startDate, endDate) {
        try {
            const dateKey = condition === 'from_warehouse' ? 'shipmentDateFromWarehouse' : 'date';
            const typeOrder = condition === 'from_warehouse' ? 'verifieds_from_warehouse' : 'verifieds_active';

            const dateFilter = startDate && endDate ? { [dateKey]: { $gte: startDate, $lte: endDate } } : {};
            const filter = { condition, ...dateFilter };

            const orders = await this.Verified
            .find(filter)
            .skip(skip)
            .limit(limit)
            .sort({[dateKey]: -1})
            .populate(populatePaths);

            const ordersLength = await this.Verified
            .find(filter)
            .countDocuments();

            return Promise.resolve({orders, ordersLength, typeOrder})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async getVerifiedByDistrict(condition, skip, limit, districtsId, startDate, endDate) {
        try {
            const isFromWarehouse = condition === 'from_warehouse';
            const dateKey = isFromWarehouse ? 'shipmentDateFromWarehouse' : 'date';
            const status = isFromWarehouse ? 'office_success' : 'active';
            const typeOrder = isFromWarehouse ? 'verifieds_from_warehouse' : 'verifieds_active';

            const dateFilter = startDate && endDate ? { [dateKey]: { $gte: startDate, $lte: endDate } } : {};
            const filterOrder = { status, isVerified: true, districtId: { $in: districtsId } };

            const ordersIds = (await this.Order
            .find(filterOrder)
            .select('_id'))
            .map((o) => o._id);

            const filterByOrderId = districtsId && ordersIds.length ? { orderId: { $in: ordersIds } } : {};
            const filterVerified = { condition, ...filterByOrderId, ...dateFilter };

            const verifieds = await this.Verified
            .find(filterVerified)
            .skip(skip)
            .limit(limit)
            .sort({[dateKey]: -1})
            .populate(populatePaths);

            const verifiedsLength = await this.Verified
            .find(filterVerified)
            .countDocuments();

            return Promise.resolve({verifieds, verifiedsLength, typeOrder})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async getVerifiedByCode(term, typeCondition) {
        try {
            const isFromWarehouse = typeCondition === 'from_warehouse';
            const condition = isFromWarehouse ? 'from_warehouse' : 'active';
            const status = isFromWarehouse ? 'success' : 'active';
            const sort = isFromWarehouse ? { shipmentDateFromWarehouse: -1 } : { date: -1 };

            const filterOrder = { status, isVerified: true, code: { $regex: `^${term}` }};
            const ordersIds = (await this.Order
            .find(filterOrder)
            .skip(0)
            .limit(50)
            .select('_id'))
            .map((o) => o._id);

            const filterVerified = { condition, orderId: { $in: ordersIds } };
            const verifieds = await this.Verified
            .find(filterVerified)
            .skip(0)
            .limit(50)
            .sort(sort)
            .populate(populatePaths);

            return Promise.resolve({verifieds})
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async getVerifiedByUserId(userId, term, skip, limit, districtsId, startDate, endDate) {
        try {
            const byTerm = term ? {code: {$regex: `^${term}`}} : {};
            const byDistrict = !term && districtsId ? {districtId: { $in: districtsId }} : {};
            const filterOrder = {isVerified: true, ...byTerm, ...byDistrict};

            let ordersIds = (await this.Order
            .find(filterOrder)
            .select('_id'))
            .map((o) => o._id);

            const dateFilter = startDate && endDate ? { date: { $gte: startDate, $lte: endDate } } : {};
            const findOrdersIds = ordersIds.length ? {orderId: {$in: ordersIds}} : {};
            const filterVerified = { userId, ...dateFilter, ...findOrdersIds };
            
            const verifieds = await this.Verified
            .find(filterVerified)
            .skip(skip || 0)
            .limit(limit || 6)
            .populate(populatePaths)
            .sort({date: -1});

            const verifiedsCount = await this.Verified
            .countDocuments(filterVerified);

            return Promise.resolve({verifieds, verifiedsCount})
        } catch (e) {
            return Promise.reject(e)
        }
    }
}

module.exports = VerifiedService