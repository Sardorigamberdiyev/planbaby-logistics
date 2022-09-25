const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const config = require('config');
const { msgErrorStr, createJwtToken, verifyJwtToken } = require('../utils/helpers-func');

class AuthService {
    constructor(User, Region, Token) {
        this.User = User;
        this.Region = Region;
        this.Token = Token;
    }

    async registerUser(currentUser, userBody) {
        try {
            const { firstName, lastName, login, password, role, phone, regionId } = userBody;

            if (currentUser.role === 'admin') 
                if (role === 'admin' || role === 'super_admin') 
                    throw new Error(msgErrorStr('Вы не имеете право!', 401));
            
            const candidate = await this.getUserByLogin(login);

            if (candidate) 
                throw new Error(msgErrorStr('Такой пользователь уже существует', 400));

            const hashPassword = await bcrypt.hash(password, 12);

            let courierRegion = {};

            if (role === 'courier') {
                if (!mongoose.isValidObjectId(regionId))
                    throw new Error(msgErrorStr('Регион id должен быть в правильном формате', 400));

                const region = await this.Region.findOne({ _id: regionId });

                if (!region) 
                    throw new Error(msgErrorStr('Нет такого региона', 404));
                    
                courierRegion = { regionId };
            }

            const user = new this.User({
                firstName,
                lastName,
                phone,
                login,
                password: hashPassword,
                role,
                ...courierRegion
            });

            return user.save();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async loginUser(login, password) {
        try {
            const user = await this.getUserByLogin(login);

            if (!user) 
                throw new Error(msgErrorStr('Логин или пароль не верно!', 400));

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch)
                throw new Error(msgErrorStr('Логин или пароль не верно!', 400));

            const jwtPayload = { userId: user._id };
            const accessToken = await createJwtToken(jwtPayload, config.get('jwtSecretKey'), { expiresIn: '1h' });
            const refreshToken = await createJwtToken(jwtPayload, config.get('jwtSecretKeyRefresh'));

            const token = new this.Token({ refreshToken });
            await token.save();

            return Promise.resolve({ accessToken, refreshToken, role: user.role});
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async tokenUser(refreshToken) {
        try {
            if (!refreshToken) 
                throw new Error(msgErrorStr('Вы не автаризованы!', 401))

            const token = await this.Token.findOne({ refreshToken });
            
            if (!token) 
                throw new Error(msgErrorStr('Нет такого токена', 404));

            const { userId } = await verifyJwtToken(refreshToken, config.get('jwtSecretKeyRefresh'));
            const newAccessToken = await createJwtToken({userId}, config.get('jwtSecretKey'), { expiresIn: '1h' });

            return Promise.resolve(newAccessToken);
        } catch (e) {
            return Promise.reject(e)
        }
    }

    getUserByLogin(login) {
        return this.User.findOne({ login, isDeleted: {$in: [false, undefined]} });
    }
}

module.exports = AuthService;