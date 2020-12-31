const jwt = require('jsonwebtoken');


function verify (token, type) {
    const key = type === "refresh" ? process.env.JWT_REFRESH_SECRET_KEY : process.env.JWT_ACCESS_SECRET_KEY;
    return jwt.verify(token, key, (err, data) => {
        if (err) {
            return null;
        } else {
            return data;
        }
    });
}


module.exports.verify = verify;