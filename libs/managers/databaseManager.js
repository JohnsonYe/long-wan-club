const { PostgreSQL } = require('../datasources/postgreSQL');

class DatabaseManager {
    constructor (database) {
        switch (database) {
            case "postgresql": 
                this.db = new PostgreSQL();
                break;
            default:
                throw new Error("Need to defind a database type. (postgresql)");
        }
    }

    database() {
        return this.db;
    }
}

module.exports = DatabaseManager;