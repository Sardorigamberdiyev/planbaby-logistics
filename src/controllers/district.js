const { validationResult } = require('express-validator');
const { errMsgFor500 } = require('../utils/statusMessages');
const District = require("../models/district");

const getDistrictsController = async (req, res) => {
    try {
        const { regionsId } = req.query;

        const districts = await District.find({ regionId: { $in: regionsId || [] } }).populate("regionId");

        res.status(200).json({ districts });
    } catch (error) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    };
};

const searchDistrictsController = async (req, res) => {
    try {
        const { term, language } = req.query;

        let termLang = 'nameUz';
        if (language === 'uz') 
            termLang = 'nameUz';
        if (language === 'oz') 
            termLang = 'nameOz';
        if (language === 'ru') 
            termLang = 'nameRu';

        const districts = await District.find({
            [termLang]: { $regex: `${term}`}
        });

        res.status(200).json({ districts });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getAllDistrictsController = async (req, res) => {
    try {
        const regionsSchema = {
            nameRu: "$nameRu",
            nameUz: "$nameUz",
            nameOz: "$nameOz",
            _id: "$_id"
        }
        
        const pipeline = [
            { $match: {} }, 
            { $group: { _id: "$regionId", districts: { $push: regionsSchema } } }, 
            { $lookup: { from: 'regions', localField: '_id', foreignField: '_id', as: 'regionId' }},
            { $unwind: { path: '$regionId' } },
            { $sort: { _id: 1 } 
        }];
        
        const districts = await District.aggregate(pipeline);
        
        res.status(200).json({ districts })
    } catch (error) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const getDistrictByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const district = await District.findById(id).populate('regionId');
        res.status(200).json({ district });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const addDistrictController = async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) 
            return res.status(400).json({ errorMessage: 'Вы не прошли валидацию', errors: errors.array() });

        const { nameUz, regionId } = req.body;

        const newDistrict = new District({ nameUz, regionId });
        const district = await newDistrict.save();
        res.status(201).json({ district });
    } catch (error) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    };
};

const editDistrictController = async (req, res) => {
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()) 
            return res.status(400).json({ errorMessage: 'Вы не прошли валидацию', errors: errors.array() });

        const { id } = req.params;
        const { nameUz } = req.body;

        await District.findByIdAndUpdate(id, {
            $set:{ nameUz }
        });

        res.status(200).json({ succesMessage: "Edited" });
    } catch (error) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    };
};

module.exports = {
    getDistrictsController,
    searchDistrictsController,
    getAllDistrictsController,
    getDistrictByIdController,
    addDistrictController,
    editDistrictController
}