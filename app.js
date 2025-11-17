import mqtt from "mqtt";
import cors from "cors";
import express from "express";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

let db;

async function main() {
  // Conexión MySQL
  db = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
  });

  // Crear tabla si no existe
  await db.execute(`
    CREATE TABLE IF NOT EXISTS registros (
      id INT AUTO_INCREMENT PRIMARY KEY,
      estado VARCHAR(50),
      hora DATETIME,
      usuario VARCHAR(100)
    )
  `);

  // Conexión MQTT
  const MQTT_BROKER = "mqtt://broker.hivemq.com";
  const MQTT_TOPIC = "Puerta/Estado";

  const client = mqtt.connect(MQTT_BROKER);

  client.on("connect", () => {
    console.log("Conectado al broker MQTT");
    client.subscribe(MQTT_TOPIC, (err) => {
      if (err) console.error("Error suscribiéndose al topic:", err);
    });
  });

  client.on("message", async (topic, message) => {
    const estado = message.toString();
    const fecha = new Date();
    const usuario = "Lucas";
    console.log(`Estado recibido: ${estado} a las ${fecha.toLocaleString()}`);

    try {
      const sql =
        "INSERT INTO registros (estado, hora, usuario) VALUES (?, ?, ?)";
      await db.execute(sql, [estado, fecha, usuario]);
      console.log("Estado guardado en MySQL 💾");
    } catch (err) {
      console.error("Error guardando en MySQL:", err);
    }
  });
}

app.get("/api/puertas", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM registros ORDER BY id DESC LIMIT 15"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

main();
