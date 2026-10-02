import cors from "cors";
import { clientesRouter } from "./modules/clientes/routes/clientes.routes.js";
import express, { type Request, type Response } from "express";
import { formatearTexto } from "./utils/formato.js"

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({
    mensaje: "Backend de JMfotografía funcionando correctamente",
  });
});

app.get("/api/salud", (_req: Request, res: Response) => {
  res.json({
    estado: "OK",
    fecha: new Date().toISOString(),
  });
});

app.use("/api/clientes", clientesRouter);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

console.log(formatearTexto("   jUaN    esNEider muÑOz orOsio   "));