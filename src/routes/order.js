const { Router } = require('express');
const { orderValidator } = require('../utils/validator');
const checkRole = require("../middlewares/checkRole");
const {
    getOrdersController,
    getOrdersAllStatisticsController,
    checkOrderController,
    managerStatisticsOrByIdController,
    managerOrByIdController,
    orderStatisticsOrByUserIdController,
    orderSearchController,
    ordersByUserOrByUserIdController,
    orderByIdController,
    addOrderController,
    recoverySendTelegramController,
    editOrderController,
    gprinterController,
    orderFailureController,
    orderDeleteController,
    orderSuccessController,
    orderOfficeSuccessController,
    orderVerifiedController,
    orderBackStatusController
} = require('../controllers/order');

const router = Router();

router.get('/', checkRole('ASLA'), getOrdersController);
router.get('/check', checkRole('CHASLA'), checkOrderController);
router.get('/manager/statistics/:id?', checkRole('MMMASLA'), managerStatisticsOrByIdController);
router.get('/manager/:id?', checkRole('MMMASLA'), managerOrByIdController);
router.get('/statistics/all', checkRole('ASLA'), getOrdersAllStatisticsController);
router.get('/statistics/:id?', checkRole('OMMMASLA'), orderStatisticsOrByUserIdController);
router.get('/search', checkRole('CHASLA'), orderSearchController);
router.get('/user/:id?', checkRole('OMMMASLA'), ordersByUserOrByUserIdController);
router.get('/:id', checkRole('CHASLA'), orderByIdController);
router.post('/', checkRole('onlyOperator'), orderValidator, addOrderController);
router.post('/recovery/tg', checkRole('ASLA'), recoverySendTelegramController);
router.put('/:id', checkRole('CHAS'), editOrderController);
router.put('/backStatus/:orderId', checkRole('AS'), orderBackStatusController);
router.put('/verified/:orderId', checkRole('CHAS'), orderVerifiedController);
router.put('/office/success/:orderId', checkRole('AS'), orderOfficeSuccessController)
router.put('/success/:orderId', checkRole('AS'), orderSuccessController);
router.put('/gprinter/:orderId', checkRole('ASLA'), gprinterController);
router.put('/failure/:orderId', checkRole('AS'), orderFailureController);
router.delete('/:orderId', checkRole('CHAS'), orderDeleteController);

module.exports = router; 