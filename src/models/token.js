const { Schema, model } = require('mongoose');

const tokenSchema = new Schema({
    refreshToken: String
});

module.exports = model('Token', tokenSchema);