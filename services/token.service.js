const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token.model');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '1m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '5d'});
        return {
            accessToken,
            refreshToken
        }
    }

    // Тут сохраняется только refreshToken
    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId});
        console.log('tokenData', tokenData);
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await tokenModel.create({user: userId, refreshToken});
    }

    async refresh(refreshToken) {
        const newRefreshToken = jwt.sign(refreshToken, process.env.JWT_REFRESH_SECRET, {expiresIn: '5d'});
        const token = await tokenModel.updateOne({refreshToken}, {refreshToken: newRefreshToken});
        return token;
    }

    async findToken(refreshToken) {
        const token = await tokenModel.findOne({refreshToken});
        return token;
    }

    validateAccessToken(token) {
        const data = jwt.verify(token, process.env.JWT_ACCESS_SECRET, {ignoreExpiration: true})
        if (data) {
            try {
                return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            } catch (e) {
                console.log('need to get new access token', e)
                throw new Error(e)
            }
        } else {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        } catch (e) {
            return null
        }
    }

    async clearAllTokens() {
        const deletedData = await tokenModel.deleteMany({});
        return deletedData;
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({refreshToken});
        return tokenData;
    }
}

module.exports = new TokenService();
