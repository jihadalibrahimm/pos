# POS System (Frontend + Admin + Backend)

Production-style POS project with two web clients:
- `front-end`: cashier/user app
- `admin`: administration dashboard
- `back-end`: REST API + MongoDB

## Features
- User auth, products, customers, invoices, notifications, reports
- Admin auth, users/projects/transactions management, dashboard analytics
- Chart-based KPIs and project revenue insights

## Tech Stack
- Frontend/Admin: React + Vite + Tailwind + Framer Motion + Axios
- Backend: Node.js + Express + MongoDB (Mongoose)
- Auth: JWT via secure HTTP-only cookies

## Project Structure
- `front-end/` user-facing app
- `admin/` admin-facing app
- `back-end/` API server

## Environment Variables
Copy each example file and fill values:

- `back-end/.env.example` -> `back-end/.env`
- `front-end/.env.example` -> `front-end/.env`
- `admin/.env.example` -> `admin/.env`

Required highlights:
- Backend: `MONGO_URL`, `JWT_SECRET`, `COOKIE_SECRET`, `CLIENT_URL`
- Front/Admin: `VITE_API_BASE_URL` (default local API is `http://localhost:5000/api`)

## Local Run
Install and run each app in a separate terminal:

### 1) Backend
```bash
cd back-end
npm install
npm run server
```

### 2) Frontend (User app)
```bash
cd front-end
npm install
npm run dev
```

### 3) Admin app
```bash
cd admin
npm install
npm run dev
```

## Security Notes
- Never commit real `.env` files.
- Rotate secrets immediately if exposed.
- For MongoDB Atlas, add current IP (or controlled allowlist) in Network Access.

## Interview Tips
When presenting this project:
- Explain separation between user and admin apps
- Walk through auth + protected routes + role checks
- Show dashboard analytics and invoice/customer flows
