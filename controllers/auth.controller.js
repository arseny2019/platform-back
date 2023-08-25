const User = require('../models/user.model');
const Token = require('../models/token.model');
const Role = require('../models/role.model');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');
const ApiError = require('../exeptions/api-error');

class AuthController {

    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {password, email} = req.body;
            const userData = await userService.registration(email, password);
            console.log('userData', userData);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json({message: `Пользователь ${email} успешно зарегистрирован`, userData});
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const user = await User.findOne({email});
            if (!user) {
                res.status(400).json({message: `Пользователь ${email} не найден`})
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            // if (!validPassword) {
            //     res.status(400).json({message: `Введен неверный пароль`})
            // }
            // const token = generateAccessToken(user._id, user.username, user.roles);
            // return res.json({token});
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await User.find();
            res.json({users});
        } catch (e) {
            next(e);
        }
    }

    async getTokens(req, res, next) {
        try {
            const tokens = await Token.find();
            res.json({tokens});
        } catch (e) {
            next(e);
        }
    }

    async createRole(req, res, next) {
        try {
            const {value} = req.body;
            const roleExists = await Role.findOne({value});
            if (roleExists) {
                return res.status(400).json({message: `Роль ${value} уже существует`});
            }
            const role = new Role({value});
            await role.save();
            res.json({message: `Роль ${value} успешно создана`});
        } catch (e) {
            next(e);
        }
    }

    async activateUser(req, res, next) {
        try {
            const activationCode = req.params.activationCode;
            await userService.activateUser(activationCode);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh() {
        try {

        } catch (e) {

        }
    }

    async deleteUser(req, res, next) {
        try {
            await userService.deleteUser(req.body.email);
            res.status(200).json({message: `Пользователь ${req.body.email} успешно удален`});
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new AuthController()
