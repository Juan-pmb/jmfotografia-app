import { useState } from "react";
import ClientesPage from "./components/clientes/ClientesPage";
import "./App.css";

type Seccion =
  | "dashboard"
  | "clientes"
  | "pedidos"
  | "productos"
  | "agenda"
  | "caja"
  | "reportes";

const pedidosRecientes = [
  {
    id: "JM-0001",
    cliente: "Pepito Pérez",
    producto: "Seguimiento mensual bebé",
    total: 75000,
    saldo: 45000,
    estado: "En edición",
  },
  {
    id: "JM-0002",
    cliente: "María Gómez",
    producto: "Retablo 40x60",
    total: 90000,
    saldo: 0,
    estado: "Listo para entregar",
  },
  {
    id: "JM-0003",
    cliente: "Carlos Ramírez",
    producto: "Fotos para documento",
    total: 20000,
    saldo: 0,
    estado: "Entregado",
  },
];

function formatearDinero(valor: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

function App() {
  const [seccionActiva, setSeccionActiva] =
    useState<Seccion>("dashboard");

  const opciones: Array<{
    id: Seccion;
    icono: string;
    texto: string;
  }> = [
    { id: "dashboard", icono: "⌂", texto: "Inicio" },
    { id: "clientes", icono: "👤", texto: "Clientes" },
    { id: "pedidos", icono: "📸", texto: "Pedidos" },
    { id: "productos", icono: "📦", texto: "Productos" },
    { id: "agenda", icono: "📅", texto: "Agenda" },
    { id: "caja", icono: "💰", texto: "Caja" },
    { id: "reportes", icono: "📊", texto: "Reportes" },
  ];

  return (
    <div className="aplicacion">
      <aside className="barra-lateral">
        <div className="marca">
          <div className="marca-logo">JM</div>

          <div>
            <strong>JMfotografía</strong>
            <span>Administración</span>
          </div>
        </div>

        <nav className="menu">
          {opciones.map((opcion) => (
            <button
              key={opcion.id}
              className={
                seccionActiva === opcion.id
                  ? "menu-opcion activa"
                  : "menu-opcion"
              }
              onClick={() => setSeccionActiva(opcion.id)}
            >
              <span>{opcion.icono}</span>
              {opcion.texto}
            </button>
          ))}
        </nav>

        <div className="usuario">
          <div className="usuario-avatar">JM</div>

          <div>
            <strong>Administrador</strong>
            <span>JMfotografía</span>
          </div>
        </div>
      </aside>

      <main className="contenido">
        <header className="encabezado">
          <div>
            <h1>
              {seccionActiva === "dashboard"
                ? "Panel principal"
                : opciones.find((opcion) => opcion.id === seccionActiva)
                    ?.texto}
            </h1>

            <p>Control de clientes, pedidos, pagos y entregas.</p>
          </div>

          <button className="boton-principal">+ Nuevo pedido</button>
        </header>
{seccionActiva === "dashboard" && (
  <>
    <section className="tarjetas">
      <article className="tarjeta">
        <span className="tarjeta-icono">👥</span>

        <div>
          <p>Clientes registrados</p>
          <strong>128</strong>
          <small>8 nuevos este mes</small>
        </div>
      </article>

      <article className="tarjeta">
        <span className="tarjeta-icono">📸</span>

        <div>
          <p>Pedidos activos</p>
          <strong>24</strong>
          <small>6 pendientes de entrega</small>
        </div>
      </article>

      <article className="tarjeta">
        <span className="tarjeta-icono">💵</span>

        <div>
          <p>Ventas del mes</p>
          <strong>{formatearDinero(3850000)}</strong>
          <small>Información de prueba</small>
        </div>
      </article>

      <article className="tarjeta">
        <span className="tarjeta-icono">⚠️</span>

        <div>
          <p>Saldos pendientes</p>
          <strong>{formatearDinero(680000)}</strong>
          <small>12 pedidos con saldo</small>
        </div>
      </article>
    </section>

    <section className="panel">
      <div className="panel-encabezado">
        <div>
          <h2>Pedidos recientes</h2>
          <p>Últimos trabajos registrados en el sistema.</p>
        </div>

        <button className="boton-secundario">
          Ver todos
        </button>
      </div>

      <div className="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Total</th>
              <th>Saldo</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {pedidosRecientes.map((pedido) => (
              <tr key={pedido.id}>
                <td>
                  <strong>{pedido.id}</strong>
                </td>
                <td>{pedido.cliente}</td>
                <td>{pedido.producto}</td>
                <td>{formatearDinero(pedido.total)}</td>
                <td>{formatearDinero(pedido.saldo)}</td>
                <td>
                  <span
                    className={`estado ${pedido.estado
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {pedido.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </>
)}

{seccionActiva === "clientes" && <ClientesPage />}

{seccionActiva !== "dashboard" &&
  seccionActiva !== "clientes" && (
    <section className="panel pagina-construccion">
      <span>🚧</span>

      <h2>
        Módulo de{" "}
        {
          opciones.find(
            (opcion) => opcion.id === seccionActiva,
          )?.texto
        }
      </h2>

      <p>
        Esta pantalla es parte del prototipo. La construiremos más
        adelante.
      </p>
    </section>
  )}
      </main>
    </div>
  );
}

export default App;