const { Router } = require('express');
const {
    dOrdersController,
    dOrdersStatusesCountController,
    dCountByUserController,
    dCountByUserCourierController,
    dTotalPriceByStatusController,
    dTotalPriceBySourcesController,
    dCountBySourcesController,
    dCountByDateController,
    dCountByPreparationController
} = require('../controllers/dashboard');
const checkRole = require('../middlewares/checkRole');

const router = Router();

router.get('/orders', checkRole('DASLA'), dOrdersController);
router.get('/orders/statuses/count', checkRole('DASLA'), dOrdersStatusesCountController);
router.get('/orders/count/by/users', checkRole('DASLA'), dCountByUserController);
router.get('/orders/count/by/users/courier', checkRole('DASLA'), dCountByUserCourierController);
router.get('/orders/price/by/statuses', checkRole('DASLA'), dTotalPriceByStatusController);
router.get('/orders/price/by/sources', checkRole('DASLA'), dTotalPriceBySourcesController);
router.get('/orders/count/by/sources', checkRole('DASLA'), dCountBySourcesController);
router.get('/preparations/count/by/date', checkRole('DASLA'), dCountByDateController);
router.get('/preparations/by/count', checkRole('DASLA'), dCountByPreparationController);

module.exports = router;