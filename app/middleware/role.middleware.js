const jwt = require('jsonwebtoken');

module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next();
        }

        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(403).json({message: 'Пользователь не авторизован'});
            }
            const {roles: userRoles} = jwt.verify(token, process.env.SECRET_KEY);
            console.log('roles', userRoles);
            const hasPermittedRole = userRoles.some(role => roles.includes(role))
            if (!hasPermittedRole) {
                return res.status(403).json({message: 'У вас нет доступа'});
            }
            next();
        } catch (e) {
            console.log(e);
            return res.status(403).json({message: 'Пользователь не авторизован'});
        }
    }
}
