import { Router } from "express";

import {
  actualizarCliente,
  obtenerCliente,
  crearCliente,
  obtenerClientes,
    cambiarEstadoCliente,
} from "../controllers/clientes.controller.js";

export const clientesRouter = Router();

clientesRouter.get("/", obtenerClientes);

clientesRouter.get("/:id", obtenerCliente);

clientesRouter.post("/", crearCliente);

clientesRouter.put("/:id", actualizarCliente);

clientesRouter.patch("/:id/estado", cambiarEstadoCliente);