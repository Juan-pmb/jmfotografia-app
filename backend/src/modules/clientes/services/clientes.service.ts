import { ClientesRepository } from "../repositories/clientes.repository.js";
import { formatearTexto } from "../../../utils/formato.js";
import { CrearClienteDTO } from "../dto/crear-cliente.dto.js";


export class ClientesService {

  private repository = new ClientesRepository();

  async obtenerClientes() {
    return this.repository.obtenerClientes();
  }

  async obtenerCliente(id: number) {

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("El identificador del cliente no es válido.");
    }

    const cliente = await this.repository.obtenerCliente(id);

    if (!cliente) {
      throw new Error("Cliente no encontrado.")
    }
    return cliente;
  }

  // ---  CREAR CLIENTE ---

  async crearCliente(dto: CrearClienteDTO) {

    const {
      nombres,
      apellidos,
      documento,
      telefono,
      correo,
      observaciones,
    } = dto;

    if (
      typeof nombres !== "string" ||
      nombres.trim() === "" ||
      typeof telefono !== "string" ||
      telefono.trim() === ""
    ) {
      throw new Error(
        "Los nombres y el teléfono son obligatorios"
      );
    }

    const nombresFormateados = formatearTexto(nombres);

    const apellidosFormateados =
      typeof apellidos === "string"
        ? formatearTexto(apellidos)
        : "";

    const data = {

      nombres: nombresFormateados,

      apellidos:
        apellidosFormateados
          ? apellidosFormateados
          : null,

      documento:
        typeof documento === "string" &&
          documento.trim()
          ? documento.trim()
          : null,

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

    };

    return this.repository.crearCliente(data);

  }

  // --- ACTUALIZAR CLIENTE ---

  async actualizarCliente(
    id: number,
    dto: CrearClienteDTO,
  ) {

    const {
      nombres,
      apellidos,
      documento,
      telefono,
      correo,
      observaciones,
    } = dto;

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(
        "El identificador del cliente no es válido."
      );
    }

    if (
      typeof nombres !== "string" ||
      nombres.trim() === "" ||
      typeof telefono !== "string" ||
      telefono.trim() === ""
    ) {
      throw new Error(
        "Los nombres y el teléfono son obligatorios"
      );
    }

    const cliente =
      await this.repository.obtenerCliente(id);

    if (!cliente) {
      throw new Error(
        "Cliente no encontrado."
      );
    }

    const nombresFormateados = formatearTexto(nombres);

    const apellidosFormateados =
      typeof apellidos === "string"
        ? formatearTexto(apellidos)
        : "";

    const data = {

      nombres: nombresFormateados,

      apellidos:
        apellidosFormateados
          ? apellidosFormateados
          : null,

      documento:
        typeof documento === "string" &&
          documento.trim()
          ? documento.trim()
          : null,

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

    };

    const clienteActualizado =
      await this.repository.actualizarCliente(
        id,
        data,
      );
      return clienteActualizado;

  }

}