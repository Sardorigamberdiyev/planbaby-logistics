const { Router } = require('express');
const checkRole = require('../middlewares/checkRole');
const {
    getHistorysFailureController,
    deleteHistoryFailureController,
    getHistorysController
} = require('../controllers/history');

const router = Router();

router.get('/failure', checkRole('ASLA'), getHistorysFailureController);
router.get('/only/:orderId', checkRole('ASLA'), getHistorysController);
router.delete('/failure/:id', checkRole('AS'), deleteHistoryFailureController);

module.exports = router;