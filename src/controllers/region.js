const { errMsgFor500 } = require('../utils/statusMessages');
const { validationResult } = require('express-validator');
const Region = require("../models/region");

const getRegionsController = async (req, res) => {
    try {
        const { city } = req.query;
        const findByCity = city ? {city} : {};
        const regions = await Region.find({...findByCity});
        res.status(200).json({ regions });
    } catch (error) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    };
};

const getRegionByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const region = await Region.findById(id);
        res.status(200).json({ region });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const addRegionController = async(req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) 
            return res.status(400).json({ errors: errors.array() });

        const { nameRu, nameUz, nameOz } = req.body;
        const newRegion = new Region({
            nameOz,
            nameRu,
            nameUz
        });
        const region = await newRegion.save()
        res.status(201).json({ region });
    } catch (error) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

const editRegionController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) 
            return res.status(400).json({ errors: errors.array() });

        const { nameRu, nameUz, nameOz, id } = req.body;

        await Region.findByIdAndUpdate(id, {
            $set: {
                nameRu,
                nameUz,
                nameOz
            }
        });
        res.status(201).json({ succesMessage: "Edited" });
    } catch (error) {
        res.status(500).json({ errorMessage: errMsgFor500 });
    }
};

module.exports = {
    getRegionsController,
    getRegionByIdController,
    addRegionController,
    editRegionController
}