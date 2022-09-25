const { Router } = require('express');
const { productValidator } = require('../utils/validator');
const checkRole = require('../middlewares/checkRole');
const {
    getProductsController,
    getProductByIdController,
    addProductController,
    priorityOrderController,
    editProductController
} = require('../controllers/product');

const router = Router();

router.get('/', getProductsController);
router.get('/:id', checkRole('ASLA'), getProductByIdController);
router.post('/', checkRole('AS'), productValidator, addProductController);
router.put('/priority/:id', checkRole('AS'), priorityOrderController);
router.put('/:id', checkRole('AS'), editProductController);

module.exports = router;