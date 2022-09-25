const { Schema, model } = require('mongoose');

const controlStatementSchema = new Schema({
    managerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    operators: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ]
});

module.exports = model('ControlStatement', controlStatementSchema);