import type { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";

import { formatearTexto } from "../utils/formato.js"

// ======================================================
// GET
// ======================================================

export async function obtenerClientes(
  _req: Request,
  res: Response,
) {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: {
        fechaCreacion: "desc",
      },
    });

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

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        mensaje: "El identificador del cliente no es válido",
      });
      return;
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id },
    });

    if (!cliente) {
      res.status(404).json({
        mensaje: "Cliente no encontrado",
      });
      return;
    }

    res.json(cliente);
  } catch (error) {
    console.error("Error obteniendo cliente:", error);

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
    const {
      nombres,
      apellidos,
      documento,
      telefono,
      correo,
      observaciones,
    } = req.body;

    //formatear nombres
    const nombresFormateados = formatearTexto(nombres);

    const apellidosFormateados =
      typeof apellidos === "string"
        ? formatearTexto(apellidos)
        : "";

    if (
      typeof nombres !== "string" ||
      nombres.trim() === "" ||
      typeof telefono !== "string" ||
      telefono.trim() === ""
    ) {
      res.status(400).json({
        mensaje: "Los nombres y el teléfono son obligatorios",
      });
      return;
    }

    const cliente = await prisma.cliente.create({
      data: {
        nombres: nombresFormateados,

        apellidos:
          apellidosFormateados
            ? apellidosFormateados
            : null,

        documento:
          typeof documento === "string" && documento.trim()
            ? documento.trim()
            : null,

        telefono: telefono.trim(),

        correo:
          typeof correo === "string" && correo.trim()
            ? correo.trim().toLowerCase()
            : null,

        observaciones:
          typeof observaciones === "string" &&
            observaciones.trim()
            ? observaciones.trim()
            : null,
      },
    });

    res.status(201).json(cliente);
  } catch (error) {
    console.error(error);

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

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        mensaje: "El identificador del cliente no es válido",
      });
      return;
    }



    const clienteExiste = await prisma.cliente.findUnique({
      where: { id },
    });

    if (!clienteExiste) {
      res.status(404).json({
        mensaje: "Cliente no encontrado",
      });
      return;
    }

    const {
      nombres,
      apellidos,
      documento,
      telefono,
      correo,
      observaciones,
    } = req.body;

    if (
      typeof nombres !== "string" ||
      nombres.trim() === ""
    ) {
      res.status(400).json({
        mensaje: "El nombre del cliente es obligatorio",
      });
      return;
    }

    if (
      typeof telefono !== "string" ||
      telefono.trim() === ""
    ) {
      res.status(400).json({
        mensaje: "El teléfono del cliente es obligatorio",
      });
      return;
    }

    const documentoLimpio =
      typeof documento === "string" &&
        documento.trim()
        ? documento.trim()
        : null;

    if (documentoLimpio) {
      const clienteConDocumento =
        await prisma.cliente.findFirst({
          where: {
            documento: documentoLimpio,
            id: {
              not: id,
            },
          },
        });

      if (clienteConDocumento) {
        res.status(409).json({
          mensaje:
            "Ya existe otro cliente con este documento",
        });
        return;
      }
    }

    const nombresFormateados = formatearTexto(nombres);

    const apellidosFormateados =
      typeof apellidos === "string"
        ? formatearTexto(apellidos)
        : "";

    const clienteActualizado =
      await prisma.cliente.update({
        where: { id },

        data: {
          nombres: nombresFormateados,

          apellidos:
            apellidosFormateados
              ? apellidosFormateados
              : null,

          documento: documentoLimpio,

          telefono: telefono.trim(),

          correo:
            typeof correo === "string" &&
              correo.trim()
              ? correo.trim().toLowerCase()
              : null,

          observaciones:
            typeof observaciones === "string" &&
              observaciones.trim()
              ? observaciones.trim()
              : null,
        },
      });

    res.json(clienteActualizado);
  } catch (error) {
    console.error(
      "Error actualizando cliente:",
      error,
    );

    res.status(500).json({
      mensaje: "No fue posible actualizar el cliente",
    });
  }
}