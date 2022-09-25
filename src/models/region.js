const { Schema, model } = require('mongoose');

const regionSchema = new Schema({
    nameRu: String,
    nameOz: String,
    nameUz: String,
    city: {
        type: String,
        enum: ['uz', 'other']
    }
});

module.exports = model('Region', regionSchema);