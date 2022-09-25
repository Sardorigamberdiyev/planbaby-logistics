const { errMsgFor500 } = require('../utils/statusMessages');
const { validationResult } = require('express-validator');
const SourceService = require('../services/source');
const Source = require('../models/source');

const sourceService = new SourceService(Source);

const getSourcesFullController = async (req, res) => {
    try {
        const filter = {
            isCategory: false, 
            isDelete: {$in: [false, undefined]} 
        };

        const fullSources = await Source.find(filter);

        res.status(200).json(fullSources);
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 })
    }
};

const getSourcesCategoryController = async (req, res) => {
    try {
        const filter = {
            isCategory: true, 
            isDelete: {$in: [false, undefined]}
        };

        const categorySources = await Source.find(filter);

        res.status(200).json(categorySources);
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getSourcesAssortedController = async (req, res) => {
    try {
        const pipeline = [
            { $match: { isCategory: false, isDelete: {$in: [false, undefined]} } },
            { $group: { _id: '$sourceId', sources: { $push: { _id: '$_id', name: '$name' }} } },
            { $lookup: { from: 'sources', localField: '_id', foreignField: '_id', as: '_id' } },
            { $unwind: { path: '$_id' } },
            { $sort: { '_id._id': -1 } }
        ];
        const filter = { 
            isCategory: true, 
            isDelete: {$in: [false, undefined]}
        };

        const sources = await Source.aggregate(pipeline);
        const categorySources = await Source.find(filter);

        res.status(200).json({sources, categorySources});
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getSourcesAllOrByCategoryIdController = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const filterByCategory = categoryId ? {sourceId: categoryId} : {};
        const filter = {
            isCategory: false, 
            isDelete: {$in: [false, undefined]},
            ...filterByCategory
        }

        const sources = await Source
        .find(filter)
        .select('name sourceId');

        res.status(200).json(sources);
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const addSourceOrByCategoryIdController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            return res.status(400).json({ errors: errors.array(), errorMessage: 'Вы не прошли ваиладцию' })

        const { categoryId } = req.params;
        const { name } = req.body;

        await sourceService.createSource(name, categoryId);

        res.status(201).json({ successMessage: 'Успешно добавлено' });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

module.exports = {
    getSourcesFullController,
    getSourcesCategoryController,
    getSourcesAssortedController,
    getSourcesAllOrByCategoryIdController,
    addSourceOrByCategoryIdController
}