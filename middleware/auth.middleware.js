const ApiError = require('../exeptions/api-error');
const TokenService = require('../services/token.service');
const UserDto = require("../dtos/user-dto");
const {TokenExpiredError} = require("jsonwebtoken");

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        const authHeader = req.headers.authorization;
        console.log('cookies', req.cookies.refreshToken)
        if (!authHeader) {
            return next(ApiError.UnauthorizedError());
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return next(ApiError.UnauthorizedError());
        }
        let userData = TokenService.validateAccessToken(token);
        console.log('userData after', userData)
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }
        req.user = userData;
        next();
    } catch (e) {
        console.log('catch e in outterBlock', e.message)
        let userData;
        if (e.message === 'TokenExpiredError: jwt expired') {
            userData = TokenService.validateRefreshToken(req.cookies.refreshToken)
            if (userData) {
                const userDto = new UserDto(userData)
                res.set('Access-Control-Expose-Headers', 'Need-Update-Access-Token')
                res.set('Need-Update-Access-Token', TokenService.generateTokens({...userDto}).accessToken)
            }
        }
        if (userData) {
            req.user = userData
            next()
        } else {
            return next(ApiError.UnauthorizedError());
        }
    }
}
