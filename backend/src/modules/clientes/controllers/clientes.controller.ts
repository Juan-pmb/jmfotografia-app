import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma.js";
import { formatearTexto } from "../../../utils/formato.js"
import { ClientesService } from "../services/clientes.service.js";


const service = new ClientesService();

// ======================================================
// GET
// ======================================================

export async function obtenerClientes(
  _req: Request,
  res: Response,
) {
  try {

    const clientes = await service.obtenerClientes();

    res.json(clientes);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "No fue posible consultar los clientes",
    });

  }
}


// ======================================================
// GET POR ID

export async function obtenerCliente(
  req: Request,
  res: Response,
) {
  try {

    const id = Number(req.params.id);

    const cliente =
      await service.obtenerCliente(id);

    res.json(cliente);

  } catch (error) {

    console.error("Error obteniendo cliente:", error);

    if (error instanceof Error) {

      if (
        error.message ===
        "El identificador del cliente no es válido"
      ) {
        res.status(400).json({
          mensaje: error.message,
        });
        return;
      }

      if (
        error.message ===
        "Cliente no encontrado"
      ) {
        res.status(404).json({
          mensaje: error.message,
        });
        return;
      }

    }

    res.status(500).json({
      mensaje: "No fue posible consultar el cliente",
    });

  }
}

// ======================================================
// POST
// ======================================================

export async function crearCliente(
  req: Request,
  res: Response,
) {
  try {

    const cliente =
      await service.crearCliente(req.body);

    res.status(201).json(cliente);

  } catch (error) {

    console.error(error);

    if (
      error instanceof Error &&
      error.message ===
      "Los nombres y el teléfono son obligatorios"
    ) {
      res.status(400).json({
        mensaje: error.message,
      });
      return;
    }

    res.status(500).json({
      mensaje: "No fue posible registrar el cliente",
    });

  }
}

// ======================================================
// PUT
// ======================================================

export async function actualizarCliente(
  req: Request,
  res: Response,
) {
  try {

    const id = Number(req.params.id);

    const cliente =
      await service.actualizarCliente(
        id,
        req.body,
      );

    res.json(cliente);

  } catch (error) {

    console.error(
      "Error actualizando cliente:",
      error,
    );

    if (error instanceof Error) {

      switch (error.message) {

        case "El identificador del cliente no es válido.":
          res.status(400).json({
            mensaje: error.message,
          });
          return;

        case "Cliente no encontrado.":
          res.status(404).json({
            mensaje: error.message,
          });
          return;

        case "Los nombres y el teléfono son obligatorios":
          res.status(400).json({
            mensaje: error.message,
          });
          return;

      }

    }

    res.status(500).json({
      mensaje: "No fue posible actualizar el cliente",
    });

  }
}