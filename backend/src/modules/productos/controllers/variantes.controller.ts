
import type { Request, Response } from "express";
import { VariantesService } from "../services/variantes.service.js";

const variantesService = new VariantesService();


function obtenerId(valor: string | string[]): number {
  if (Array.isArray(valor)) {
    return Number.NaN;
  }

  return Number(valor);
}


function responderError(error: unknown, res: Response) {
  const mensaje =
    error instanceof Error ? error.message : "Error interno del servidor.";

  if (
    mensaje.includes("no encontrado") ||
    mensaje.includes("no encontrada")
  ) {
    return res.status(404).json({ mensaje });
  }

  if (
    mensaje.includes("obligatorio") ||
    mensaje.includes("no es válido") ||
    mensaje.includes("debe ser") ||
    mensaje.includes("mayor o igual") ||
    mensaje.includes("proporcionar") ||
    mensaje.includes("No puedes") ||
    mensaje.includes("Ya existe")
  ) {
    return res.status(400).json({ mensaje });
  }

  return res.status(500).json({ mensaje });
}

export async function obtenerVariantes(req: Request, res: Response) {
  try {
    const productoId = obtenerId(req.params.productoId);
    const variantes = await variantesService.obtenerPorProducto(productoId);

    return res.json(variantes);
  } catch (error) {
    return responderError(error, res);
  }
}

export async function crearVariante(req: Request, res: Response) {
  try {
    const productoId = Number(req.body.productoId);

    const variante = await variantesService.crear({
      ...req.body,
      productoId,
    });

    return res.status(201).json(variante);
  } catch (error) {
    return responderError(error, res);
  }
}

export async function actualizarVariante(req: Request, res: Response) {
  try {
    const id = obtenerId(req.params.id);
    const variante = await variantesService.actualizar(id, req.body);

    return res.json(variante);
  } catch (error) {
    return responderError(error, res);
  }
}
