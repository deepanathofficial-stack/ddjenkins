const express = require('express');
const router = express.Router();
const store = require('../data/store');
const cartUtil = require('../utils/cart');

// View cart
router.get('/', (req, res) => {
  res.render('cart', {
    title: 'Your Cart',
    cart: cartUtil.getCartDetails(req),
  });
});

// Add item to cart
router.post('/add/:id', (req, res) => {
  const product = store.getProductById(req.params.id);
  if (!product) return res.status(404).send('Product not found');

  const qty = Math.max(1, parseInt(req.body.qty, 10) || 1);
  cartUtil.addToCart(req, product.id, qty);
  res.redirect(req.get('Referrer') || '/');
});

// Update quantity
router.post('/update/:id', (req, res) => {
  const qty = parseInt(req.body.qty, 10);
  cartUtil.setQuantity(req, req.params.id, isNaN(qty) ? 0 : qty);
  res.redirect('/cart');
});

// Remove item
router.post('/remove/:id', (req, res) => {
  cartUtil.removeFromCart(req, req.params.id);
  res.redirect('/cart');
});

module.exports = router;
