const { Schema, model } = require('mongoose');

const deliveryDetailsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    cash: {
        type: Number,
        default: 0
    },
    card: {
        type: Number,
        default: 0
    },
    debt: {
        type: Number,
        default: 0
    },
    condition: {
        type: String,
        enum: ['not_delivered', 'failure_delivered', 'delivered'],
        default: 'not_delivered'
    },
    status: {
        type: String,
        enum: ['not_given', 'waiting', 'given'],
        default: 'not_given'
    },
    shippingDate: {
        type: Date,
        default: null
    },
    date: Date
});

module.exports = model('DeliveryDetails', deliveryDetailsSchema);