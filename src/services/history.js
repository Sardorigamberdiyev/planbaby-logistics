const { populatePaths } = require('../utils/variables');

class HistoryService {
    constructor(History) {
        this.History = History
    }

    async getHistorysFailure(skip, limit, startDate, endDate) {
        try {
            const dateFilter = startDate && endDate ? {date: { $gte: startDate, $lte: endDate }} : {};
            const filter = { newStatus: 'failure', ...dateFilter };

            const historys = await this.History
            .find(filter)
            .skip(skip || 0)
            .limit(limit || 9)
            .populate(populatePaths)
            .sort({ date: -1 });

            const historysLength = await this.History
            .find(filter)
            .countDocuments();

            return Promise.resolve({historys, historysLength})
        } catch (e) {
            return Promise.reject(e)
        }
    }
}

module.exports = HistoryService