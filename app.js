import mqtt from "mqtt";
import mysql from "mysql2/promise";
import "dotenv/config";

async function main() {
  // Conexión MySQL
  const db = await mysql.createConnection({
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
      hora DATETIME
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
    console.log(`Estado recibido: ${estado} a las ${fecha}`);

    try {
      const sql = "INSERT INTO registros (estado, hora) VALUES (?, ?)";
      await db.execute(sql, [estado, fecha]);
      console.log("Estado guardado en MySQL");
    } catch (err) {
      console.error("Error guardando en MySQL:", err);
    }
  });
}

main();
