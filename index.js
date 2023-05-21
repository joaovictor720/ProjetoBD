const express = require('express');
const database = require('./dbConnection');
const app = express();

app.use(express.json())

/************
 * QUERIES *
************/

/** CREATING DATA:
 *  
 * Register a client: INSERT INTO client (name, type, email, password) VALUES (${name}, ${type}, ${email}, ${password});
 * Register a product: INSERT INTO product (name, price, category, color, size) VALUES (${name}, ${price}, ${category}, ${color}, ${size});
 * Register a purchase: INSERT INTO purchase (client_id) VALUES (${id});
 * Register the list of products of a purchase: INSERT INTO purchase_products (purchase_id, product_id) VALUES (${purchase_id}, ${product_id});
 * 
*/ 

/** RETRIEVING DATA:
 * 
 * Get all products available: SELECT * FROM product;
 * Get products by name: SELECT * FROM product WHERE name LIKE(%${name}%);
 * Get products by category: SELECT * FROM product WHERE category LIKE(%${category}%);
 * Get user password and type by email: SELECT * FROM client WHERE email = '${email}';
 * 
 */

/** UPDATING DATA:
 * 
 * Update product price: UPDATE product SET price = ${price} WHERE id = ${id};
 * 
 */

/** DELETING DATA:
 * 
 * Deleting a product by 'id': DELETE FROM product WHERE id = ${id};
 * Deleting a product by 'name': DELETE FROM product WHERE name LIKE(%${name}%);
 * 
 */

/**********
 * ROUTES *
***********/

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await database.query('SELECT * FROM product;');
    res.json(products.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get products by name
app.get('/products/name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const products = await database.query(`SELECT * FROM product WHERE name LIKE(%${name}%);`)
    res.json(products.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// Get products by category
app.get('/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await database.query(`SELECT * FROM product WHERE name LIKE(%${category}%);`)
    res.json(products.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// Validate user credentials
app.get('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await database.query(`SELECT * FROM client WHERE email = '${email}';`);

    if (!user){
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (password !== user.fields.password) {
      // If the password is invalid, return an error response
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ userType: `${user.fields.type}` });

  } catch (error) {
    console.error(error.message);
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});