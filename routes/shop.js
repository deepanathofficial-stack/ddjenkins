const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { getCartDetails } = require('../utils/cart');

// Home / product listing with search + category filter
router.get('/', (req, res) => {
  const { q, category } = req.query;
  let products = store.getAllProducts();

  if (category) {
    products = products.filter((p) => p.category === category);
  }
  if (q) {
    const term = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }

  res.render('index', {
    title: 'Shop',
    products,
    categories: store.getCategories(),
    activeCategory: category || '',
    q: q || '',
    cart: getCartDetails(req),
  });
});

// Product detail
router.get('/product/:id', (req, res) => {
  const product = store.getProductById(req.params.id);
  if (!product) {
    return res.status(404).render('404', { title: 'Not Found', cart: getCartDetails(req) });
  }
  res.render('product', {
    title: product.name,
    product,
    cart: getCartDetails(req),
  });
});

module.exports = router;
