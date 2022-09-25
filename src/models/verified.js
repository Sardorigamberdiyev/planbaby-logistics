const { Schema, model } = require('mongoose');

const verifiedSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    condition: {
        type: String,
        enum: ['active', 'at_courier', 'from_warehouse', 'failure_courier', 'failure_admin'],
        default: 'active'
    },
    shipmentDateFromWarehouse: {
        type: Date,
        default: null
    },
    date: Date
});

module.exports = model('Verified', verifiedSchema);