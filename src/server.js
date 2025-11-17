import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import { initMQTT } from "./mqtt/mqttClient.js";
import puertasRouter from "./routes/puertas.routes.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

async function main() {
  await connectDB();
  initMQTT();

  // Rutas
  app.use("/api/puertas", puertasRouter);

  app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
  });
}

main();
