# Lotus Leaf Shop (Full Stack Example)

This is a demo full-stack e-commerce project for **Lotus Leaf** built with:

- React + React Router + Bootstrap
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- Nodemailer email notification
- WhatsApp order notification link

## Structure

- `backend/` — Node/Express API
- `frontend/` — React app

## Running locally

1. Install backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your Mongo URI and email credentials
   npm run dev
   ```

2. Seed sample products (optional):

   ```bash
   node seed.js
   ```

3. In another terminal, run frontend:

   ```bash
   cd frontend
   npm install
   npm start
   ```

Frontend will run on http://localhost:3000 and talk to backend on http://localhost:5000.

Use the admin email in Mongo and set its `role` to `admin` manually the first time.
