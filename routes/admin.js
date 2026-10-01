const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const adminAuth = require('../utils/adminAuth');

router.use(adminAuth);

// Dashboard: product list + orders
router.get('/', (req, res) => {
  res.render('admin/dashboard', {
    title: 'Admin Dashboard',
    products: store.getAllProducts(),
    orders: store.getAllOrders().slice().reverse(),
    cart: null,
  });
});

// New product form
router.get('/products/new', (req, res) => {
  res.render('admin/product-form', {
    title: 'Add Product',
    product: null,
    cart: null,
  });
});

// Edit product form
router.get('/products/:id/edit', (req, res) => {
  const product = store.getProductById(req.params.id);
  if (!product) return res.status(404).send('Product not found');
  res.render('admin/product-form', {
    title: 'Edit Product',
    product,
    cart: null,
  });
});

// Create product
router.post('/products', (req, res) => {
  const { name, category, price, stock, image, description } = req.body;
  const product = {
    id: 'p' + uuidv4().slice(0, 8),
    name,
    category,
    price: parseFloat(price) || 0,
    stock: parseInt(stock, 10) || 0,
    image: image || 'https://picsum.photos/seed/' + encodeURIComponent(name) + '/500/500',
    description,
  };
  store.saveProduct(product);
  res.redirect('/admin');
});

// Update product
router.post('/products/:id', (req, res) => {
  const existing = store.getProductById(req.params.id);
  if (!existing) return res.status(404).send('Product not found');

  const { name, category, price, stock, image, description } = req.body;
  const updated = {
    ...existing,
    name,
    category,
    price: parseFloat(price) || 0,
    stock: parseInt(stock, 10) || 0,
    image: image || existing.image,
    description,
  };
  store.saveProduct(updated);
  res.redirect('/admin');
});

// Delete product
router.post('/products/:id/delete', (req, res) => {
  store.deleteProduct(req.params.id);
  res.redirect('/admin');
});

module.exports = router;
