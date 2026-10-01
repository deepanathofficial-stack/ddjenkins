# ShopNode — Node.js E-commerce App

A full-featured e-commerce website built with **Node.js**, **Express**, and **EJS**.

## Features

- Product catalog with search and category filtering
- Product detail pages
- Session-based shopping cart (add, update quantity, remove)
- Checkout flow with a shipping/payment form (demo only — no real payment processing) and an order confirmation page
- Orders are saved to `data/orders.json`
- Admin panel (protected by HTTP Basic Auth) to add, edit, and delete products, and view all orders

## Requirements

- [Node.js](https://nodejs.org/) v16 or later

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# (optional) run with auto-restart on file changes during development
npm run dev
```

The site will be available at **http://localhost:3000**.

## Admin Panel

Visit **http://localhost:3000/admin**

Default credentials:
- Username: `admin`
- Password: `admin123`

You can override these with environment variables before starting the server:

```bash
ADMIN_USER=myuser ADMIN_PASS=mypassword npm start
```

⚠️ These are demo credentials sent via HTTP Basic Auth — fine for local development, but **do not use as-is in production**. Add HTTPS and a stronger auth system before deploying publicly.

## Project Structure

```
ecommerce-app/
├── server.js               # App entry point
├── data/
│   ├── products.json       # Product data (file-based "database")
│   ├── orders.json         # Saved orders
│   └── store.js            # Data access helpers
├── routes/
│   ├── shop.js              # Home page, product listing/detail
│   ├── cart.js               # Cart add/update/remove
│   ├── checkout.js         # Checkout + order confirmation
│   └── admin.js               # Admin product & order management
├── utils/
│   ├── cart.js                 # Session cart helper functions
│   └── adminAuth.js       # Basic auth middleware for /admin
├── views/                    # EJS templates
│   ├── partials/            # header/footer
│   └── admin/                 # admin dashboard & product form
└── public/css/style.css # Styling
```

## Notes / Ways to Extend

- **Data storage**: Products and orders are stored in flat JSON files for simplicity — great for learning/demo purposes. For production, swap `data/store.js` to use a real database (MongoDB, PostgreSQL, etc.) — the rest of the app doesn't need to change since routes only talk to `store.js`.
- **Payments**: The checkout form is a UI mock; no card data is transmitted or stored anywhere beyond the demo order record. Integrate Stripe/PayPal for real payments.
- **Auth**: Admin uses simple Basic Auth. Swap in a proper login system (sessions + hashed passwords) if you expose this beyond localhost.
- **Images**: Product images currently point to placeholder URLs (picsum.photos). Replace with your own image URLs or set up file uploads.
