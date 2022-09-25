const { errMsgFor500 } = require('../utils/statusMessages');
const { validationResult } = require('express-validator');
const ProductService = require('../services/product');
const Product = require('../models/product');

const productService = new ProductService(Product);

const getProductsController = async (req, res) => {
    try {
        const products = await Product.find().sort({ priority: -1 });
        res.status(200).json({ products });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getProductByIdController = (req, res) => {
    const { id } = req.params;
    Product.findById(id, (err, product) => {
        if (err) return res.status(500).json({ errorMessage: errMsgFor500 });
        res.status(200).json({ product });
    });
};

const addProductController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            return res.status(400).json({ errorMessage: 'Вы не прошли валидацию', errors: errors.array() })

        const { nameUz, price } = req.body;

        await productService.createProduct(nameUz, price);

        res.status(201).json({ successMessage: 'Препарат добавлен' });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const editProductController = async (req, res) => {
    try {
        const { nameUz, price } = req.body;
        const { id } = req.params;

        await productService.editProduct(id, nameUz, price);

        res.status(200).json({ successMessage: 'Препорат изменено' });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const priorityOrderController = async (req, res) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;

        const productName = await productService.changePriority(id, priority);

        res.status(200).json({ successMessage: `Успешно изменен приоритет продукта ${productName}` });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

module.exports = {
    getProductsController,
    getProductByIdController,
    addProductController,
    editProductController,
    priorityOrderController
}