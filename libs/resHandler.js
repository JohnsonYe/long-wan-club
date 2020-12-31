/*
 * A error handler inhertance from Error Class object
 */
class ErrorHandler extends Error {
    /**
     * @param {Number} statusCode, default 500
     * @param {String} message, default Internal server error
     */
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode || 500;
        this.message = message || "Internal server error.";
    }
}

/**
 * A middelware function for handling respond
 * @param {Object} err 
 * @param {Object} res 
 */
const handleError = (err, res) => {
    const { 
        statusCode, 
        message
    } = err;
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    });
}

// const successRespondHanlder = (respondObject, res) => {
//     var statusCode = 200;
//     const {
//         data,
//         message
//     } = respondObject;
//     res.status(statusCode).json({
//         status: 'success',
//         statusCode,
//         message
//     });
// }

module.exports.ErrorHandler = ErrorHandler;

module.exports.handleError = handleError;