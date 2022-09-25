const { Router } = require('express');
const { sourceValidator } = require('../utils/validator');
const checkRole = require('../middlewares/checkRole');
const { 
    getSourcesFullController, 
    getSourcesCategoryController,
    getSourcesAssortedController,
    getSourcesAllOrByCategoryIdController,
    addSourceOrByCategoryIdController
} = require('../controllers/source');

const router = Router();

router.get('/full', getSourcesFullController);
router.get('/category', getSourcesCategoryController);
router.get('/assorted', getSourcesAssortedController);
router.get('/:categoryId?', getSourcesAllOrByCategoryIdController);
router.post('/:categoryId?', checkRole('AS'), sourceValidator, addSourceOrByCategoryIdController);

module.exports = router;