const database = require('./dbConnection');

class CRUD {
    /** 
     * CREATE METHODS
     */

    async registerUser(name, type, email, password, anime, team, hometown) {
        var registeredUser;
        try {
            registeredUser = await database.query(
                `INSERT INTO users (name, type, email, password, anime, team, hometown) 
                VALUES ('${name}', '${type}', '${email}', '${password}', '${anime}', '${team}', '${hometown}')
                RETURNING id, name, type, email, anime, team, hometown;`
            );
            console.log(registeredUser);
        } catch (error) {
            console.error(error.message);
            registeredUser = { message: 'Usuário já existe' }
        }
        return registeredUser;
    }

    async registerProduct(name, price, category, color, size, count, city) {
        return await database.query(
            `INSERT INTO product (name, price, category, color, size, count, city) 
            VALUES ('${name}', ${price}, '${category}', '${color}', '${size}', ${count}, '${city}')
            RETURNING name, price, category, color, size, count, city;`
        );
    }

    async registerPurchase(userId, month, total, boughtProducts) {
        let productListQuery = '';
        for (let i in boughtProducts){
            productListQuery += `(${boughtProducts[i].id}, ${boughtProducts[i].count})`;
            if (i < boughtProducts.length-1){
                productListQuery += ', ';
            }
        }
        // DEBUG
        console.log('Concatenated products: ' + productListQuery);
        await database.query(
            `CALL make_purchase(${userId}, ${month}, ${total}, ARRAY[ ${productListQuery} ]::product_list[]);`
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
        let currentMonth = new Date().getMonth()+1;
        return await database.query(
            `SELECT *
            FROM monthly_report
            WHERE month = ${currentMonth};`
        );
    }

    async getReportsByMonth(month){
        return await database.query(
            `SELECT *
            FROM monthly_report
            WHERE month = ${month};`
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
            FROM purchase
            WHERE user_id = ${clientId};`
        );
    }
    
    async getPurchaseProducts(purchaseId){
        return await database.query(
            `SELECT Prod.id, Prod.name, Prod.price, Prod.category, Prod.color, Prod.size, Prod.city, p_list.count
            FROM purchase AS Purch
            INNER JOIN purchase_products AS p_list
            ON Purch.id = p_list.purchase_id
            INNER JOIN product AS Prod
            ON p_list.product_id = Prod.id
            WHERE Purch.id = ${purchaseId};`
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