
import { prisma } from "../../../lib/prisma.js";

export class ProductosRepository {
  async obtenerProductos() {
    return prisma.producto.findMany({
      include: {
        variantes: {
          orderBy: {
            orden: "asc",
          },
        },
      },
      orderBy: {
        fechaCreacion: "desc",
      },
    });
  }

  async obtenerProducto(id: number) {
    return prisma.producto.findUnique({
      where: { id },
      include: {
        variantes: {
          orderBy: {
            orden: "asc",
          },
        },
      },
    });
  }

  async crearProducto(data: {
    nombre: string;
    categoria:
      | "RETABLOS"
      | "REGALOS_PERSONALIZADOS"
      | "PORTARRETRATOS"
      | "COMBOS"
      | "COJINES"
      | "ALBUMES";
  }) {
    return prisma.producto.create({
      data,
      include: {
        variantes: true,
      },
    });
  }

  async actualizarProducto(
    id: number,
    data: {
      nombre?: string;
      categoria?:
        | "RETABLOS"
        | "REGALOS_PERSONALIZADOS"
        | "PORTARRETRATOS"
        | "COMBOS"
        | "COJINES"
        | "ALBUMES";
      activo?: boolean;
    },
  ) {
    return prisma.producto.update({
      where: { id },
      data,
      include: {
        variantes: {
          orderBy: {
            orden: "asc",
          },
        },
      },
    });
  }
}
