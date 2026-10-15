
import { prisma } from "../../../lib/prisma.js";

export class VariantesRepository {
  async obtenerPorProducto(productoId: number) {
    return prisma.varianteProducto.findMany({
      where: { productoId },
      orderBy: { id: "asc" },
    });
  }

  async crear(data: {
    productoId: number;
    nombre: string;
    descripcion?: string;
    precioBase: number;
    bajoPedido?: boolean;
  }) {
    return prisma.varianteProducto.create({
      data: {
        productoId: data.productoId,
        nombre: data.nombre.trim(),
        descripcion: data.descripcion?.trim() || null,
        precioBase: data.precioBase,
        bajoPedido: data.bajoPedido ?? false,
      },
    });
  }

  async actualizar(
    id: number,
    data: {
      nombre?: string;
      descripcion?: string | null;
      precioBase?: number;
      bajoPedido?: boolean;
      activo?: boolean;
    }
  ) {
    return prisma.varianteProducto.update({
      where: { id },
      data,
    });
  }

  async obtenerPorId(id: number) {
    return prisma.varianteProducto.findUnique({
      where: { id },
    });
  }

  
async existeDuplicada(data: {
  productoId: number;
  nombre: string;
  descripcion: string | null;
  excluirId?: number;
}) {
  const variantes = await prisma.varianteProducto.findMany({
    where: {
      productoId: data.productoId,
      nombre: data.nombre,
      descripcion: data.descripcion,
      ...(data.excluirId !== undefined
        ? { id: { not: data.excluirId } }
        : {}),
    },
    select: { id: true },
  });

  return variantes.length > 0;
}

}


