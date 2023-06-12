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

CREATE VIEW monthly_report(product_id, product_name, sold_count) AS
SELECT Product.id, Product.name, COUNT(*) AS sold_count
FROM purchase_products AS p_list
INNER JOIN product AS Product
ON p_list.product_id = Product.id
WHERE p_list.purchase_id NOT NULL
GROUP BY p_list.product_id;

CREATE OR REPLACE FUNCTION get_monthly_report(month INTEGER, year INTEGER)
    RETURNS TABLE (
        product_name VARCHAR,
        quantity_sold INTEGER,
        partial_amount NUMERIC,
        total_amount NUMERIC
    )
    AS $$
    BEGIN
    RETURN QUERY
    SELECT
        p.product_name,
        SUM(s.quantity) AS quantity_sold,
        SUM(s.quantity * s.unit_price) AS partial_amount,
        SUM(s.quantity * s.unit_price) OVER () AS total_amount
    FROM
        sales s
    INNER JOIN
        products p ON s.product_id = p.product_id
    WHERE
        EXTRACT(MONTH FROM s.sale_date) = month
        AND EXTRACT(YEAR FROM s.sale_date) = year
    GROUP BY
        p.product_name;
    END;
$$ LANGUAGE plpgsql;