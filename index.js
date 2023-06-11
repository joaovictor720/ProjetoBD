const express = require('express');
const CRUD = require('./queries/CRUD');
const facade = new CRUD();
const app = express();

app.use(express.json());

/**********
 * ROUTES *
***********/

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = facade.getAllProducts();
    res.json(products.rows);
  } catch (err) {
    console.error(err.message);
    res.json(error.message);
  }
});

// Get products by name
app.get('/products/name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const products = facade.getProductsByName(name);
    res.json(products.rows);
  } catch (error) {
    console.error(error.message);
    res.json(error.message);
  }
});

// Get products by category
app.get('/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = facade.getProductsByCategory(category);
    res.json(products.rows);
  } catch (error) {
    console.error(error.message);
    res.json(error.message);
  }
});

// Get this month reports
app.get('/users/reports', async (req, res) => {
  try {
    const reports = facade.getCurrentMonthReports();
  } catch (error) {
    console.error(error.message);
    res.json(error.message);
  }
});

// Validate user credentials
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = facade.getUserByEmail(email);

    if (!user){
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // If the password is invalid, return an error response
    if (password !== user.rows[0].password) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    res.json(user.rows[0]);

  } catch (error) {
    console.error(error.message);
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

// Register a new user
app.post('/users', async (req, res) => {
  try {
    const { name, type, email, password, anime, team, hometown } = req.body;
    const newUser = facade.registerUser(name, type, email, password, anime, team, hometown);
    res.json(newUser.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ message: 'User already exists' });
  }
});

// Register a new product
app.post('/products', async (req, res) => {
  try {
    const { name, price, category, color, size, count, city } = req.body;
    facade.registerProduct(name, price, category, color, size, count, city);
    const allProducts = facade.getAllProducts();
    res.json(allProducts.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Produto já existe' });
  }
});

// Register a purchase
app.post('/purchases', async (req, res) => {
  try {
    const { userId, boughtProducts } = req.body;
    /*
    const newPurchase = await database.query(
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
    */
    const newPurchase = facade.registerPurchase(userId, boughtProducts);

    res.json(newPurchase.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.json(error.message);
  }
});

// Update a product
app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, color, size, count, city } = req.body;

    facade.updateProduct(id, name, price, category, color, size, count, city);
    const updatedProducts = facade.getAllProducts();
    res.json(updatedProducts.rows);
  } catch (error) {
    console.error(error.message);
    res.json(error.message);
  }
});

// Delete a product by id
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    facade.deleteProductById(id);
    const deletedProducts = facade.getAllProducts();
    res.json(deletedProducts.rows);
  } catch (error) {
    console.error(error.message);
    res.json(error.message);
  }
});

// Delete a product by name
app.delete('/products/:name', async (req, res) => {
  try {
    const { name } = req.params;
    facade.deleteProductByName(name);
    const deletedProducts = facade.getAllProducts();
    res.json(deletedProducts.rows);
  } catch (error) {
    console.error(error.message);
    res.json(error.message);
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});