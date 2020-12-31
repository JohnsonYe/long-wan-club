const { Pool } = require('pg');
const { ErrorHandler } = require('../resHandler');

const pool = new Pool({
    "user": process.env.AWS_RDS_USER || "",
    "host": process.env.AWS_RDS_HOST || "127.0.0.1",
    "database": process.env.AWS_RDS_DATABASE || "localhost-longwanclub",
    "password": process.env.AWS_RDS_PASSWORD || "",
    "port": process.env.AWS_RDS_PORT || "5432",
    "max": Number(process.env.AWS_RDS_MAX_CONNECTION) || 20,
    "connectionTimeoutMillis" : 0,
    "idleTimeoutMillis": 0
});

class PostgreSQL {
    constructor () {
        this.db = pool;
    }

    async query(queryString, options) {
        try {
            let data = options ? await this.db.query(queryString, options) : await this.db.query(queryString);
            return data.rows;
        } catch (err) {
            console.error("Error from PostgreSQL: (" + queryString + "," + " " + options + ").", err)
            throw new ErrorHandler();
        }
    }
}

module.exports.PostgreSQL = PostgreSQL;