const { Router } = require('express');
const checkRole = require('../middlewares/checkRole');
const {
    xlsxExportController,
    xlsxExportForProductsController,
    xlsxExportUserController,
    xlsxExportAllController
} = require('../controllers/exel-xlsx');

const router = Router();

router.get('/export', checkRole('ASLA'), xlsxExportController);
router.get('/export/all', checkRole('ASLA'), xlsxExportAllController);
router.get('/export/order/products', checkRole('ASLA'), xlsxExportForProductsController);
router.get('/export/user', checkRole('ASLA'), xlsxExportUserController);

module.exports = router;