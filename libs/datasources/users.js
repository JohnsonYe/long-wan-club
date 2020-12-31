const DatabaseManager = require('../managers/databaseManager');
const { ErrorHandler } = require('../resHandler');

class Users {
    constructor() {
        this.user = new DatabaseManager('postgresql').database();
    }

    /**
     * A function to query data from user table in sql
     * @param {string} attribute 
     * @param {string|Number|Boolean|Timestamp} value 
     * 
     * @return {Array} a list of object
     */
    async get(attribute, value) {
        let queryString = `select * from users where ${attribute}=$1`,
            options = [value];
        try {
            const user = await this.user.query(queryString, options);
            return user.length ? user : null;
        } catch (err) {
            console.error(`Error: User class - get(${attribute}, ${value})`);
            throw new ErrorHandler();
        }
    }

    async create(user, isAdmin) {
        if (isAdmin) {
            var queryString = `insert into users("name", "password", "identification_number", "contact_number", "is_admin") values ($1, $2, $3, $4, $5) returning "id"`,
                options = [user.name, user.saltedPassword, user.identification_number, user.contact_number, true];
        } else {
            var queryString = `insert into users("name", "password", "identification_number", "contact_number") values ($1, $2, $3, $4) returning "id"`,
                options = [user.name, user.saltedPassword, user.identification_number, user.contact_number];
        }
        try {
            createUserObjectValidation(user);
            const [data] = await this.user.query(queryString, options)
            return data.id;
        } catch (err) {
            console.error("Error: User class - creat(", user, ")", err);
            throw new ErrorHandler();
        }
    }
}

function createUserObjectValidation (user) {
    const attributes = ["name", "password", "identification_number", "contact_number"];
    for (var attribute of attributes) {
        if (!(attribute in user)) {
            console.error(`Error - createUserObjectValidation. Missing ${attribute}.`)
            throw new ErrorHandler();
        }
    }
}

module.exports.Users = Users;