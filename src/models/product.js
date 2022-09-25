const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    nameOz: {
        type: String,
        default: null
    },
    nameUz: {
        type: String,
        required: true
    },
    keyXlsx: String,
    priority: {
        type: Number,
        enum: [0, 1, 2, 3],
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 0
    }
});

module.exports = model('Product', productSchema);