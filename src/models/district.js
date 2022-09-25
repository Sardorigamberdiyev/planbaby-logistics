const { Schema, model } = require('mongoose');

const districtSchema = new Schema({
    nameRu: {
        type: String,
        default: null
    },
    nameOz: {
        type: String,
        default: null
    },
    nameUz: {
        type: String,
        required: true
    },
    regionId: {
        type: Schema.Types.ObjectId,
        ref: 'Region',
        required: true
    }
});

module.exports = model('District', districtSchema);