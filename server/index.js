import cors from "cors";
import "dotenv/config";
import express from "express";
import { pool } from "./db.js";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", async (_request, response) => {
  if (!process.env.DATABASE_URL) {
    return response.status(503).json({
      ok: false,
      database: "disconnected",
      error: "DATABASE_URL is not set. Create .env from .env.example.",
    });
  }

  try {
    await pool.query("SELECT 1");
    response.json({ ok: true, database: "connected" });
  } catch (error) {
    response.status(503).json({ ok: false, database: "disconnected", error: error.message });
  }
});

app.get("/api/foods", async (_request, response) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, restaurant, price, category AS cat, rating, image_url AS img FROM foods ORDER BY id"
    );
    response.json(rows);
  } catch (error) {
    response.status(500).json({ error: "Unable to load foods" });
  }
});

app.listen(port, () => {
  console.log(`FoodGo API listening on http://localhost:${port}`);
});