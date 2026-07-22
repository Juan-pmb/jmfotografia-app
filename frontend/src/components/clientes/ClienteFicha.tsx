import type { Cliente, PedidoCliente } from "./types/tipos";

type ClienteFichaProps = {
  cliente: Cliente;
  pedidos: PedidoCliente[];
  formatearDinero: (valor: number) => string;
  onCerrar: () => void;
  onVerHistorial: () => void;
};

function crearClaseEstado(estado: string) {
  return estado
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "-");
}

function ClienteFicha({
  cliente,
  pedidos,
  formatearDinero,
  onCerrar,
  onVerHistorial,
}: ClienteFichaProps) {
  const ultimosPedidos = pedidos.slice(0, 3);

  const totalComprado = pedidos.reduce(
    (total, pedido) => total + pedido.total,
    0,
  );

  const saldoPendiente = pedidos.reduce(
    (total, pedido) => total + pedido.saldo,
    0,
  );

  return (
    <div className="clientes-modal-fondo" onMouseDown={onCerrar}>
      <aside
        className="cliente-ficha"
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <div className="cliente-ficha-superior">
          <button
            type="button"
            className="clientes-modal-cerrar"
            onClick={onCerrar}
            aria-label="Cerrar ficha"
          >
            ×
          </button>
        </div>

        <span className="cliente-ficha-avatar">
          {cliente.nombres.charAt(0)}
          {cliente.apellidos.charAt(0)}
        </span>

        <h2>
          {cliente.nombres} {cliente.apellidos}
        </h2>

        <p>{cliente.telefono}</p>

        <div className="cliente-ficha-acciones">
          <button type="button" className="cliente-accion-secundaria">
            Editar cliente
          </button>

          <button type="button" className="cliente-accion-peligro">
            Desactivar
          </button>
        </div>

        <section className="cliente-ficha-seccion">
          <h3>Información del cliente</h3>

          <div className="cliente-ficha-datos">
            <div>
              <span>Documento</span>
              <strong>{cliente.documento || "No registrado"}</strong>
            </div>

            <div>
              <span>Correo</span>
              <strong>{cliente.correo || "No registrado"}</strong>
            </div>

            <div>
              <span>Última visita</span>
              <strong>{cliente.ultimaVisita}</strong>
            </div>
          </div>
        </section>

        <section className="cliente-ficha-seccion">
          <h3>Resumen</h3>

          <div className="cliente-resumen-grid">
            <article>
              <span>Pedidos</span>
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
                  saldoPendiente > 0
                    ? "saldo-pendiente"
                    : "saldo-cero"
                }
              >
                {formatearDinero(saldoPendiente)}
              </strong>
            </article>
          </div>
        </section>

        <section className="cliente-ficha-seccion">
          <div className="cliente-historial-encabezado">
            <h3>Últimos pedidos</h3>
            <p>Los tres trabajos más recientes.</p>
          </div>

          <div className="cliente-historial">
            {ultimosPedidos.length > 0 ? (
              ultimosPedidos.map((pedido) => (
                <article
                  key={pedido.id}
                  className="cliente-pedido-tarjeta"
                >
                  <div className="cliente-pedido-superior">
                    <div>
                      <strong>{pedido.id}</strong>
                      <span>{pedido.fecha}</span>
                    </div>

                    <span
                      className={`cliente-estado cliente-estado-${crearClaseEstado(
                        pedido.estado,
                      )}`}
                    >
                      {pedido.estado}
                    </span>
                  </div>

                  <h4>{pedido.producto}</h4>

                  <div className="cliente-pedido-valores">
                    <div>
                      <span>Total</span>
                      <strong>
                        {formatearDinero(pedido.total)}
                      </strong>
                    </div>

                    <div>
                      <span>Saldo</span>
                      <strong
                        className={
                          pedido.saldo > 0
                            ? "saldo-pendiente"
                            : "saldo-cero"
                        }
                      >
                        {formatearDinero(pedido.saldo)}
                      </strong>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="cliente-sin-pedidos">
                <span>📸</span>
                <strong>Este cliente todavía no tiene pedidos</strong>
                <p>Crea el primer pedido para iniciar su historial.</p>
              </div>
            )}
          </div>
        </section>

        {pedidos.length > 0 && (
          <button
            type="button"
            className="cliente-ver-historial"
            onClick={onVerHistorial}
          >
            Ver historial completo
            <span>
              {pedidos.length} pedido
              {pedidos.length === 1 ? "" : "s"}
            </span>
          </button>
        )}

        <button
          type="button"
          className="clientes-boton-principal cliente-ficha-pedido"
        >
          + Crear pedido para este cliente
        </button>
      </aside>
    </div>
  );
}

export default ClienteFicha;