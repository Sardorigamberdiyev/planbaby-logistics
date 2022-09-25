const { msgErrorStr } = require("../utils/helpers-func");
class ManagerService {
    constructor(ControlStatement, User) {
        this.ControlStatement = ControlStatement;
        this.User = User;
    }

    async addOrEditManager(managerId, operators) {
        try {
            const filterUser = { _id: managerId, role: 'manager' };
            const isMatchUser = await this.User.findOne(filterUser);
            if (!isMatchUser) 
                throw new Error(msgErrorStr('Нет такого управляющего', 404))

            const filterOperator = { operators: { $elemMatch: { $in: operators } } };
            const isMatchOperators = await this.ControlStatement.findOne(filterOperator);
            if (isMatchOperators) 
                throw new Error(msgErrorStr('Один из выбранных операторов уже прикреплено к другому управляющему', 400));

            const controlStatementExist = await this.ControlStatement.findOne({ managerId });

            if (controlStatementExist) {
                controlStatementExist.operators = [...controlStatementExist.operators, ...operators];
                return controlStatementExist.save();
            } else {
                const controlStatement = new this.ControlStatement({ managerId, operators });
                return controlStatement.save();
            }
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async deleteOperatorFromManager(managerId, operatorId) {
        try {
            const filter = { _id: managerId, role: 'manager' };
            const manager = await this.User.findOne(filter);
            if (!manager) 
                throw new Error(msgErrorStr('Не такого управляющего', 400));

            const updateData = { $pull: { operators: operatorId } };
            return this.ControlStatement.updateOne({ managerId }, updateData);
        } catch (e) {
            return Promise.reject(e)
        }
    }
}

module.exports = ManagerService