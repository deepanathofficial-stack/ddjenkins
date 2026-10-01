const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');

function readJSON(file) {
  const raw = fs.readFileSync(file, 'utf-8');
  return JSON.parse(raw || '[]');
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

// ---------- Products ----------
function getAllProducts() {
  return readJSON(PRODUCTS_FILE);
}

function getProductById(id) {
  return getAllProducts().find((p) => p.id === id);
}

function saveProduct(product) {
  const products = getAllProducts();
  const idx = products.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    products[idx] = product;
  } else {
    products.push(product);
  }
  writeJSON(PRODUCTS_FILE, products);
  return product;
}

function deleteProduct(id) {
  const products = getAllProducts().filter((p) => p.id !== id);
  writeJSON(PRODUCTS_FILE, products);
}

function getCategories() {
  const products = getAllProducts();
  return [...new Set(products.map((p) => p.category))].sort();
}

// ---------- Orders ----------
function getAllOrders() {
  return readJSON(ORDERS_FILE);
}

function getOrderById(id) {
  return getAllOrders().find((o) => o.id === id);
}

function saveOrder(order) {
  const orders = getAllOrders();
  orders.push(order);
  writeJSON(ORDERS_FILE, orders);
  return order;
}

module.exports = {
  getAllProducts,
  getProductById,
  saveProduct,
  deleteProduct,
  getCategories,
  getAllOrders,
  getOrderById,
  saveOrder,
};
