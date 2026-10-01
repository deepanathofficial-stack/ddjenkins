const { getProductById } = require('../data/store');

// req.session.cart shape: { [productId]: quantity }

function getCart(req) {
  if (!req.session.cart) {
    req.session.cart = {};
  }
  return req.session.cart;
}

function addToCart(req, productId, qty = 1) {
  const cart = getCart(req);
  cart[productId] = (cart[productId] || 0) + qty;
  if (cart[productId] < 1) delete cart[productId];
}

function setQuantity(req, productId, qty) {
  const cart = getCart(req);
  if (qty <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = qty;
  }
}

function removeFromCart(req, productId) {
  const cart = getCart(req);
  delete cart[productId];
}

function clearCart(req) {
  req.session.cart = {};
}

function getCartDetails(req) {
  const cart = getCart(req);
  const items = Object.entries(cart)
    .map(([productId, qty]) => {
      const product = getProductById(productId);
      if (!product) return null;
      return {
        product,
        qty,
        subtotal: +(product.price * qty).toFixed(2),
      };
    })
    .filter(Boolean);

  const total = +items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2);
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  return { items, total, itemCount };
}

module.exports = {
  getCart,
  addToCart,
  setQuantity,
  removeFromCart,
  clearCart,
  getCartDetails,
};
