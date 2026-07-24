export type EstadoPedido =
  | "Recibido"
  | "En edición"
  | "Listo para entregar"
  | "Entregado"
  | "Cancelado";

export type Cliente = {
  id: number;
  nombres: string;
  apellidos: string;
  documento: string;
  telefono: string;
  correo: string;
  observaciones?: string;
  cantidadPedidos: number;
  saldoPendiente: number;
  ultimaVisita: string;
  activo: boolean;
};

export type PedidoCliente = {
  id: string;
  clienteId: number;
  fecha: string;
  producto: string;
  total: number;
  saldo: number;
  estado: EstadoPedido;
};

export type FormularioCliente = {
  nombres: string;
  apellidos: string;
  documento: string;
  telefono: string;
  correo: string;
  observaciones: string;
};