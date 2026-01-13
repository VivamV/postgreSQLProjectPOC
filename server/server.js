import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

//  CREATE a user
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  READ all users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.log("inside this")
    res.status(500).json({ error: err.message });
  }
});

//  READ one user
app.get("/users/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  UPDATE user
app.put("/users/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *",
      [name, email, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  DELETE user
app.delete("/users/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [
      req.params.id,
    ]);
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start Server
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
