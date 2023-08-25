const Router = require('express');
const router = new Router();
const controller = require('../controllers/auth.controller');
const {check, body} = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');


router.post('/registration', [
    body('email', 'Некорректный email').isEmail(),
    body('password', 'Пароль должен быть больше 4 и меньше 12 символов').isLength({min: 5, max: 11})
], controller.registration);
router.post('/login', controller.login);
router.get('/users', controller.getUsers);
router.get('/tokens', controller.getTokens);
router.post('/create-role', controller.createRole);
router.get('/confirm/:activationCode', controller.activateUser);
router.get('/refresh', controller.refresh);
router.post('/delete-user', controller.deleteUser);

module.exports = router;
