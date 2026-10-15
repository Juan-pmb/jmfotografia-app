
import { ProductosRepository } from "../repositories/productos.repository.js";

const CATEGORIAS_VALIDAS = [
  "RETABLOS",
  "REGALOS_PERSONALIZADOS",
  "PORTARRETRATOS",
  "COMBOS",
  "COJINES",
  "ALBUMES",
] as const;

type CategoriaProducto = (typeof CATEGORIAS_VALIDAS)[number];

type CrearProductoDTO = {
  nombre: string;
  categoria: CategoriaProducto;
};

type ActualizarProductoDTO = {
  nombre?: string;
  categoria?: CategoriaProducto;
  activo?: boolean;
};

export class ProductosService {
  private repository = new ProductosRepository();

  async obtenerProductos() {
    return this.repository.obtenerProductos();
  }

  async obtenerProducto(id: number) {
    this.validarId(id);

    const producto = await this.repository.obtenerProducto(id);

    if (!producto) {
      throw new Error("Producto no encontrado.");
    }

    return producto;
  }

  async crearProducto(dto: CrearProductoDTO) {
    const nombre = this.validarNombre(dto.nombre);
    const categoria = this.validarCategoria(dto.categoria);

    return this.repository.crearProducto({
      nombre,
      categoria,
    });
  }

  async actualizarProducto(
    id: number,
    dto: ActualizarProductoDTO,
  ) {
    this.validarId(id);

    const producto = await this.repository.obtenerProducto(id);

    if (!producto) {
      throw new Error("Producto no encontrado.");
    }

    const data: ActualizarProductoDTO = {};

    if (dto.nombre !== undefined) {
      data.nombre = this.validarNombre(dto.nombre);
    }

    if (dto.categoria !== undefined) {
      data.categoria = this.validarCategoria(dto.categoria);
    }

    if (dto.activo !== undefined) {
      if (typeof dto.activo !== "boolean") {
        throw new Error("El estado activo debe ser verdadero o falso.");
      }

      data.activo = dto.activo;
    }

    if (Object.keys(data).length === 0) {
      throw new Error("Debes proporcionar al menos un campo para actualizar.");
    }

    return this.repository.actualizarProducto(id, data);
  }

  private validarId(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("El identificador del producto no es válido.");
    }
  }

  private validarNombre(nombre: string) {
    if (typeof nombre !== "string" || !nombre.trim()) {
      throw new Error("El nombre del producto es obligatorio.");
    }

    return nombre.trim();
  }

  private validarCategoria(categoria: string): CategoriaProducto {
    if (!CATEGORIAS_VALIDAS.includes(categoria as CategoriaProducto)) {
      throw new Error("La categoría del producto no es válida.");
    }

    return categoria as CategoriaProducto;
  }
}
