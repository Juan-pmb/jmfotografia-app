
import type { Request, Response } from "express";
import { ProductosService } from "../services/productos.service.js";

const service = new ProductosService();

export async function obtenerProductos(
  _req: Request,
  res: Response,
) {
  try {
    const productos = await service.obtenerProductos();
    res.json(productos);
  } catch (error) {
    console.error("Error consultando productos:", error);
    res.status(500).json({
      mensaje: "No fue posible consultar los productos.",
    });
  }
}

export async function obtenerProducto(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);
    const producto = await service.obtenerProducto(id);
    res.json(producto);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "El identificador del producto no es válido.") {
        res.status(400).json({ mensaje: error.message });
        return;
      }

      if (error.message === "Producto no encontrado.") {
        res.status(404).json({ mensaje: error.message });
        return;
      }
    }

    console.error("Error consultando producto:", error);
    res.status(500).json({
      mensaje: "No fue posible consultar el producto.",
    });
  }
}

export async function crearProducto(
  req: Request,
  res: Response,
) {
  try {
    const producto = await service.crearProducto(req.body);
    res.status(201).json(producto);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "El nombre del producto es obligatorio." ||
        error.message === "La categoría del producto no es válida."
      ) {
        res.status(400).json({ mensaje: error.message });
        return;
      }
    }

    console.error("Error creando producto:", error);
    res.status(500).json({
      mensaje: "No fue posible registrar el producto.",
    });
  }
}

export async function actualizarProducto(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);
    const producto = await service.actualizarProducto(id, req.body);
    res.json(producto);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "El identificador del producto no es válido." ||
        error.message === "El nombre del producto es obligatorio." ||
        error.message === "La categoría del producto no es válida." ||
        error.message === "El estado activo debe ser verdadero o falso." ||
        error.message === "Debes proporcionar al menos un campo para actualizar."
      ) {
        res.status(400).json({ mensaje: error.message });
        return;
      }

      if (error.message === "Producto no encontrado.") {
        res.status(404).json({ mensaje: error.message });
        return;
      }
    }

    console.error("Error actualizando producto:", error);
    res.status(500).json({
      mensaje: "No fue posible actualizar el producto.",
    });
  }
}
