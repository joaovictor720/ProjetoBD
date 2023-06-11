const database = require('./dbConnection');

class CRUD {
    /** 
     * CREATE METHODS
     */

    async registerUser(name, type, email, password, anime, team, hometown) {
        return await database.query(
            `INSERT INTO users (name, type, email, password, favorite_anime, favorite_team, hometown) 
            VALUES ('${name}', '${type}', '${email}', '${password}', '${anime}', '${team}', '${hometown}')
            RETURNING id, name, type, email;`
        );
    }

    async registerProduct(name, price, category, color, size, count, city) {
        return await database.query(
            `INSERT INTO product (name, price, category, color, size, count, city) 
            VALUES ('${name}', ${price}, '${category}', '${color}', '${size}', ${count}, '${city}')
            RETURNING name, price, category, color, size, count, city;`
        );
    }

    async registerPurchase(userId, boughtProducts) {
        let newPurchase = await database.query(
            `INSERT INTO purchase (user_id) 
            VALUES (${userId})
            RETURNING id;`
        );

        boughtProducts.forEach(async (boughtProduct) => {
            await database.query(
                `INSERT INTO purchase_products (purchase_id, product_id, count) 
                VALUES (${newPurchase.rows[0].id}, ${boughtProduct.id}, ${boughtProduct.count});`
            );
            await database.query(
                `UPDATE product
                SET count = count - ${boughtProduct.count}
                WHERE id = ${boughtProduct.id};`
            );
        });
        return newPurchase;
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
        return await database.query(
            `SELECT *
            FROM product
            WHERE price BETWEEN ${smallerPrice} AND ${biggerPrice};`
        );
    }

    async getProductsByCity(city) {
        return await database.query(
            `SELECT *
            FROM product
            WHERE city LIKE '%${city}%';`
        );
    }

    async getProductsByCount(count) {
        return await database.query(
            `SELECT *
            FROM product
            WHERE count <= ${count};`
        );
    }

    async getCurrentMonthReports(){
        let currentMonth = new Date().getMonth();
        return await database.query(
            `SELECT *
            FROM monthly_report
            WHERE month = ${currentMonth};`
        );
    }

    async getEmployeeMonthlyReport(employeeId) {
        return await database.query(
            `SELECT *
            FROM monthly_report
            WHERE E.id = ${employeeId};`
        );
    }

    async getUserByEmail(email) {
        return await database.query(
            `SELECT * 
            FROM users 
            WHERE email = '${email}';`
        );
    }

    async getClientPurchases(clientId) {
        return await database.query(
            `SELECT *
            FROM users
            WHERE id = ${clientId};`
        );
    }

    /**
     * UPDATE METHODS
     */

    async updateProduct(productId, name, price, category, color, size, count, city){
        return await database.query(
            `UPDATE product 
            SET name = '${name}', price = ${price}, category = '${category}', color = '${color}', size = '${size}', count = ${count}, city = '${city}'
            WHERE id = ${productId};`
        );
    }

    /**
     * DELETE METHODS
     */

    async deleteProductById(productId){
        return await database.query(
            `DELETE FROM product 
            WHERE id = ${productId};`
        );
    }

    async deleteProductByName(name){
        return await database.query(
            `DELETE FROM product 
            WHERE name LIKE '%${name}%';`
        );
    }
}

module.exports = CRUD