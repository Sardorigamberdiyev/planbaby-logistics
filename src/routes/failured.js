const { Router } = require('express');
const checkRole = require('../middlewares/checkRole');
const {
    getFailuredsController, 
    getFailuredsByDistrictsController,
    getFailuredsByCodeController,
    getFailuredsStatisticsController,
    deleteFailuredController
} = require('../controllers/failured');

const router = Router();

router.get('/', checkRole('ASLA'), getFailuredsController);
router.get('/by/district', checkRole('ASLA'), getFailuredsByDistrictsController);
router.get('/by/code', checkRole('ASLA'), getFailuredsByCodeController);
router.get('/statistics', checkRole('ASLA'), getFailuredsStatisticsController);
router.delete('/:id', checkRole('AS'), deleteFailuredController);

module.exports = router;