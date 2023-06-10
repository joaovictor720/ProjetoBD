const database = require('./dbConnection');

class CRUD {
    /** 
     * CREATE METHODS
     */
    async registerUser(name, type, email, password, anime, team, hometown){
        return await database.query(
            `INSERT INTO users (name, type, email, password, favorite_anime, favorite_team, hometown) 
            VALUES ('${name}', '${type}', '${email}', '${password}', '${anime}', '${team}', '${hometown}')
            RETURNING id, name, type, email;`
        );
    }

    /**
     * READ METHODS
     */
    async getAllProducts() {
        return await database.query('SELECT * FROM product;');
    }

    async getProductsByName(name) {
        return await database.query(
            `SELECT * 
            FROM product 
            WHERE name LIKE '%${name}%';`
        );
    }

    async getProductsByCategory(category) {
        return await database.query(
            `SELECT * 
            FROM product 
            WHERE category LIKE '%${category}%';`
        );
    }

    async getProductsByPriceInterval(smallerPrice, biggerPrice) {

    }

    async getProductsByCity(city) {

    }

    async getProductsByCount(count) {

    }

    async getEmployeeMonthlyReport(employeeId) {

    }

    async getUserByEmail(email) {
        return await database.query(
            `SELECT * 
            FROM users 
            WHERE email = '${email}';`
        );
    }

    async getClientPurchases(clientId) {

    }

    /**
     * UPDATE METHODS
     */

    /**
     * DELETE METHODS
     */
}

module.exports = CRUD