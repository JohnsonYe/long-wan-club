/* Dependencies */
const bcrypt = require('bcrypt');
const { ErrorHandler } = require('../resHandler');
const { isNumber, removeWhiteSpace } = require('../utils');

/* Responsed Messages */
const INPUT_PHONE_NUM_STR = "请输入正确手机号码";
const INPUT_PASSWORD_STR = "请输入密码";
const WRONG_PASSWORD_STR = "密码错误";
const INPUT_NAME_STR = "请输入正确姓名";
const INPUT_ID_STR = "请输入身份证号码";
const WRONG_ID_STR = "请输入正确的身份证号码";

class OuathChecker {
    constructor ({username, password, first_name, last_name, identification_number}) {
        this.username = username || '';
        this.password = password || '';
        this.first_name = first_name || '';
        this.last_name = last_name || '';
        this.identification_number = identification_number || '';
    }

    /**
     * A void function to check login input file string
     * throw error if invalid input
     * @return {void}
     */
    loginFieldChecker() {
        __checkUsername(this.username);
        __checkPassword(this.password);
    }

    /**
     * A function check All input field of register attribute
     * @return {void}
     */
    registerFieldChecker() {
        __checkUsername(this.username);
        __checkPassword(this.password);
        __checkName(this.first_name);
        __checkName(this.last_name);
        __checkIdentityNumber(this.identification_number);
    }

    /**
     * A function to verify user by their password
     * @param {String} saltPassword 
     * @returns {Boolean}
     */
    async passwordChecker(saltPassword) {
        return await bcrypt.compare(this.password, saltPassword);
    }
}

/**
 * A checker function to check user login phone number
 * @param {number} username 
 */
function __checkUsername (username) {
    if (!username) throw new ErrorHandler(400, INPUT_PHONE_NUM_STR);   /* check empty */
    if (!isNumber(username) || username.toString().length !== 11) throw new ErrorHandler(400, INPUT_PHONE_NUM_STR);    /* check number only 11 digit */
}

function __checkPassword (password) {
    if (!password) throw new ErrorHandler(400, INPUT_PASSWORD_STR);   /* check empty */
    if (password.toString().length < 8) throw new ErrorHandler(400, WRONG_PASSWORD_STR);
}

function __checkName (name) {
    if (!isNaN(name) || !removeWhiteSpace(name).length) throw new ErrorHandler(400, INPUT_NAME_STR);
}

function __checkIdentityNumber (id) {
    if (!id) throw new ErrorHandler(400, INPUT_ID_STR);
    if (!isNumber(id) || (id.toString().length !== 18 && id.toString().length !== 15)) throw new ErrorHandler(400, WRONG_ID_STR);
}

module.exports.OuathChecker = OuathChecker;