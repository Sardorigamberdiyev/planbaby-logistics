const { errMsgFor500 } = require('../utils/statusMessages');
const startEndDate = require('../utils/startEndDate');
const History = require('../models/history');
const HistoryService = require('../services/history');

const historyService = new HistoryService(History);

const getHistorysController = async (req, res) => {
    try {
        const { orderId } = req.params;

        const historys = await History
        .find({orderId})
        .populate('userId', '-password -__v')
        .sort({date: 1})
        .select('-__v');

        res.status(200).json({historys});
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getHistorysFailureController = async (req, res) => {
    try {
        const { skip, limit } = req.query;

        const { startDate, endDate } = startEndDate(req.query);

        const {
            historys,
            historysLength
        } = await historyService.getHistorysFailure(skip, limit, startDate, endDate);

        res.status(200).json({ historys, historysLength });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const deleteHistoryFailureController = async (req, res) => {
    try {
        const { id } = req.params;
        await History.deleteOne({ _id: id });
        res.status(200).json({ successMessage: 'Успешно удалено' });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

module.exports = {
    getHistorysFailureController,
    deleteHistoryFailureController,
    getHistorysController
}