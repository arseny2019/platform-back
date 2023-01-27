const Router = require('express');
const router = new Router();
const controller = require('../controllers/auth.controller');
const {check} = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');


router.post('/registration', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 4 и меньше 12 символов').isLength({min: 5, max: 11})
], controller.registration);
router.post('/login', controller.login);
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers);
router.post('/create-role', controller.createRole);
router.get('/confirm/:confirmationCode', controller.verifyUser);

module.exports = router;
