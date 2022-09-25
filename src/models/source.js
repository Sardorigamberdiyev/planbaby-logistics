const { Schema, model } = require('mongoose');

const sourceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    isCategory: {
        type: Boolean,
        required: true
    },
    isDelete: {
        type: Boolean,
        required: true,
        default: false
    },
    sourceId: {
        type: Schema.Types.ObjectId,
        ref: 'Source',
        default: null
    }
});

module.exports = model('Source', sourceSchema);