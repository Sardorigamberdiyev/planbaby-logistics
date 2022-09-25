const { Router } = require('express');
const checkRole = require('../middlewares/checkRole');
const {
    getManagersOrByManagerIdController,
    addManagerOrByMangerIdController,
    deleteOperatorFromManagerController
} = require('../controllers/manager');

const router = Router();

router.get('/:id?', checkRole('MMMASLA'), getManagersOrByManagerIdController);
router.post('/:id?', checkRole('MMMAS'), addManagerOrByMangerIdController);
router.delete('/:managerId/:operatorId', checkRole('MMAS'), deleteOperatorFromManagerController);

module.exports = router;