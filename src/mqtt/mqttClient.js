import mqtt from "mqtt";
import { getDB } from "../config/db.js";

const MQTT_BROKER = "mqtt://broker.hivemq.com";
const MQTT_TOPIC = "Puerta/Estado";

export function initMQTT() {
  const client = mqtt.connect(MQTT_BROKER);

  client.on("connect", () => {
    console.log("Conectado al broker MQTT");
    client.subscribe(MQTT_TOPIC, (err) => {
      if (err) console.error("Error al suscribirse:", err);
    });
  });

  client.on("message", async (topic, message) => {
    const estado = message.toString();
    const fecha = new Date();
    const usuario = "Lucas";

    console.log(`Estado recibido: ${estado} a las ${fecha.toLocaleString()}`);

    try {
      const db = getDB();
      const sql =
        "INSERT INTO registros (estado, hora, usuario) VALUES (?, ?, ?)";
      await db.execute(sql, [estado, fecha, usuario]);
      console.log("Guardado en MySQL 💾");
    } catch (err) {
      console.error("Error guardando en DB:", err);
    }
  });
}
