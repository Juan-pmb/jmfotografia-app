
import { Router } from "express";
import {
  obtenerVariantes,
  crearVariante,
  actualizarVariante,
} from "../controllers/variantes.controller.js";

export const variantesRouter = Router();

variantesRouter.get("/producto/:productoId", obtenerVariantes);
variantesRouter.post("/", crearVariante);
variantesRouter.patch("/:id", actualizarVariante);
