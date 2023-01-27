const User = require('../models/user.model');
const Role = require('../models/role.model');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const generateAccessToken = (id, username, roles) => {
    const payload = {id, username, roles};
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '24h'});
}

const sendConfirmationEmail = (name, email, confirmationCode) => {
    return transport.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href="${process.env.HOST}/auth/confirm/${confirmationCode}">Click here</a>
        </div>`,
    });
};

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        accessUrl: 'https://oauth2.googleapis.com/token',
        user: "platform.mail.confirmation@gmail.com",
        clientId: "551117779496-d9falusujmk4n55chgesig1843cid41a.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken: '1//04TNVGHcQW4-ZCgYIARAAGAQSNwF-L9Ir-srglUW5nTQ7KJNyB-3kQdHipNk2ATtF_fx2_qlBzZ8O0P5Fo6X2wNvGLMvwbjp6C4o'
    }
})

class AuthController {

    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Ошибка при регистрации', errors});
            }
            const {username, password, email} = req.body;
            const candidate = await User.findOne({username});
            if (candidate) {
                return res.status(400).json({message: 'Пользователь с таким именем уже существует'})
            }
            const confirmationCode = jwt.sign({email}, process.env.SECRET_KEY);
            await sendConfirmationEmail(username, email, confirmationCode);
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: 'USER'});
            const user = new User({
                username,
                password: hashPassword,
                roles: [userRole.value],
                confirmationCode,
                email
            });
            await user.save();
            return res.json({message: `Пользователь ${username} успешно зарегистрирован`});
        } catch (e) {
            console.log('Registration error', e);
            return res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({username});
            if (!user) {
                res.status(400).json({message: `Пользователь ${username} не найден`})
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                res.status(400).json({message: `Введен неверный пароль`})
            }
            const token = generateAccessToken(user._id, user.username, user.roles);
            return res.json({token});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json({users});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Get users error'})
        }
    }

    async createRole(req, res) {
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
            res.status(400).json({message: 'Get role creation error'})
        }
    }

    async verifyUser(req, res) {
        try {
            await User.findOne({
                confirmationCode: req.params.confirmationCode,
            })
                .then((user) => {
                    if (!user) {
                        return res.status(404).send({message: 'Пользователь не найден.'});
                    }
                    user.status = 'Active';
                    user.save()
                        .then(() => res.json({message: 'Почта успешно подтверждена.'}))
                        .catch((err) => {
                            if (err) {
                                return res.status(500).send({message: err});
                            }
                        });
                })
        } catch (e) {
            res.status(400).json({message: 'Get confirmation error'})
        }
    }
}

module.exports = new AuthController()
