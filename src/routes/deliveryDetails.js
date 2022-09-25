const { Router } = require('express');
const checkRole = require('../middlewares/checkRole');
const {
    getDeliverysController,
    getAllDeliverysController,
    getAllDeliverysByDistrictContoller,
    getAllDeliverysByCodeController,
    getAllDeliverysStatisticsController,
    getStatisticsOrByIdController,
    getByIdUserDeliverysController,
    addDeliveryCourierController,
    editDeliveryController,
    failureDeliveryController
} = require('../controllers/deliveryDetails');

const router = Router();

router.get('/', checkRole('onlyCourier'), getDeliverysController);
router.get('/all', checkRole('ASLA'), getAllDeliverysController);
router.get('/all/by/district', checkRole('ASLA'), getAllDeliverysByDistrictContoller);
router.get('/all/by/code', checkRole('ASLA'), getAllDeliverysByCodeController);
router.get('/all/statistics', checkRole('ASLA'), getAllDeliverysStatisticsController);
router.get('/statistics/:id?', checkRole('CASLA'), getStatisticsOrByIdController);
router.get('/:userId', checkRole('ASLA'), getByIdUserDeliverysController);
router.post('/', checkRole('ASLA'), addDeliveryCourierController);
router.put('/:deliveryId', checkRole('onlyCourier'), editDeliveryController);
router.put('/failure/:id', checkRole('onlyCourier'), failureDeliveryController);

module.exports = router;