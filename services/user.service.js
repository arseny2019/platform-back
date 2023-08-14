const User = require('../models/user.model');
const Role = require('../models/role.model');
const uuid = require('uuid');
const mailService = require('../services/mail.service');
const tokenService = require('../services/token.service');
const bcrypt = require('bcryptjs');

class UserService {
    async registration(email, password) {
        const candidate = await User.findOne({email});
        if (candidate) {
            throw new Error(`Пользователь ${email} уже существует`);
        }
        const activationCode = uuid.v4();
        const hashPassword = bcrypt.hashSync(password, 7);
        const userRole = await Role.findOne({value: 'USER'});
        const user = await User.create({
            password: hashPassword,
            roles: [userRole.value],
            activationCode,
            email
        });
        await mailService.sendConfirmationEmail(email, activationCode);
        const tokens = tokenService.generateTokens({email, roles: [userRole.value], status: user.status});
        await tokenService.saveToken(user._id, tokens.refreshToken);

        return {...tokens, user}
    }

    async deleteUser(email) {
        return User.deleteOne({email});
    }

    async activateUser(activationCode) {
        const user = await User.findOne({activationCode})
        console.log('user: ', user)
        if (!user) {
            throw new Error('Такой пользователь не найден')
        }

        user.status = 'Active';
        await user.save();
    }
}

module.exports = new UserService();
