const { Router } = require('express');
const checkRole = require('../middlewares/checkRole');
const {
    getVerifiedsController,
    getVerifiedsByDistrictController,
    getVerifiedsByCodeController,
    getVerifiedsAllStatisticsController,
    getVerifiedsStatisticsController,
    getVerifiedByUserIdController
} = require('../controllers/verified');


const router = Router();

router.get('/all', checkRole('ASLA'), getVerifiedsController);
router.get('/all/by/district', checkRole('ASLA'), getVerifiedsByDistrictController);
router.get('/all/by/code', checkRole('ASLA'), getVerifiedsByCodeController);
router.get('/all/statistics', checkRole('DASLA'), getVerifiedsAllStatisticsController);
router.get('/statistics/:id?', checkRole('CHASLA'), getVerifiedsStatisticsController);
router.get('/:id?', checkRole('CHASLA'), getVerifiedByUserIdController);

module.exports = router;