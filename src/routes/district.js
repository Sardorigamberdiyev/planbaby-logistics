const { Router } = require('express');
const { districtValidator, editDistrictValidator } = require('../utils/validator');
const checkRole = require('../middlewares/checkRole');
const {
    getDistrictsController,
    searchDistrictsController,
    getAllDistrictsController,
    getDistrictByIdController,
    addDistrictController,
    editDistrictController
} = require('../controllers/district');

const router = Router();

router.get('/', getDistrictsController);
router.get('/search', searchDistrictsController);
router.get('/all', checkRole('OASLA'), getAllDistrictsController);
router.get('/:id', checkRole('ASLA'), getDistrictByIdController);
router.post('/', checkRole('AS'), districtValidator, addDistrictController);
router.put('/:id', checkRole('AS'), editDistrictValidator, editDistrictController);

module.exports = router;