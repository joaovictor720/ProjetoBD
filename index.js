const express = require('express');
const database = require('./dbConnection');
const app = express();

app.use(express.json());

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
    res.send(error.message);
  }
});

// Get products by name
app.get('/products/name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const products = await database.query(
      `SELECT * 
      FROM product 
      WHERE name LIKE(%${name}%);`
    );
    res.json(products.rows);
  } catch (error) {
    console.error(error.message);
    res.send(error.message);
  }
});

// Get products by category
app.get('/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await database.query(
      `SELECT * 
      FROM product 
      WHERE category LIKE(%${category}%);`
    );
    res.json(products.rows);
  } catch (error) {
    console.error(error.message);
    res.send(error.message);
  }
});

// Validate user credentials
app.get('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await database.query(
      `SELECT * 
      FROM users 
      WHERE email = '${email}';`
    );

    if (!user){
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If the password is invalid, return an error response
    if (password !== user.fields.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json(user);

  } catch (error) {
    console.error(error.message);
    res.send(error.message);
  }
});

// Register a new user
app.post('/users', async (req, res) => {
  try {
    const { name, type, email, password } = req.body;
    const newUser = await database.query(
      `INSERT INTO users (name, type, email, password) 
      VALUES ('${name}', '${type}', '${email}', '${password}')
      RETURNING id, name, type, email;`
    );
    res.json(newUser);
  } catch (error) {
    console.error(error.message);
    res.send(error.message);
  }
});

// Register a new product
app.post('/products', async (req, res) => {
  try {
    const { name, price, category, color, size } = req.body;
    const newProduct = await database.query(
      `INSERT INTO product (name, price, category, color, size) 
      VALUES ('${name}', ${price}, '${category}', '${color}', '${size}');`
    );
    res.json(newProduct);
  } catch (error) {
    console.error(error.message);
    res.send(error.message);
  }
});

// Register a purchase
app.post('/purchases', async (req, res) => {
  try {
    const { clientId, boughtProducts } = req.body;
    const newPurchase = await database.query(
      `INSERT INTO purchase (client_id) 
      VALUES (${clientId})
      RETURNING id;`
    );

    boughtProducts.forEach(async (boughtProduct) => {
      await database.query(
        `INSERT INTO purchase_products (purchase_id, product_id, count) 
        VALUES (${newPurchase.fields.id}, ${boughtProduct.id}, ${boughtProduct.count});`
      );
      await database.query(
        `UPDATE product
        SET count = count - ${boughtProduct.count}
        WHERE id = ${boughtProduct.id};`
      );
    });
    
    res.json(newPurchase);
  } catch (error) {
    console.error(error.message);
    res.send(error.message);
  }
});

// Update a product
app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { product } = req.body;

    const updatedProduct = await database.query(
      `UPDATE product 
      SET name = ${procuct.name}, price = ${product.price}, category = ${product.category}, color = ${product.color}, size = ${product.size}, count = ${product.count}
      WHERE id = ${id};`
    );
    res.json(updatedProduct);
  } catch (error) {
    console.error(error.message);
    res.send(error.message);
  }
});

// Delete a product
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await database.query(
      `DELETE FROM product WHERE id = ${id};`
    );
    res.json(deletedProduct);
  } catch (error) {
    console.error(error.message);
    res.send(error.message);
  }
});

// Delete a product by name
app.delete('/products/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const deletedProduct = await database.query(
      `DELETE FROM product WHERE name LIKE(%${name}%);`
    );
    res.json(deletedProduct);
  } catch (error) {
    console.error(error.message);
    res.send(error.message);
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});