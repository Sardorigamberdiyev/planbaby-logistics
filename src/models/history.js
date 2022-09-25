const { Schema, model } = require('mongoose');

const historySchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        default: null
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        actionType: {
            type: String,
            default: null,
            enum: [
                'confirm', 
                'delete', 
                'edit_order', 
                'send_courier', 
                'office_finish', 
                'admin_delivery_finish', 
                'delivery_finish', 
                'admin_delivery_failure', 
                'delivery_failure',
                'back_status'
            ]
        },
        broneCode: {
            type: String,
            default: null
        }
    },
    oldComment: {
        type: String,
        default: null
    },
    newComment: {
        type: String,
        default: null
    },
    oldStatus: {
        type: String,
        default: null
    },
    newStatus: {
        type: String,
        default: null
    },
    date: Date
});

module.exports = model('History', historySchema);