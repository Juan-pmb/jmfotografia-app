import type { Cliente, FormularioCliente } from "../types/tipos";

const API_URL = "http://localhost:3000/api/clientes";

type ClienteApi = {
  id: number;
  nombres: string;
  apellidos: string | null;
  documento: string | null;
  telefono: string;
  correo: string | null;
  observaciones: string | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualiza: string;
};

function convertirCliente(cliente: ClienteApi): Cliente {
  return {
    id: cliente.id,
    nombres: cliente.nombres,
    apellidos: cliente.apellidos ?? "",
    documento: cliente.documento ?? "",
    telefono: cliente.telefono,
    correo: cliente.correo ?? "",
    observaciones: cliente.observaciones ?? "",
    cantidadPedidos: 0,
    saldoPendiente: 0,
    ultimaVisita: "Sin pedidos",
    activo: cliente.activo,
  };
}

export async function consultarClientePorId(
  id: number,
):
  Promise<Cliente> {
  const respuesta = await fetch(`${API_URL}/${id}`);
  if (!respuesta.ok) {
    throw new Error("No fue posible consultar el cliente.")
  }
  const datos = (await respuesta.json()) as ClienteApi;

  return convertirCliente(datos)
}



export async function consultarClientes(): Promise<Cliente[]> {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    throw new Error("No fue posible consultar los clientes.");
  }

  const datos = (await respuesta.json()) as ClienteApi[];

  return datos.map(convertirCliente);
}

export async function registrarCliente(
  formulario: FormularioCliente,
): Promise<Cliente> {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombres: formulario.nombres,
      apellidos: formulario.apellidos || null,
      documento: formulario.documento || null,
      telefono: formulario.telefono,
      correo: formulario.correo || null,
      observaciones: formulario.observaciones || null,
    }),
  });

  const datos = (await respuesta.json()) as
    | ClienteApi
    | { mensaje?: string };

  if (!respuesta.ok) {
    throw new Error(
      "mensaje" in datos && datos.mensaje
        ? datos.mensaje
        : "No fue posible registrar el cliente.",
    );
  }

  return convertirCliente(datos as ClienteApi);
}

//actualizar cliente editado 
export async function actualizarCliente(
  id: number,
  formulario: FormularioCliente,
): Promise<Cliente> {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombres: formulario.nombres,
      apellidos: formulario.apellidos || null,
      documento: formulario.documento || null,
      telefono: formulario.telefono,
      correo: formulario.correo || null,
      observaciones: formulario.observaciones || null,
    }),
  });

  const datos = (await respuesta.json()) as
    | ClienteApi
    | { mensaje?: string };

  if (!respuesta.ok) {
    throw new Error(
      "mensaje" in datos && datos.mensaje
        ? datos.mensaje
        : "No fue posible actualizar el cliente.",
    );
  }

  return convertirCliente(datos as ClienteApi);
}