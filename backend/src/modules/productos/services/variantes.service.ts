
import { VariantesRepository } from "../repositories/variantes.repository.js";
import { ProductosRepository } from "../repositories/productos.repository.js";

const variantesRepository = new VariantesRepository();
const productosRepository = new ProductosRepository();

type CrearVarianteDTO = {
  productoId: number;
  nombre: string;
  descripcion?: string;
  precioBase: number;
  bajoPedido?: boolean;
};

type ActualizarVarianteDTO = {
  nombre?: string;
  descripcion?: string | null;
  precioBase?: number;
  bajoPedido?: boolean;
  activo?: boolean;
};

export class VariantesService {
  async obtenerPorProducto(productoId: number) {
    this.validarId(productoId);

    const producto = await productosRepository.obtenerProducto(productoId);

    if (!producto) {
      throw new Error("Producto no encontrado.");
    }

    return variantesRepository.obtenerPorProducto(productoId);
  }

  async crear(dto: CrearVarianteDTO) {
    this.validarId(dto.productoId);

    const producto = await productosRepository.obtenerProducto(dto.productoId);

    if (!producto) {
      throw new Error("Producto no encontrado.");
    }

    if (!producto.activo) {
      throw new Error("No puedes agregar variantes a un producto inactivo.");
    }

    const nombre = this.validarNombre(dto.nombre);
    this.validarPrecio(dto.precioBase);

    const descripcionNormalizada = dto.descripcion?.trim() || null;

    const duplicada = await variantesRepository.existeDuplicada({
      productoId: dto.productoId,
      nombre,
      descripcion: descripcionNormalizada,
    });

    if (duplicada) {
      throw new Error(
        "Ya existe una variante con ese nombre y descripción para este producto."
      );
    }


    if (
      dto.bajoPedido !== undefined &&
      typeof dto.bajoPedido !== "boolean"
    ) {
      throw new Error("El campo bajoPedido debe ser verdadero o falso.");
    }

    return variantesRepository.crear({
      productoId: dto.productoId,
      nombre,
      descripcion: descripcionNormalizada ?? undefined,
      precioBase: dto.precioBase,
      bajoPedido: dto.bajoPedido,
    });
  }

  async actualizar(id: number, dto: ActualizarVarianteDTO) {
    this.validarId(id);

    const variante = await variantesRepository.obtenerPorId(id);

    if (!variante) {
      throw new Error("Variante no encontrada.");
    }

    const data: ActualizarVarianteDTO = {};

    if (dto.nombre !== undefined) {
      data.nombre = this.validarNombre(dto.nombre);
    }

    if (dto.descripcion !== undefined) {
      if (
        dto.descripcion !== null &&
        typeof dto.descripcion !== "string"
      ) {
        throw new Error("La descripción debe ser texto.");
      }

      data.descripcion = dto.descripcion?.trim() || null;
    }

    if (dto.precioBase !== undefined) {
      this.validarPrecio(dto.precioBase);
      data.precioBase = dto.precioBase;
    }

    if (dto.bajoPedido !== undefined) {
      if (typeof dto.bajoPedido !== "boolean") {
        throw new Error("El campo bajoPedido debe ser verdadero o falso.");
      }

      data.bajoPedido = dto.bajoPedido;
    }

    if (dto.activo !== undefined) {
      if (typeof dto.activo !== "boolean") {
        throw new Error("El campo activo debe ser verdadero o falso.");
      }

      data.activo = dto.activo;
    }

    if (Object.keys(data).length === 0) {
      throw new Error("Debes proporcionar al menos un campo para actualizar.");
    }

    
    const nombreFinal = data.nombre ?? variante.nombre;

    const descripcionFinal =
      data.descripcion !== undefined
        ? data.descripcion
        : variante.descripcion;

    if (
      data.nombre !== undefined ||
      data.descripcion !== undefined
    ) {
      const duplicada = await variantesRepository.existeDuplicada({
        productoId: variante.productoId,
        nombre: nombreFinal,
        descripcion: descripcionFinal,
        excluirId: id,
      });

      if (duplicada) {
        throw new Error(
          "Ya existe otra variante con ese nombre y descripción para este producto."
        );
      }
    }


    return variantesRepository.actualizar(id, data);
  }

  private validarId(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("El identificador no es válido.");
    }
  }

  private validarNombre(nombre: string) {
    if (typeof nombre !== "string" || !nombre.trim()) {
      throw new Error("El nombre de la variante es obligatorio.");
    }

    return nombre.trim();
  }

  private validarPrecio(precio: number) {
    if (!Number.isInteger(precio) || precio < 0) {
      throw new Error("El precio base debe ser un entero mayor o igual a cero.");
    }
  }
}
