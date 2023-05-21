const express = require('express');
const pool = require('./dbConnection');
const app = express();
/*
const { spawn } = require('child_process');
const scriptPath = 'C:/Users/João Victor/Desktop/Repo BD/database.sql';
const psql = spawn('psql', ['-d', 'project_db', '-f', scriptPath]);

psql.on('error', (err) => {
  console.error('Failed to start psql process', err);
});

psql.stderr.on('data', (data) => {
  console.error(`psql stderr: ${data}`);
});

psql.on('close', (code) => {
  if (code !== 0) {
    console.error(`psql process exited with code ${code}`);
  } else {
    console.log('Script executed successfully');
  }
});
*/

var variavel = "123";
variavel = 123;

app.use(express.json())

/************
 * QUERIES *
************/

/** CREATING DATA:
 *  
 * Register a client: INSERT INTO client (name, type, email, password) VALUES ($1, $2, $3, $4);
 * Register a product: INSERT INTO product (name, price, category, color, size) VALUES ($1, $2, $3, $4, $5);
 * Register a purchase: INSERT INTO purchase (client_id) VALUES ($1);
 * Register the list of products of a purchase: INSERT INTO purchase_products (purchase_id, product_id) VALUES ($1, $2);
 * 
*/ 

/** RETRIEVING DATA:
 * 
 * Get all products: SELECT * FROM product;
 * Get products by name: SELECT * FROM product WHERE name LIKE(%$1%);
 * Get user password and type by email: SELECT password, type FROM client WHERE email = '$1';
 * 
 */

/** UPDATING DATA:
 * 
 */

/** DELETING DATA:
 * 
 */

var clients = pool.query("INSERT INTO client (name, type, email, password) VALUES ('Leo', 'Client', 'leo@teste.com', 'password123');");
console.log(clients);
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});