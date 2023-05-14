-- Recreating the main database
DROP DATABASE IF EXISTS project_db;
CREATE DATABASE project_db;

-- Connecting to the created database
\c project_db

-- Creating all tables
CREATE TABLE client(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    type VARCHAR(20),
    email VARCHAR(50),
    password VARCHAR(50)
);

CREATE TABLE purchase(
    id SERIAL PRIMARY KEY,
    client_id SERIAL,

    CONSTRAINT purchase_client_fk FOREIGN KEY (client_id)
    REFERENCES client (id)
);

CREATE TABLE product(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    price FLOAT,
    category VARCHAR(15),
    color VARCHAR(10),
    size VARCHAR(1)
);

CREATE TABLE purchase_products(
    purchase_id INTEGER,
    product_id INTEGER,
    count INTEGER

    CONSTRAINT product_list_pk PRIMARY KEY (purchase_id, product_id),
    CONSTRAINT purchase_fk FOREIGN KEY (purchase_id) REFERENCES purchase (id),
    CONSTRAINT product_fk FOREIGN KEY (product_id) REFERENCES product (id)
);