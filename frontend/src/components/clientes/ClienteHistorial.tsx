import type { Cliente, PedidoCliente } from "./types/tipos";

type ClienteHistorialProps = {
  cliente: Cliente;
  pedidos: PedidoCliente[];
  formatearDinero: (valor: number) => string;
  onVolver: () => void;
};

function crearClaseEstado(estado: string) {
  return estado
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "-");
}

function ClienteHistorial({
  cliente,
  pedidos,
  formatearDinero,
  onVolver,
}: ClienteHistorialProps) {
  const totalComprado = pedidos.reduce(
    (total, pedido) => total + pedido.total,
    0,
  );

  const saldoPendiente = pedidos.reduce(
    (total, pedido) => total + pedido.saldo,
    0,
  );

  return (
    <section className="cliente-pagina">
      <div className="cliente-pagina-navegacion">
        <button type="button" onClick={onVolver}>
          ← Volver a clientes
        </button>

        <span>/</span>

        <strong>
          {cliente.nombres} {cliente.apellidos}
        </strong>
      </div>

      <div className="cliente-pagina-encabezado">
        <div className="cliente-pagina-identidad">
          <span className="cliente-pagina-avatar">
            {cliente.nombres.charAt(0)}
            {cliente.apellidos.charAt(0)}
          </span>

          <div>
            <h2>
              {cliente.nombres} {cliente.apellidos}
            </h2>

            <p>
              {cliente.telefono}
              {cliente.correo ? ` · ${cliente.correo}` : ""}
            </p>
          </div>
        </div>

        <div className="cliente-pagina-acciones">
          <button
            type="button"
            className="cliente-accion-secundaria"
          >
            Editar cliente
          </button>

          <button
            type="button"
            className="clientes-boton-principal"
          >
            + Nuevo pedido
          </button>
        </div>
      </div>

      <div className="cliente-pagina-resumen">
        <article>
          <span>Pedidos realizados</span>
          <strong>{pedidos.length}</strong>
        </article>

        <article>
          <span>Total comprado</span>
          <strong>{formatearDinero(totalComprado)}</strong>
        </article>

        <article>
          <span>Saldo pendiente</span>
          <strong
            className={
              saldoPendiente > 0 ? "saldo-pendiente" : "saldo-cero"
            }
          >
            {formatearDinero(saldoPendiente)}
          </strong>
        </article>

        <article>
          <span>Última visita</span>
          <strong>{cliente.ultimaVisita}</strong>
        </article>
      </div>

      <div className="cliente-pagina-panel">
        <div className="cliente-pagina-panel-encabezado">
          <div>
            <h3>Historial de pedidos</h3>
            <p>Todos los trabajos registrados para este cliente.</p>
          </div>

          <div className="cliente-pagina-filtros">
            <input
              type="search"
              placeholder="Buscar pedido o producto"
            />

            <select defaultValue="">
              <option value="">Todos los estados</option>
              <option value="Recibido">Recibido</option>
              <option value="En edición">En edición</option>
              <option value="Listo para entregar">
                Listo para entregar
              </option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="cliente-pagina-tabla-contenedor">
          <table className="cliente-pagina-tabla">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Fecha</th>
                <th>Producto principal</th>
                <th>Total</th>
                <th>Saldo</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>
                    <strong>{pedido.id}</strong>
                  </td>
                  <td>{pedido.fecha}</td>
                  <td>{pedido.producto}</td>
                  <td>{formatearDinero(pedido.total)}</td>
                  <td>
                    <strong
                      className={
                        pedido.saldo > 0
                          ? "saldo-pendiente"
                          : "saldo-cero"
                      }
                    >
                      {formatearDinero(pedido.saldo)}
                    </strong>
                  </td>
                  <td>
                    <span
                      className={`cliente-estado cliente-estado-${crearClaseEstado(
                        pedido.estado,
                      )}`}
                    >
                      {pedido.estado}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="clientes-boton-ver"
                    >
                      Abrir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pedidos.length === 0 && (
            <div className="cliente-sin-pedidos">
              <span>📸</span>
              <strong>No hay pedidos registrados</strong>
              <p>Crea el primer pedido para comenzar el historial.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ClienteHistorial;