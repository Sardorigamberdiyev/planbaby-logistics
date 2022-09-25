const User = require('../models/user');

module.exports = (req, res, next) => {
    User.findOne({ _id: req.decodedUser.userId, isDeleted: {$in: [undefined, false]} }, (err, user) => {
        if (err) 
            return res.status(500).json({ errorMessage: 'Что-то пошло не-так' });

        if (!user) 
            return res.status(401).json({ errorMessage: 'Такой пользователь не авторизован' }); 

        req.user = user;
        next();
    });
}