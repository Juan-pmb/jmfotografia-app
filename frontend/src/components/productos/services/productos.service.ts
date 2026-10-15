
const API_URL = "http://localhost:3000/api/productos";
const API_VARIANTES_URL = "http://localhost:3000/api/variantes";

export type CategoriaProducto =
  | "RETABLOS"
  | "REGALOS_PERSONALIZADOS"
  | "PORTARRETRATOS"
  | "COMBOS"
  | "COJINES"
  | "ALBUMES";

export interface VarianteProducto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precioBase: number;
  bajoPedido: boolean;
  activo: boolean;
  productoId: number;
}

export interface Producto {
  id: number;
  nombre: string;
  categoria: CategoriaProducto;
  activo: boolean;
  fechaCreacion: string;
  fechaActualiza: string;
  variantes: VarianteProducto[];
}

async function solicitar<T>(
  url: string,
  opciones?: RequestInit
): Promise<T> {
  const respuesta = await fetch(url, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...opciones?.headers,
    },
  });

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new Error(
      datos?.mensaje || "No fue posible completar la operación."
    );
  }

  return datos as T;
}

export function obtenerProductos(): Promise<Producto[]> {
  return solicitar<Producto[]>(API_URL);
}

export function crearProducto(datos: {
  nombre: string;
  categoria: CategoriaProducto;
}): Promise<Producto> {
  return solicitar<Producto>(API_URL, {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export function actualizarProducto(
  id: number,
  datos: {
    nombre?: string;
    categoria?: CategoriaProducto;
    activo?: boolean;
  }
): Promise<Producto> {
  return solicitar<Producto>(`${API_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(datos),
  });
}

export function crearVariante(datos: {
  productoId: number;
  nombre: string;
  descripcion?: string;
  precioBase: number;
  bajoPedido?: boolean;
}): Promise<VarianteProducto> {
  return solicitar<VarianteProducto>(API_VARIANTES_URL, {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export function actualizarVariante(
  id: number,
  datos: {
    nombre?: string;
    descripcion?: string | null;  
    precioBase?: number;
    bajoPedido?: boolean;
    activo?: boolean;
  }
): Promise<VarianteProducto> {
  return solicitar<VarianteProducto>(
    `${API_VARIANTES_URL}/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(datos),
    }
  );
}
