const { Router } = require('express');
const { regionValidator } = require('../utils/validator');
const checkRole = require('../middlewares/checkRole');
const {
    getRegionsController, 
    getRegionByIdController,
    addRegionController,
    editRegionController,
} = require('../controllers/region');

const router = Router();

router.get('/', getRegionsController);
router.get('/:id', checkRole('ASLA'), getRegionByIdController);
router.post('/', checkRole('AS'), regionValidator, addRegionController);
router.put('/', checkRole('AS'), regionValidator, editRegionController);

module.exports = router;