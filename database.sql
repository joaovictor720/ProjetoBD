-- Recreating the main database
DROP DATABASE IF EXISTS project_db;
CREATE DATABASE project_db;

-- Connecting to the created database
\c project_db

-- Deleting all possibly existing tables
DROP TABLE IF EXISTS purchase_products CASCADE;
DROP TABLE IF EXISTS purchase CASCADE;
DROP TABLE IF EXISTS client CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS product CASCADE;

-- Creating all tables
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL
);

CREATE TABLE purchase(
    id SERIAL PRIMARY KEY,
    user_id SERIAL,

    CONSTRAINT purchase_client_fk FOREIGN KEY (user_id)
    REFERENCES users (id)
);

CREATE TABLE product(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price FLOAT NOT NULL,
    category VARCHAR(15) NOT NULL,
    color VARCHAR(10) NOT NULL,
    size VARCHAR(1) NOT NULL,
    count INTEGER NOT NULL
);

CREATE TABLE purchase_products(
    purchase_id INTEGER,
    product_id INTEGER,
    count INTEGER,

    CONSTRAINT product_list_pk PRIMARY KEY (purchase_id, product_id),
    CONSTRAINT purchase_fk FOREIGN KEY (purchase_id) REFERENCES purchase (id),
    CONSTRAINT product_fk FOREIGN KEY (product_id) REFERENCES product (id)
);

ALTER TABLE product ADD CONSTRAINT unique_product_name UNIQUE (name);
ALTER TABLE product ALTER COLUMN size TYPE VARCHAR(2);
ALTER TABLE product DROP CONSTRAINT unique_product_name;

CREATE VIEW monthly_report AS
SELECT Product.id AS product_id, Product.name AS product_name, Product.size, Purch.month, COUNT(*) AS sold_count
FROM purchase_products AS p_list
INNER JOIN product AS Product ON p_list.product_id = Product.id
INNER JOIN purchase AS Purch ON Purch.id = p_list.purchase_id
WHERE p_list.purchase_id IS NOT NULL
GROUP BY Product.id, Product.name, Purch.month;

CREATE TYPE product_list AS (
    product_id INTEGER,
    count INTEGER
);

CREATE OR REPLACE PROCEDURE make_purchase(
    client_id INTEGER,
    purchase_month INTEGER,
    purchase_total FLOAT,
    bought_products product_list[]
)
    AS $$
    DECLARE
        available_amount INTEGER;
        purchase_id INTEGER;
        product_price FLOAT;
        --purchase_total FLOAT;
    BEGIN

    -- Verify if purchasing the products is possible
    --FOREACH bought_product IN ARRAY bought_products
    --LOOP
    FOR i IN array_lower(bought_products, 1) .. array_upper(bought_products, 1)
    LOOP
        SELECT count INTO available_amount
        FROM product
        WHERE id = bought_products[i].product_id;

        IF available_amount < bought_products[i].count THEN
            RAISE EXCEPTION 'Insufficient amount available for product_id: %', bought_products[i].product_id;
        END IF;

        SELECT price INTO product_price
        FROM product
        WHERE id = bought_products[i].product_id;
        
        --purchase_total := purchase_total + product_price;
    END LOOP;

    -- Register a new purchase
    INSERT INTO purchase (user_id, month, total)
    VALUES (client_id, purchase_month, purchase_total)
    RETURNING id INTO purchase_id;

    -- Register the products bought in the purchase
    --FOREACH bought_product IN ARRAY bought_products
    --LOOP
    FOR i IN array_lower(bought_products, 1) .. array_upper(bought_products, 1)
    LOOP
        INSERT INTO purchase_products (purchase_id, product_id, count)
        VALUES (purchase_id, bought_products[i].product_id, bought_products[i].count);

        UPDATE product
        SET count = count - bought_products[i].count
        WHERE id = bought_products[i].product_id;
    END LOOP;
    END;
$$ LANGUAGE plpgsql;