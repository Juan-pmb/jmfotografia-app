import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Search } from "lucide-react";
import ClienteFicha from "./ClienteFicha";
import ClienteHistorial from "./ClienteHistorial";
import { formularioInicial } from "./data/datos";
import { REGISTROS_POR_PAGINA } from "../../constants/config";
import {
  consultarClientes,
  consultarClientePorId,
  registrarCliente,
  actualizarCliente,
} from "./services/clientes.service";
import type {
  Cliente,
  FormularioCliente,
  PedidoCliente
} from "./types/tipos";
import "./ClientesPage.css";

function formatearDinero(valor: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const [busqueda, setBusqueda] = useState("");

  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);

  const [clienteEditando, setClienteEditando] =
    useState<Cliente | null>(null);

  const [mostrarHistorialCompleto, setMostrarHistorialCompleto] =
    useState(false);

  const [modalAbierto, setModalAbierto] = useState(false);

  const [formulario, setFormulario] =
    useState<FormularioCliente>(formularioInicial);

  const [error, setError] = useState("");

  useEffect(() => {
    let componenteActivo = true;

    async function cargarClientes() {
      try {
        setCargando(true);
        setErrorCarga("");

        const clientesApi = await consultarClientes();

        if (componenteActivo) {
          setClientes(clientesApi);
        }
      } catch (error) {
        if (componenteActivo) {
          setErrorCarga(
            error instanceof Error
              ? error.message
              : "No fue posible cargar los clientes.",
          );
        }
      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    }

    void cargarClientes();

    return () => {
      componenteActivo = false;
    };
  }, []);

  const clientesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    if (!termino) {
      return clientes;
    }

    return clientes.filter((cliente) => {
      const nombreCompleto =
        `${cliente.nombres} ${cliente.apellidos}`.toLowerCase();

      return (
        nombreCompleto.includes(termino) ||
        cliente.telefono.includes(termino) ||
        cliente.documento.includes(termino) ||
        cliente.correo.toLowerCase().includes(termino)
      );
    });
  }, [busqueda, clientes]);

  //Paginación --FILTRADOS
  const indiceInicial = (paginaActual - 1) * REGISTROS_POR_PAGINA;

  const indiceFinal = indiceInicial + REGISTROS_POR_PAGINA;

  const clientesPaginados = clientesFiltrados.slice(
    indiceInicial,
    indiceFinal
  );

  const totalPaginas = Math.ceil(
    clientesFiltrados.length / REGISTROS_POR_PAGINA
  );

  const irPaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual((pagina) => pagina - 1);
    }
  };

  const irPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual((pagina) => pagina + 1);
    }
  };

  const pedidosClienteSeleccionado: PedidoCliente[] = [];

  function actualizarCampo(
    campo: keyof FormularioCliente,
    valor: string,
  ) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));

    setError("");
  }

  function cerrarFormulario() {
    setModalAbierto(false);
    setFormulario(formularioInicial);
    setClienteEditando(null);
    setError("");
  }

  async function guardarCliente(
    evento: FormEvent<HTMLFormElement>,
  ) {
    evento.preventDefault();

    if (!formulario.nombres.trim()) {
      setError("Debes escribir el nombre del cliente.");
      return;
    }

    if (!formulario.telefono.trim()) {
      setError("Debes escribir el número de celular.");
      return;
    }

    const telefonoExiste = clientes.some(
      (cliente) =>
        cliente.telefono === formulario.telefono.trim() &&
        cliente.id !== clienteEditando?.id,
    );

    if (telefonoExiste) {
      setError("Ya existe un cliente con ese número de celular.");
      return;
    }

    const documentoExiste =
      formulario.documento.trim() !== "" &&
      clientes.some(
        (cliente) =>
          cliente.documento === formulario.documento.trim() &&
          cliente.id !== clienteEditando?.id,
      );

    if (documentoExiste) {
      setError("Ya existe un cliente con ese documento.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      if (clienteEditando) {

        const clienteActualizado =
          await actualizarCliente(
            clienteEditando.id,
            formulario,
          );

        setClientes((anteriores) =>
          anteriores.map((cliente) =>
            cliente.id === clienteActualizado.id
              ? clienteActualizado
              : cliente,
          ),
        );

      } else {

        const clienteRegistrado =
          await registrarCliente(formulario);

        setClientes((anteriores) => [
          clienteRegistrado,
          ...anteriores,
        ]);

      }

      cerrarFormulario();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No fue posible guardar el cliente.",
      );
    } finally {
      setGuardando(false);
    }
  }

  if (clienteSeleccionado && mostrarHistorialCompleto) {
    return (
      <ClienteHistorial
        cliente={clienteSeleccionado}
        pedidos={pedidosClienteSeleccionado}
        formatearDinero={formatearDinero}
        onVolver={() => {
          setMostrarHistorialCompleto(false);
          setClienteSeleccionado(null);
        }}
      />
    );
  }

  return (
    <section className="clientes-modulo">
      <div className="clientes-resumen">
        <article className="clientes-resumen-tarjeta">
          <span>👥</span>

          <div>
            <p>Total de clientes</p>
            <strong>{clientes.length}</strong>
          </div>
        </article>

        <article className="clientes-resumen-tarjeta">
          <span>🆕</span>

          <div>
            <p>Nuevos este mes</p>
            <strong>8</strong>
          </div>
        </article>

        <article className="clientes-resumen-tarjeta">
          <span>💰</span>

          <div>
            <p>Saldo de clientes</p>

            <strong>
              {formatearDinero(
                clientes.reduce(
                  (total, cliente) =>
                    total + cliente.saldoPendiente,
                  0,
                ),
              )}
            </strong>
          </div>
        </article>
      </div>

      <div className="clientes-panel">
        <div className="clientes-panel-encabezado">
          <div>
            <h2>Directorio de clientes</h2>
            <p>Consulta la información y el historial.</p>
          </div>

          <button
            type="button"
            className="clientes-boton-principal"
            onClick={() => setModalAbierto(true)}
          >
            + Nuevo cliente
          </button>
        </div>

        <div className="clientes-herramientas">

          <div className="herramientas-izquierda">

            <label className="clientes-buscador">

              <Search className="buscador-icono" size={20} />

              <input
                type="search"
                value={busqueda}
                onChange={(evento) =>
                  setBusqueda(evento.target.value)
                }
                placeholder="Buscar por nombre, celular, documento o correo"
              />

            </label>

            <span className="clientes-contador">
              {clientesFiltrados.length} resultado
              {clientesFiltrados.length === 1 ? "" : "s"}
            </span>

          </div>

          <div className="herramientas-derecha">

            <button
              className="paginacion-btn"
              onClick={irPaginaAnterior}
              disabled={paginaActual === 1}
              title="Página anterior"
            >
              ◀
            </button>

            <span className="paginacion-texto">
              Página {paginaActual} de {totalPaginas || 1}
            </span>

            <button
              className="paginacion-btn"
              onClick={irPaginaSiguiente}
              disabled={
                paginaActual === totalPaginas ||
                totalPaginas === 0
              }
              title="Página siguiente"
            >
              ▶
            </button>

          </div>

        </div>

        <div className="clientes-tabla-contenedor">
          {cargando && (
            <div className="clientes-estado-carga">
              <span className="clientes-cargador" />
              <strong>Cargando clientes...</strong>
            </div>
          )}

          {errorCarga && !cargando && (
            <div className="clientes-error-carga">
              <strong>
                No se pudieron cargar los clientes
              </strong>
              <p>{errorCarga}</p>
            </div>
          )}

          {!cargando && !errorCarga && (
            <>
              <table className="clientes-tabla">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Celular</th>
                    <th>Documento</th>
                    <th>Pedidos</th>
                    <th>Última visita</th>
                    <th>Saldo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {clientesPaginados.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>
                        <div className="cliente-identidad">
                          <span className="cliente-avatar">
                            {cliente.nombres.charAt(0)}
                            {cliente.apellidos.charAt(0)}
                          </span>

                          <div>
                            <strong>
                              {[cliente.nombres, cliente.apellidos]
                                .filter(Boolean)
                                .join(" ")}
                            </strong>

                            <small>
                              {cliente.correo ||
                                "Sin correo registrado"}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>{cliente.telefono}</td>

                      <td>
                        {cliente.documento ||
                          "Sin documento"}
                      </td>

                      <td>{cliente.cantidadPedidos}</td>

                      <td>{cliente.ultimaVisita}</td>

                      <td>
                        <strong
                          className={
                            cliente.saldoPendiente > 0
                              ? "saldo-pendiente"
                              : "saldo-cero"
                          }
                        >
                          {formatearDinero(
                            cliente.saldoPendiente,
                          )}
                        </strong>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="clientes-boton-ver"
                          onClick={async () => {
                            try {
                              const clienteCompleto =
                                await consultarClientePorId(cliente.id);

                              setClienteSeleccionado(clienteCompleto);
                              setMostrarHistorialCompleto(false);
                            } catch (error) {
                              console.error(error);
                              alert("No fue posible cargar la información del cliente.");
                            }
                          }}
                        >
                          Ver ficha
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

           

              {clientesFiltrados.length === 0 && (
                <div className="clientes-vacio">
                  <span>🔎</span>
                  <h3>No hay clientes para mostrar</h3>
                  <p>
                    Registra un cliente nuevo o cambia el
                    término de búsqueda.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {modalAbierto && (
        <div
          className="clientes-modal-fondo"
          onMouseDown={cerrarFormulario}
        >
          <div
            className="clientes-modal"
            onMouseDown={(evento) =>
              evento.stopPropagation()
            }
          >
            <div className="clientes-modal-encabezado">
              <div>
                <h2>
                  {clienteEditando
                    ? "Editar cliente"
                    : "Nuevo cliente"}
                </h2>
                <p>
                  Nombre y celular son obligatorios.
                </p>
              </div>

              <button
                type="button"
                className="clientes-modal-cerrar"
                onClick={cerrarFormulario}
                aria-label="Cerrar formulario"
              >
                ×
              </button>
            </div>

            <form
              className="clientes-formulario"
              onSubmit={guardarCliente}
            >
              <div className="clientes-formulario-grid">
                <label>
                  Nombres *
                  <input
                    value={formulario.nombres}
                    onChange={(evento) =>
                      actualizarCampo(
                        "nombres",
                        evento.target.value,
                      )
                    }
                    autoFocus
                  />
                </label>

                <label>
                  Apellidos
                  <input
                    value={formulario.apellidos}
                    onChange={(evento) =>
                      actualizarCampo(
                        "apellidos",
                        evento.target.value,
                      )
                    }
                  />
                </label>

                <label>
                  Celular *
                  <input
                    value={formulario.telefono}
                    onChange={(evento) =>
                      actualizarCampo(
                        "telefono",
                        evento.target.value.replace(
                          /\D/g,
                          "",
                        ),
                      )
                    }
                    inputMode="numeric"
                  />
                </label>

                <label>
                  Documento
                  <input
                    value={formulario.documento}
                    onChange={(evento) =>
                      actualizarCampo(
                        "documento",
                        evento.target.value.replace(
                          /\D/g,
                          "",
                        ),
                      )
                    }
                    inputMode="numeric"
                  />
                </label>

                <label>
                  Correo
                  <input
                    type="email"
                    value={formulario.correo}
                    onChange={(evento) =>
                      actualizarCampo(
                        "correo",
                        evento.target.value,
                      )
                    }
                  />
                </label>


              </div>

              <label className="clientes-campo-completo">
                Observaciones
                <textarea
                  rows={3}
                  value={formulario.observaciones}
                  onChange={(evento) =>
                    actualizarCampo(
                      "observaciones",
                      evento.target.value,
                    )
                  }
                />
              </label>

              {error && (
                <div className="clientes-error">
                  {error}
                </div>
              )}

              <div className="clientes-formulario-acciones">
                <button
                  type="button"
                  className="clientes-boton-cancelar"
                  onClick={cerrarFormulario}
                  disabled={guardando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="clientes-boton-principal"
                  disabled={guardando}
                >
                  {guardando
                    ? "Guardando..."
                    : clienteEditando
                      ? "Guardar cambios"
                      : "Registrar cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {clienteSeleccionado && (
        <ClienteFicha
          cliente={clienteSeleccionado}
          pedidos={pedidosClienteSeleccionado}
          formatearDinero={formatearDinero}
          onCerrar={() =>
            setClienteSeleccionado(null)
          }
          onVerHistorial={() =>
            setMostrarHistorialCompleto(true)
          }

          //EDITAR ONCLICK DESESTRUCTURACION:
          onEditar={() => {
            setClienteEditando(clienteSeleccionado);

            setFormulario({
              nombres: clienteSeleccionado.nombres,
              apellidos: clienteSeleccionado.apellidos ?? "",
              telefono: clienteSeleccionado.telefono,
              documento: clienteSeleccionado.documento ?? "",
              correo: clienteSeleccionado.correo ?? "",
              observaciones: clienteSeleccionado.observaciones ?? "",
            });

            setClienteSeleccionado(null);
            setModalAbierto(true);
          }}

        />
      )}
    </section>
  );
}

export default ClientesPage;