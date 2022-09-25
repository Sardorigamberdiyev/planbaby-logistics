const { validationResult } = require('express-validator');
const { errMsgFor500 } = require('../utils/statusMessages');
const { msgErrorParse } = require('../utils/helpers-func');
const User = require('../models/user');
const Region = require('../models/region');
const Token = require('../models/token');
const AuthService = require('../services/auth');

const authService = new AuthService(User, Region, Token);

const registerController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errorMessage: 'Вы не прошли валидацию',
                errors: errors.array()
            })
        }

        await authService.registerUser(req.user, req.body);

        res.status(201).json({ successMessage: 'Аккаунт успешно создан' });
    } catch (e) {
        const {msg, status} = msgErrorParse(e);
        res.status(status).json({ errorMessage: msg});
    }
};

const loginController = async (req, res) => {
    try {
        const { login, password } = req.body;

        const { accessToken, refreshToken, role } = await authService.loginUser(login, password);

        res.status(200).json({ accessToken, refreshToken, role });
    } catch (e) {
        const {msg, status} = msgErrorParse(e);
        res.status(status).json({ errorMessage: msg});
    }
};

const logoutController = async (req, res) => {
    try {
        const refreshToken = req.query.token;

        await Token.deleteOne({ refreshToken });
        
        res.status(204).json({ successMessage: 'Успешно вышли из системы' });
    } catch (e) {
        res.status(500).json({ errorMessage: errMsgFor500 })
    }
};

const tokenController = async (req, res) => {
    try {
        const refreshToken = req.body.token;
    
        const accessToken = await authService.tokenUser(refreshToken);
        
        res.status(200).json({ accessToken });
    } catch (e) {
        const { msg, status } = msgErrorParse(e);
        res.status(status).json({ errorMessage: msg });
    }
};

module.exports = {
    registerController,
    loginController,
    logoutController,
    tokenController
}