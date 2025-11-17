import mysql from "mysql2/promise";
import "dotenv/config";

let db;

export async function connectDB() {
  db = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
  });

  await db.execute(`
    CREATE TABLE IF NOT EXISTS registros (
      id INT AUTO_INCREMENT PRIMARY KEY,
      estado VARCHAR(50),
      hora DATETIME,
      usuario VARCHAR(100)
    )
  `);

  console.log("MySQL conectado.");
  return db;
}

export function getDB() {
  return db;
}
