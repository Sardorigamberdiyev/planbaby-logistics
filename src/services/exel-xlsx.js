const { swapTextForRole } = require('../utils/helpers-func');
const { forAdminRoles } = require('../utils/variables');

class ExelXlsxService {
    constructor(Order, Verified, DeliveryDetails, Failured, User, History, Product) {
        this.Order = Order;
        this.Verified = Verified;
        this.DeliveryDetails = DeliveryDetails;
        this.Failured = Failured;
        this.User = User;
        this.History = History;
        this.Product = Product;
    }

    async xlsxUser(cRole, byRole) {
        try {
            const isAdmin = cRole === 'admin';
            const allUserFilter = isAdmin ? { role: { $in: forAdminRoles } } : {}; 
            const byRoleFilter = byRole ? { role: byRole } : allUserFilter;

            const users = await this.User
            .find(byRoleFilter)
            .populate('regionId');

            const xlsxUsers = users.map(({role, firstName, lastName, phone, regionId}) => {
                const region = regionId ? regionId.nameUz.toUpperCase() : '';
                return {
                    РОЛЬ: `${swapTextForRole(role)}`,
                    ИМЯ_ФАМИЛИЯ: `${firstName} ${lastName}`,
                    ТЕЛЕФОН: `${phone}`,
                    ГОРОД: '',
                    КУРЬЕР_ГОРОД: region
                }
            });

            return Promise.resolve(xlsxUsers);
        } catch (e) {
            return Promise.reject(e);
        }
    }


    async xlsxAllOrders(status = null, districtsId = [], startDate = null, endDate = null) {
        try {
            const dateFilter = startDate && endDate ? {lastStatusDate: {$gte: startDate, $lte: endDate}} : {};
            const statusFilter = status ? {status} : {};
            const districtsIdFilter = districtsId?.length ? {districtId: {$in: districtsId}} : {};
            const orderFilter = {
                ...dateFilter,
                ...statusFilter,
                ...districtsIdFilter,
                isDeleted: {$in: [false, undefined]}
            };

            const group = {
                _id: '$orderId',
                histories: {
                  $push: {
                    action: '$action.actionType',
                    newStatus: '$newStatus',
                    date: '$date'
                  }
                }
            };

            const sort = {
                date: 1
            };

            const orders = await this.Order
            .find(orderFilter)
            .populate('regionId districtId userId sourceId products.productId', '-__v -password')
            .select('-__v')
            .sort({lastStatusDate: -1});

            const ordersIds = orders.map((o) => o._id);
            const match = {orderId: {$in: ordersIds}};

            const histories = await this.History
            .aggregate()
            .match(match)
            .group(group)
            .sort(sort);

            const ordersHistories = orders.map((o) => {
                const history = histories.find((h) => h._id.toString() === o._id.toString());
                const historiesData = history ? history.histories : [];
                o._doc.histories = historiesData;
                return o;
            });

            const products = await this.Product.find({keyXlsx: {$ne: undefined}});

            return Promise.resolve({products, ordersHistories})
        } catch (e) {
            return Promise.reject(e)
        }
    }
}

module.exports = ExelXlsxService