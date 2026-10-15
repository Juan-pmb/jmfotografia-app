
import { Router } from "express";
import {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
} from "../controllers/productos.controller.js";

export const productosRouter = Router();

productosRouter.get("/", obtenerProductos);
productosRouter.get("/:id", obtenerProducto);
productosRouter.post("/", crearProducto);
productosRouter.patch("/:id", actualizarProducto);
