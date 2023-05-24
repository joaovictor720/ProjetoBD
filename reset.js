const database = require('./dbConnection');

async function resetDatabase(res) {
    try {
        // Deleting all possibly existing tables
        await database.query('DROP TABLE IF EXISTS purchase_products CASCADE;');
        await database.query('DROP TABLE IF EXISTS purchase CASCADE;');
        await database.query('DROP TABLE IF EXISTS client CASCADE;');
        await database.query('DROP TABLE IF EXISTS users CASCADE;');
        await database.query('DROP TABLE IF EXISTS product CASCADE;');

        // Creating all tables
        await database.query(
            `CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                type VARCHAR(20) NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(50) NOT NULL
            );`
        );
        await database.query(
            `CREATE TABLE purchase(
                id SERIAL PRIMARY KEY,
                user_id SERIAL,
            
                CONSTRAINT purchase_client_fk FOREIGN KEY (user_id)
                REFERENCES users (id)
            );`
        );
        await database.query(
            `CREATE TABLE product(
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                price FLOAT NOT NULL,
                category VARCHAR(15) NOT NULL,
                color VARCHAR(10) NOT NULL,
                size VARCHAR(1) NOT NULL,
                count INTEGER NOT NULL
            );`
        );
        await database.query(
            `CREATE TABLE purchase_products(
                purchase_id INTEGER,
                product_id INTEGER,
                count INTEGER,
            
                CONSTRAINT product_list_pk PRIMARY KEY (purchase_id, product_id),
                CONSTRAINT purchase_fk FOREIGN KEY (purchase_id) REFERENCES purchase (id),
                CONSTRAINT product_fk FOREIGN KEY (product_id) REFERENCES product (id)
            );`
        );

    } catch (error) {
        console.error({
            message: 'Error while reseting database',
            errorMessage: error.message
        });
        res.status(500).json({
            message: 'Error while reseting database',
            errorMessage: error.message
        });
    }
}

module.exports = resetDatabase;