const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const cartUtil = require('../utils/cart');

// Checkout form
router.get('/', (req, res) => {
  const cart = cartUtil.getCartDetails(req);
  if (cart.items.length === 0) {
    return res.redirect('/cart');
  }
  res.render('checkout', {
    title: 'Checkout',
    cart,
    error: null,
  });
});

// Place order
router.post('/', (req, res) => {
  const cart = cartUtil.getCartDetails(req);
  if (cart.items.length === 0) {
    return res.redirect('/cart');
  }

  const { fullName, email, address, city, zip, cardNumber } = req.body;
  if (!fullName || !email || !address || !city || !zip || !cardNumber) {
    return res.status(400).render('checkout', {
      title: 'Checkout',
      cart,
      error: 'Please fill in all fields to complete your order.',
    });
  }

  const order = {
    id: uuidv4().slice(0, 8).toUpperCase(),
    items: cart.items.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      price: i.product.price,
      qty: i.qty,
      subtotal: i.subtotal,
    })),
    total: cart.total,
    customer: { fullName, email, address, city, zip },
    createdAt: new Date().toISOString(),
  };

  store.saveOrder(order);
  cartUtil.clearCart(req);

  res.redirect(`/checkout/confirmation/${order.id}`);
});

// Confirmation page
router.get('/confirmation/:id', (req, res) => {
  const order = store.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).render('404', { title: 'Not Found', cart: cartUtil.getCartDetails(req) });
  }
  res.render('confirmation', {
    title: 'Order Confirmed',
    order,
    cart: cartUtil.getCartDetails(req),
  });
});

module.exports = router;
