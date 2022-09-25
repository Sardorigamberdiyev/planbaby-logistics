const { Router } = require('express');
const { editUserValidator } = require('../utils/validator');
const checkRole = require('../middlewares/checkRole');
const {
    getAboutUserController,
    getUsersAllContrller,
    getUserByIdController,
    getUserByRoleManagerController,
    getOperatorController,
    getUserByNameController,
    getCourierByRegionController,
    editUserController
} = require('../controllers/user');

const router = Router();

router.get('/', getAboutUserController);
router.get('/all', checkRole('DASLA'), getUsersAllContrller);
router.get('/by/name', checkRole('onlyManager'), getUserByNameController);
router.get('/:id', checkRole('OMMMASLA'), getUserByIdController);
router.get('/role/managers', checkRole('MMASLA'), getUserByRoleManagerController);
router.get('/operator/control', checkRole('MMMASLA'), getOperatorController);
router.get('/courier/:regionId', checkRole('ASLA'), getCourierByRegionController);
router.put('/:id', checkRole('AS'), editUserValidator, editUserController);

module.exports = router;