const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    login: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['operator', 'admin', 'low_admin', 'courier', 'checker', 'receiver', 'super_admin', 'manager', 'main_manager', 'director'],
        required: true
    },
    regionId: {
        type: Schema.Types.ObjectId,
        ref: 'Region',
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false
    }
});

module.exports = model('User', userSchema);