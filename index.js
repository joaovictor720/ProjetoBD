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
    const products = await facade.getAllProducts();
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
    const products = await facade.getProductsByName(name);
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
    const products = await facade.getProductsByCategory(category);
    res.json(products.rows);
  } catch (error) {
    console.error(error.message);
    res.json(error.message);
  }
});

// Get this month reports
app.get('/users/reports', async (req, res) => {
  try {
    const reports = await facade.getCurrentMonthReports();
    res.json(reports.rows);
  } catch (error) {
    console.error(error.message);
    res.json(error.message);
  }
});

// Get reports by month
app.get('/users/reports/:month_number', async (req, res) => {
  try {
    const { month_number } = req.params;
    const reports = await facade.getReportsByMonth(month_number);
    res.json(reports.rows);
  } catch (error) {
    console.error(error.message);
    res.json(error.message);
  }
});

app.get('/users/purchases/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userPurchases = await facade.getClientPurchases(id);
    res.json(userPurchases.rows);
  } catch (error) {
    
  }
});

app.get('/purchase/products/:purchase_id', async (req, res) => {
  try {
    const { purchase_id } = req.params;
    const products = await facade.getPurchaseProducts(purchase_id);
    res.json(products.rows);
  } catch (error) {
    
  }
});

// Validate user credentials
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await facade.getUserByEmail(email);

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
    const newUser = await facade.registerUser(name, type, email, password, anime, team, hometown);
    res.json(newUser.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ message: 'Usuário já existe' });
  }
});

// Register a new product
app.post('/products', async (req, res) => {
  try {
    const { name, price, category, color, size, count, city } = req.body;
    await facade.registerProduct(name, price, category, color, size, count, city);
    const allProducts = await facade.getAllProducts();
    res.json(allProducts.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Produto já existe' });
  }
});

// Register a purchase
app.post('/purchases', async (req, res) => {
  try {
    const { userId, total, boughtProducts } = req.body;
    if (!userId || !total || !boughtProducts){
      res.status(400).json({ message: 'Parâmetros inválidos' })
    }
    const now = new Date();
    console.log('userId: ' + userId);
    console.log('boughtProducts: ' + boughtProducts);
    await facade.registerPurchase(userId, now.getMonth()+1, total, boughtProducts);

    res.json({ message: 'Compra realizada com sucesso' });
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

    await facade.updateProduct(id, name, price, category, color, size, count, city);
    const updatedProducts = await facade.getAllProducts();
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
    await facade.deleteProductById(id);
    const deletedProducts = await facade.getAllProducts();
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
    await facade.deleteProductByName(name);
    const deletedProducts = await facade.getAllProducts();
    res.json(deletedProducts.rows);
  } catch (error) {
    console.error(error.message);
    res.json(error.message);
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});