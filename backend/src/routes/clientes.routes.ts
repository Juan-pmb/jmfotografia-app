import { Router } from "express";

import {
  actualizarCliente,
  crearCliente,
  obtenerClientes,
} from "../controllers/clientes.controller.js";

export const clientesRouter = Router();

clientesRouter.get("/", obtenerClientes);

clientesRouter.post("/", crearCliente);

clientesRouter.put("/:id", actualizarCliente);