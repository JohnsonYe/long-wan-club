const jwt = require('jsonwebtoken');
const { OuathChecker } = require('../validators/ouath');
const { Users } = require('../datasources/users');
const { ErrorHandler } = require('../resHandler');
const utils = require('../utils');

class UserManager {
    constructor() {}

    /**
     * A function to create new user into user sql table
     * @param {Object} user 
     */
    async createUser(user, isAdmin) {
        if (!utils.isObject(user)) {
            console.error("Error - createUser param is not an object", user);
            throw new ErrorHandler();
        }
        let userTable = new Users();
        const userId = await userTable.create(user, isAdmin);
        return userId;
    }

    /**
     * A function to get a Single user by contact_number
     * @param {Number} username 
     * @return {Object|Null}
     */
    async getUser(username) {
        let userTable = new Users();
        let user = await userTable.get('contact_number', username);
        return user ? user[0] : user;
    }

    deleteUser() {}

    editUser() {}

    /**
     * A function to verify user by username and compare password
     * @param {String|Number} username 
     * @param {String} password 
     * @return {Object|Error}
     */
    async verifyLoginUser(username, password) {
        let ouathValidator = new OuathChecker({username: username, password: password});
        ouathValidator.loginFieldChecker();
        let user = await this.getUser(username);
        if (!user) throw new ErrorHandler(401, "账户或密码不正确!");
        if (!(await ouathValidator.passwordChecker(user.password))) throw new ErrorHandler(401, "账户或密码不正确!");
        return user;
    }

    /**
     * A function to verify register user.
     * @param {Number|String} login_id 
     * @param {String} password 
     * @param {String} first_name 
     * @param {String} last_name 
     * @param {Number} identification_number
     * @return {Object|Error}
     */
    async verifyRegisterUser(username, password, first_name, last_name, identification_number) {
        let ouathValidator = new OuathChecker({username: username, password, first_name, last_name, identification_number});
        ouathValidator.registerFieldChecker();
        let user = await this.getUser(username);
        if (user) throw new ErrorHandler(409, "此用户已存在.");
        user = {
            contact_number: username,
            password: password,
            name: last_name+first_name,
            identification_number: identification_number
        };
        return user;
    }

    /**
     * A function that assign JWT token to user
     * @param {Object} user 
     */
    assignAccessToken(user) {
        if (!utils.isObject(user)) {
            console.error("Error - assignAccessToken param is not an object", user);
            throw new ErrorHandler();
        }
        const params = {
            user_id: user.contact_number,
            name: user.name,
            is_admin:user.is_admin
        };
        const token = jwt.sign(params, process.env.JWT_ACCESS_SECRET_KEY, { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME });
        return token;
    }

    assignRefreshToken(user) {
        if (!utils.isObject(user)) {
            console.error("Error - assignRefreshToken param is not an object", user);
            throw new ErrorHandler();
        }
        const token = jwt.sign({ login_id: user.contact_number }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME });
        return token;
    }
}


module.exports.UserManager = UserManager;