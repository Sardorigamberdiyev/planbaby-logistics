const { Schema, model } = require('mongoose');

const failuredSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
    status: {
        type: String,
        enum: ['isAdmin', 'isCourier'],
        required: true
    },
    date: Date
});

module.exports = model('Failured', failuredSchema);