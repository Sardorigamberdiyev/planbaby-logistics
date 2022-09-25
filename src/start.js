const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('config');
const User = require('./models/user');

const PORT = config.get('port') || 5000;
const { INITIAL_LOGIN, INITIAL_PASSWORD, INITIAL_ROLE } = process.env;

const start = async (app) => {
    try { 
        const connectOptions = {replicaSet: 'myReplicaSet'};
        const mongoUri = config.get('mongoUri');

        await mongoose.connect(mongoUri, connectOptions);

        const emptyUser = await User.findOne();

        if (!emptyUser) {
            const password = await bcrypt.hash(INITIAL_PASSWORD, 12);
            const newUser = {
                firstName: 'Dora it',
                lastName: 'group',
                login: INITIAL_LOGIN,
                role: INITIAL_ROLE,
                phone: ' ',
                password
            };

            await (new User(newUser)).save();
        }

        app.listen(PORT, () => console.log(`Сервер запустился на порте ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

module.exports = start