============================================================
FULL-STACK E-COMMERCE PLATFORM — CAPSTONE PROJECT
============================================================

------------------------------------------------------------
1. PROJECT OVERVIEW
------------------------------------------------------------
A complete full-stack e-commerce platform built end to end:
environment setup, a React (Vite) frontend, a Node.js/Express
backend, a PostgreSQL database managed with Prisma, Dockerised
services, authentication with role-based access control, product
and shopping features (search, filter, sort, pagination, cart,
image upload), and a full testing pyramid (unit, integration,
component).

------------------------------------------------------------
2. TECHNOLOGIES USED
------------------------------------------------------------
Backend:
  - Node.js (v18+ for local dev, Node 20 in containers)
  - Express 5
  - Prisma ORM + PostgreSQL
  - JSON Web Tokens (JWT) for authentication
  - Multer for product image upload
  - Jest + Supertest for testing

Frontend:
  - React 18/19
  - Vite
  - Axios (API integration)
  - React Query (@tanstack/react-query) for server state
  - React Router for dynamic routing
  - Context API (Auth + Cart)
  - React Testing Library + Mock Service Worker (MSW) for tests

DevOps:
  - Docker + docker-compose
  - Dockerfiles for frontend and backend

------------------------------------------------------------
3. PROJECT STRUCTURE
------------------------------------------------------------
project_1/
├── docker-compose.yml        # Orchestrates db + backend + frontend
├── Dockerfile.backend        # Root build context (packages backend + prisma)
├── .env                      # Shared environment variables
├── prisma/
│   ├── schema.prisma         # Postgres + Prisma models
│   └── seed.js               # Seeds admin, demo customer and 20 products
├── backend/
│   ├── Dockerfile            # (kept; Dockerfile.backend is used by compose)
│   ├── src/
│   │   ├── index.js          # Express app (exported; guarded listen)
│   │   ├── controllers/      # auth, product, category, cart
│   │   ├── routes/           # REST route definitions
│   │   ├── middleware/       # auth (JWT), upload (multer)
│   │   ├── utils/            # prisma client
│   │   └── uploads/          # uploaded product images
│   ├── tests/
│   │   ├── unit/             # Jest unit tests (mocked Prisma)
│   │   └── integration/      # Supertest integration tests
│   └── prisma/seed.js        # (symlinked via root prisma)
└── frontend/
    ├── Dockerfile
    ├── vitest.config.mjs     # Frontend test runner config
    └── src/
        ├── main.jsx, App.jsx
        ├── pages/             # Home, Products, ProductDetail, Cart, Login, Admin
        ├── components/        # Header
        ├── context/           # AuthContext, CartContext
        ├── services/          # api, auth, product, cart, category
        ├── test/              # Vitest + RTL + MSW tests
        └── styles.css

------------------------------------------------------------
4. ENVIRONMENT VARIABLES (.env)
------------------------------------------------------------
A root .env file is provided and used by both the backend and the
Docker Compose setup. Key variables:

  DATABASE_URL=postgresql://postgres:Kmjaj2009%40@localhost:5432/ecommerce?schema=public
  JWT_SECRET=supersecretkey
  PORT=5000
  VITE_API_URL=http://localhost:5000

For Docker, Compose supplies DATABASE_URL (pointing at the `db`
service) and sets VITE_API_URL=http://backend:5000 automatically.

------------------------------------------------------------
5. HOW TO RUN
------------------------------------------------------------
Option A — Docker (recommended, one command):
  1. Start Docker Desktop.
  2. From the project root:
       docker compose up --build
  3. Open http://localhost:3000  (frontend)
             http://localhost:5000  (backend API)

Option B — Local development (no Docker):
  1. Start a local PostgreSQL instance (database "ecommerce").
  2. Backend:
       cd backend
       npm install
       npx prisma generate
       npx prisma migrate deploy      # or: npm run migrate
       npm run seed
       npm run dev
  3. Frontend (separate terminal):
       cd frontend
       npm install
       npm run dev
  4. Open http://localhost:3000

Port notes:
  - Backend: 5000   Frontend: 3000   PostgreSQL (host): 5432
  - When using Docker, PostgreSQL is exposed on host 5433 so it
    does not clash with a local Postgres on 5432.

------------------------------------------------------------
6. TESTING
------------------------------------------------------------
Backend tests (Jest unit + Supertest integration):
  cd backend
  npm test
  - Unit tests mock Prisma and validate controller logic
    (auth, product, cart).
  - Integration tests use Supertest against the real Express app
    and a running PostgreSQL database (the local DB on :5432).

Frontend tests (Vitest + React Testing Library + MSW):
  cd frontend
  npm test
  - Component tests render real pages, mock the REST API with
    MSW, and assert behaviour with React Testing Library.

------------------------------------------------------------
7. PROJECT URLS
------------------------------------------------------------
  Frontend (UI):            http://localhost:3000
  Backend API base:         http://localhost:5000/api
  Products page:            http://localhost:3000/products
  Product detail example:   http://localhost:3000/products/1
  Cart page:                http://localhost:3000/cart
  Admin dashboard:          http://localhost:3000/admin
  API health check:         http://localhost:5000/api/ping

------------------------------------------------------------
8. REVIEWER TEST ACCOUNTS  (use these to test the app)
------------------------------------------------------------
ADMIN ACCOUNT (full access, can manage products/categories):
  Email:    admin@example.com
  Password: admin123

CUSTOMER ACCOUNT (can browse, add to cart, checkout flow):
  Email:    customer@example.com
  Password: customer123

How to use:
  - Go to http://localhost:3000/login
  - Log in as the ADMIN to access the Admin Dashboard
    (http://localhost:3000/admin) and create/edit/delete products.
  - Log in as the CUSTOMER (or register a new account) to add
    products to the cart and view http://localhost:3000/cart.
  - The seeded database already contains 20 products across
    several categories, so the catalog is ready to browse
    immediately after `npm run seed` (or on first Docker start).

------------------------------------------------------------
9. IMPORTANT NOTES
------------------------------------------------------------
- Authentication: JWT stored in localStorage; protected routes
  and RBAC (customer vs admin) are enforced on the backend.
- Product listing supports search, category filter, sort
  (price asc/desc, newest) and responsive pagination that fits
  the visible area; the Home page keeps its own featured grid.
- Image upload uses Multer; uploaded files are served from
  /uploads.
- The backend src/index.js exports the app and only calls
  app.listen() when run directly, so it can be imported by the
  Supertest integration tests without starting a server.

============================================================
