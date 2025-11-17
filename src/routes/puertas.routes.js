import { Router } from "express";
import { getDB } from "../config/db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.query(
      "SELECT * FROM registros ORDER BY id DESC LIMIT 15"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
