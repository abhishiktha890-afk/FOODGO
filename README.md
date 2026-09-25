# FoodGo — Extreme Frontend

Premium food delivery application built with React, Vite, Express, and PostgreSQL.

## Run
```bash
npm install
npm run dev
```
Open the local URL shown by Vite.

## PostgreSQL setup
1. In pgAdmin, create a database named `foodgo`.
2. Open `db/schema.sql` in pgAdmin's Query Tool and execute it.
3. Copy `.env.example` to `.env` and replace `YOUR_PASSWORD` with the PostgreSQL password for your local `postgres` user.
4. Start the API with `npm run server`, or start both API and frontend with `npm run dev:full`.

The API runs on `http://localhost:4000`. Check the connection at `http://localhost:4000/api/health`.

## Included
- Animated hero with floating food stickers
- Search and cuisine filters
- Restaurant and menu views
- Cart + LocalStorage persistence
- Checkout and scheduled delivery UI
- Animated order tracking
- Customer / restaurant / delivery dashboards
- Dark/light mode
- Glassmorphism, gradients, hover motion and micro-interactions
- PostgreSQL-backed menu API with a local mock-data fallback when the API is unavailable
