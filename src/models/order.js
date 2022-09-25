const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: String,
    address: {
        type: String,
        required: true
    },
    plot: String,
    phones: {
        type: [String],
        required: true
    },
    products: [
        {
            count: Number,
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['not_active', 'active', 'courier_failure', 'delivered_success', 'office_success', 'in_courier'],
        default: 'not_active'
    },
    payment: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    source: String,
    sourceId: {
        type: Schema.Types.ObjectId,
        ref: 'Source',
        default: null
    },
    comment: {
        type: String,
        default: null
    },
    gprinter: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isSendTelegram: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    regionId: {
        type: Schema.Types.ObjectId,
        ref: 'Region',
        required: true
    },
    districtId: {
        type: Schema.Types.ObjectId,
        ref: 'District',
        required: true
    },
    lastStatusDate: Date,
    date: Date
});

module.exports = model('Order', orderSchema);