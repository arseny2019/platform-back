const User = require('../models/user.model');
const Role = require('../models/role.model');
const uuid = require('uuid');
const mailService = require('./mail.service');
const tokenService = require('./token.service');
const bcrypt = require('bcryptjs');
const ApiError = require('../exeptions/api-error');
const UserDto = require('../dtos/user-dto');

class UserService {
    async registration(email, password) {
        const candidate = await User.findOne({email});
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь ${email} уже существует`);
        }
        const activationCode = uuid.v4();
        const hashPassword = bcrypt.hashSync(password, 7);
        const userRole = await Role.findOne({value: 'USER'});
        const user = await User.create({
            password: hashPassword,
            roles: userRole.value,
            activationCode,
            email
        });
        await mailService.sendConfirmationEmail(email, activationCode);
        const userDto = new UserDto(user); // id, email, status, roles;
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, userDto}
    }

    async login(email, password) {
        const user = await User.findOne({email});
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль')
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await User.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, userDto};
    }

    async deleteUser(email) {
        return User.deleteOne({email});
    }

    async activateUser(activationCode) {
        const user = await User.findOne({activationCode})
        console.log('user: ', user)
        if (!user) {
            throw ApiError.BadRequest('Такой пользователь не найден')
        }

        user.status = 'Active';
        await user.save();
    }
}

module.exports = new UserService();
