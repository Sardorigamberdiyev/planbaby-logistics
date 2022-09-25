const { xlsxOrdersData, createXlsxFile } = require('../utils/helpers-func');
const { errMsgFor500 } = require('../utils/statusMessages');
const { swapTextForRole } = require('../utils/helpers-func');
const startEndDate = require('../utils/startEndDate');
const Verified = require('../models/verified');
const DeliveryDetails = require('../models/deliveryDetails');
const Failured = require('../models/failured');
const Order = require('../models/order');
const User = require('../models/user');
const History = require('../models/history');
const ExelXlsxService = require('../services/exel-xlsx');
const Product = require('../models/product');

const exelXlsxService = new ExelXlsxService(Order, Verified, DeliveryDetails, Failured, User, History, Product);

const xlsxExportController = async (req, res) => {
    try {
        const { status, districtsId } = req.query;
        const { startDate, endDate, sy, sm, sd, ey, em, ed } = startEndDate(req.query);
        const {products, ordersHistories} = await exelXlsxService.xlsxAllOrders(status, districtsId, startDate, endDate);
        const ordersData = xlsxOrdersData(ordersHistories, products);
        const downloadXlsxPath = createXlsxFile(ordersData, Date.now(), '../uploads/xlsx/orders-xlsx', `${sy}${sm}${sd}-${ey}${em}${ed}`);
        res.download(downloadXlsxPath);
    } catch (e) {
        console.log(e);
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const xlsxExportForProductsController = async (req, res) => {
    try {
        const { status, districtsId } = req.query;
        const { startDate, endDate, sy, sm, sd, ey, em, ed } = startEndDate(req.query);
        const {products, ordersHistories} = await exelXlsxService.xlsxAllOrders(status, districtsId, startDate, endDate);
        const ordersData = xlsxOrdersData(ordersHistories, products, 'products');
        const downloadXlsxPath = createXlsxFile(ordersData, Date.now(), '../uploads/xlsx/products-xlsx', `${sy}${sm}${sd}-${ey}${em}${ed}`);
        res.download(downloadXlsxPath);
    } catch (e) {
        console.log(e);
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const xlsxExportUserController = async (req, res) => {
    try {
        const { role } = req.user;
        const { byRole } = req.query;
        const users = await exelXlsxService.xlsxUser(role, byRole);
        const downloadXlsxPath = createXlsxFile(users, Date.now(), '../uploads/xlsx/user-xlsx', swapTextForRole(byRole));
        res.download(downloadXlsxPath);
    } catch (e) {
        res.status(500).json(errMsgFor500);
    }
};

const xlsxExportAllController = async (req, res) => {
    try {
        const { startDate, endDate, sy, sm, sd, ey, em, ed } = startEndDate(req.query);
        const sheetName = startDate && endDate ? `${sy}${sm}${sd}-${ey}${em}${ed}` : 'Все';
        const {products, ordersHistories} = await exelXlsxService.xlsxAllOrders(undefined, undefined, startDate, endDate);
        const ordersData = xlsxOrdersData(ordersHistories, products, 'all');
        const downloadXlsxPath = createXlsxFile(ordersData, Date.now(), '../uploads/xlsx/orders-xlsx', sheetName);
        res.download(downloadXlsxPath);
    } catch (e) {
        res.status(500).json(errMsgFor500);
    }
}

module.exports = {
    xlsxExportController,
    xlsxExportForProductsController,
    xlsxExportUserController,
    xlsxExportAllController
}