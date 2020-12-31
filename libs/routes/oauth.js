const router = require('express').Router();
const { ErrorHandler } = require('../resHandler');
const { UserManager } = require('../managers/userManager');
const TokenChecker = require('../validators/token');
const utils = require('../utils');

router.post('/login', async(req, res, next) => {
    const { login_id, password } = req.body;
    try {
        let userManager = new UserManager();
        const user = await userManager.verifyLoginUser(login_id, password);
        const accessToken = userManager.assignAccessToken(user);
        const refresh_token = userManager.assignRefreshToken(user);
        res.status(200).json({
            status: 'success',
            message: "Authentication Success.",
            data: {
                name: user.name,
                login_id: user.contact_number,
                access_token: accessToken,
                refresh_token: refresh_token
            }
        });
    } catch (err) {
        next(err);
    }
});

router.post('/register', async(req, res, next) => {
    const { login_id, password, first_name, last_name, identification_number } = req.body;
    try {
        let userManager = new UserManager();
        const user = await userManager.verifyRegisterUser(login_id, password, first_name, last_name, identification_number);
        user.saltedPassword = await utils.saltPassword(user.password)
        user.id = await userManager.createUser(user);
        const accessToken = userManager.assignAccessToken(user);
        const refresh_token = userManager.assignRefreshToken(user);
        res.status(200).json({
            status: 'success',
            message: 'Authentication Success.',
            data: {
                name: user.name,
                login_id: user.contact_number,
                access_token: accessToken,
                refresh_token: refresh_token
            }
        });
    } catch (err) {
        next (err);
    }
});

router.post('/token/refresh', async(req, res, next) => {
    const { refresh_token } = req.body;
    try {
        if (!refresh_token) throw new ErrorHandler(400, "Unauthroized.");
        let userIdentifier = TokenChecker.verify(refresh_token, 'refresh');
        if (!userIdentifier) throw new ErrorHandler(403, "Forbidden.");
        let userManager = new UserManager();
        let user = await userManager.getUser(userIdentifier.login_id);
        let accessToken = userManager.assignAccessToken(user);
        let new_refresh_token = userManager.assignRefreshToken(user);
        res.status(200).json({
            status: 'success',
            message: 'Authentication Success.',
            data: {
                name: user.name,
                login_id: user.contact_number,
                access_token: accessToken,
                refresh_token: new_refresh_token
            }
        });
    } catch (err) {
        next(err);
    }
    
})

module.exports = router