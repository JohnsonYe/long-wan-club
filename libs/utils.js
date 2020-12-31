const bcrypt = require('bcrypt');

function isArray(array) {
    return (!!array) && (array.constructor == Array);
}

function isObject(object) {
    return (!!object) && (object.constructor === Object);
};

function isNumber(number) {
    return /^\d+$/.test(number);
}

function removeWhiteSpace(str) {
    return str.replace(/\s+/g, '');
}

async function saltPassword(password) {
    return await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
}

module.exports.isArray = isArray;
module.exports.isObject = isObject;
module.exports.isNumber = isNumber;
module.exports.removeWhiteSpace = removeWhiteSpace;
module.exports.saltPassword = saltPassword;