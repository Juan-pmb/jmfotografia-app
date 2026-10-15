//ProductosPage.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import "./ProductosPage.css";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  crearVariante,
  actualizarVariante,
  type Producto,
  type VarianteProducto,
  type CategoriaProducto,
} from "./services/productos.service";

const CATEGORIAS: { valor: CategoriaProducto; texto: string }[] = [
  { valor: "RETABLOS", texto: "Retablos" },
  { valor: "REGALOS_PERSONALIZADOS", texto: "Regalos personalizados" },
  { valor: "PORTARRETRATOS", texto: "Portarretratos" },
  { valor: "COMBOS", texto: "Combos" },
  { valor: "COJINES", texto: "Cojines" },
  { valor: "ALBUMES", texto: "Álbumes" },
];

const dinero = (valor: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);

const errorTexto = (error: unknown) =>
  error instanceof Error ? error.message : "Ocurrió un error inesperado.";

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("TODAS");
  const [estado, setEstado] = useState("TODOS");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [modalProducto, setModalProducto] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const [nombre, setNombre] = useState("");
  const [categoriaFormulario, setCategoriaFormulario] =
    useState<CategoriaProducto>("RETABLOS");

  const [productoVariantes, setProductoVariantes] =
    useState<Producto | null>(null);
  const [varianteEditar, setVarianteEditar] =
    useState<VarianteProducto | null>(null);
  const [nombreVariante, setNombreVariante] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [bajoPedido, setBajoPedido] = useState(false);

  const cargarProductos = useCallback(async () => {
    setCargando(true);
    setError("");

    try {
      const datos = await obtenerProductos();
      setProductos(datos);
    } catch (err) {
      setError(errorTexto(err));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarProductos();
  }, [cargarProductos]);

  const productosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase("es-CO");

    return productos.filter((producto) => {
      const coincideTexto =
        producto.nombre.toLocaleLowerCase("es-CO").includes(termino) ||
        CATEGORIAS.find((c) => c.valor === producto.categoria)?.texto
          .toLocaleLowerCase("es-CO")
          .includes(termino);

      const coincideCategoria =
        categoria === "TODAS" || producto.categoria === categoria;

      const coincideEstado =
        estado === "TODOS" ||
        (estado === "ACTIVOS" && producto.activo) ||
        (estado === "INACTIVOS" && !producto.activo);

      return coincideTexto && coincideCategoria && coincideEstado;
    });
  }, [productos, busqueda, categoria, estado]);

  const totalVariantes = productos.reduce(
    (total, producto) => total + producto.variantes.length,
    0
  );

  const abrirCrear = () => {
    setProductoEditar(null);
    setNombre("");
    setCategoriaFormulario("RETABLOS");
    setError("");
    setMensaje("");
    setModalProducto(true);
  };

  const abrirEditar = (producto: Producto) => {
    setProductoEditar(producto);
    setNombre(producto.nombre);
    setCategoriaFormulario(producto.categoria);
    setError("");
    setMensaje("");
    setModalProducto(true);
  };

  const guardarProducto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGuardando(true);
    setError("");
    setMensaje("");

    try {
      if (productoEditar) {
        await actualizarProducto(productoEditar.id, {
          nombre: nombre.trim(),
          categoria: categoriaFormulario,
        });
        setMensaje("Producto actualizado correctamente.");
      } else {
        await crearProducto({
          nombre: nombre.trim(),
          categoria: categoriaFormulario,
        });
        setMensaje("Producto creado correctamente.");
      }

      setModalProducto(false);
      await cargarProductos();
    } catch (err) {
      setError(errorTexto(err));
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstadoProducto = async (producto: Producto) => {
    const accion = producto.activo ? "desactivar" : "activar";

    if (!window.confirm(`¿Deseas ${accion} "${producto.nombre}"?`)) return;

    setError("");
    setMensaje("");

    try {
      await actualizarProducto(producto.id, { activo: !producto.activo });
      setMensaje(`Producto ${producto.activo ? "desactivado" : "activado"} correctamente.`);
      await cargarProductos();
    } catch (err) {
      setError(errorTexto(err));
    }
  };

  const abrirVariantes = (producto: Producto) => {
    setProductoVariantes(producto);
    setVarianteEditar(null);
    setNombreVariante("");
    setDescripcion("");
    setPrecio("");
    setBajoPedido(false);
    setError("");
    setMensaje("");
  };

  const editarVariante = (variante: VarianteProducto) => {
    setVarianteEditar(variante);
    setNombreVariante(variante.nombre);
    setDescripcion(variante.descripcion ?? "");
    setPrecio(String(variante.precioBase));
    setBajoPedido(variante.bajoPedido);
    setError("");
    setMensaje("");
  };

  const guardarVariante = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!productoVariantes) return;

    const precioNumero = Number(precio);

    if (!Number.isInteger(precioNumero) || precioNumero < 0) {
      setError("Ingresa un precio entero válido, igual o mayor a cero.");
      return;
    }

    setGuardando(true);
    setError("");
    setMensaje("");

    try {
      if (varianteEditar) {
        await actualizarVariante(varianteEditar.id, {
          nombre: nombreVariante.trim(),
          descripcion: descripcion.trim() || null,
          precioBase: precioNumero,
          bajoPedido,
        });
        setMensaje("Variante actualizada correctamente.");
      } else {
        await crearVariante({
          productoId: productoVariantes.id,
          nombre: nombreVariante.trim(),
          descripcion: descripcion.trim() || undefined,
          precioBase: precioNumero,
          bajoPedido,
        });
        setMensaje("Variante creada correctamente.");
      }

      setVarianteEditar(null);
      setNombreVariante("");
      setDescripcion("");
      setPrecio("");
      setBajoPedido(false);
      await cargarProductos();
    } catch (err) {
      setError(errorTexto(err));
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstadoVariante = async (variante: VarianteProducto) => {
    setError("");
    setMensaje("");

    try {
      await actualizarVariante(variante.id, { activo: !variante.activo });
      setMensaje(`Variante ${variante.activo ? "desactivada" : "activada"} correctamente.`);
      await cargarProductos();
    } catch (err) {
      setError(errorTexto(err));
    }
  };


  const productoActualizado = productoVariantes
    ? productos.find((p) => p.id === productoVariantes.id) ?? productoVariantes
    : null;

  return (
    <div className="productos-pagina">

      <section className="productos-resumen">
        <article className="superficie tarjeta producto-resumen-card">
          <span>📦</span>

          <div>
            <p>Productos registrados</p>
            <strong>{productos.length}</strong>
          </div>
        </article>

        <article className="superficie tarjeta producto-resumen-card">
          <span>✅</span>

          <div>
            <p>Productos activos</p>
            <strong>{productos.filter((p) => p.activo).length}</strong>
          </div>
        </article>

        <article className="superficie tarjeta producto-resumen-card">
          <span>🧩</span>

          <div>
            <p>Variantes registradas</p>
            <strong>{totalVariantes}</strong>
          </div>
        </article>
      </section>


      <section className="superficie panel productos-panel">
        <div className="productos-encabezado">
          <div>
            <h2>Catálogo de productos</h2>
            <p>Administra el catálogo, las descripciones y los precios base.</p>
          </div>
          <button className="boton boton--principal" onClick={abrirCrear}>
            Nuevo producto
          </button>
        </div>

        <div className="productos-filtros">
          <input
            className="campo"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto..."
            aria-label="Buscar producto"
          />
          <select
            className="campo"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            aria-label="Filtrar por categoría"
          >
            <option value="TODAS">Todas las categorías</option>
            {CATEGORIAS.map((c) => (
              <option key={c.valor} value={c.valor}>{c.texto}</option>
            ))}
          </select>
          <select
            className="campo"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="ACTIVOS">Activos</option>
            <option value="INACTIVOS">Inactivos</option>
          </select>
        </div>

        {error && <div className="productos-alerta error">{error}</div>}
        {mensaje && <div className="productos-alerta exito">{mensaje}</div>}

        {cargando ? (
          <p className="productos-vacio">Cargando productos...</p>
        ) : productosFiltrados.length === 0 ? (
          <div className="productos-vacio">
            <span>📦</span>
            <strong>No se encontraron productos</strong>
            <p>Prueba cambiando los filtros o registra un producto nuevo.</p>
          </div>
        ) : (
          <div className="productos-tabla-contenedor">
            <table className="tabla productos-tabla">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Variantes activas</th>
                  <th>Precio desde</th>
                  <th>Estado</th>
                  <th className="tabla-columna-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((producto) => {
                  const variantesActivas = producto.variantes.filter((v) => v.activo);
                  const precios = variantesActivas.map((v) => v.precioBase);

                  return (
                    <tr key={producto.id}>
                      <td>
                        <strong>{producto.nombre}</strong>
                        <small>PR-{String(producto.id).padStart(4, "0")}</small>
                      </td>
                      <td>{CATEGORIAS.find((c) => c.valor === producto.categoria)?.texto}</td>
                      <td>{variantesActivas.length}</td>
                      <td>{precios.length ? dinero(Math.min(...precios)) : "Sin precio"}</td>
                      <td>
                        <span className={`estado ${producto.activo ? "estado--exito" : "estado--error"}`}>
                          {producto.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="tabla-columna-acciones">
                        <div className=" acciones productos-acciones">
                          <button
                            type="button"
                            className="boton boton--secundario tabla-boton-accion"
                            onClick={() => abrirEditar(producto)}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="boton boton--secundario tabla-boton-accion"
                            onClick={() => abrirVariantes(producto)}
                          >
                            Variantes
                          </button>

                          <button
                            type="button"
                            className={`boton ${producto.activo ? "boton--peligro" : "boton--exito"}`}
                            onClick={() => void cambiarEstadoProducto(producto)}
                          >
                            {producto.activo ? "Desactivar" : "Activar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalProducto && (
        <div className="fondo-modal productos-modal-fondo" onClick={() => setModalProducto(false)}>
          <section className="superficie productos-modal" onClick={(e) => e.stopPropagation()}>
            <div className="productos-modal-encabezado">
              <div>
                <h2>{productoEditar ? "Editar producto" : "Nuevo producto"}</h2>
                <p>Información general del catálogo.</p>
              </div>
              <button className="productos-cerrar" onClick={() => setModalProducto(false)} aria-label="Cerrar">×</button>
            </div>

            <form onSubmit={guardarProducto}>
              <label className="etiqueta-campo">
                Nombre del producto
                <input
                  className="campo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  maxLength={120}
                  placeholder="Ej. Retablo personalizado"
                />
              </label>
              <label className="etiqueta-campo">
                Categoría
                <select
                  className="campo"
                  value={categoriaFormulario}
                  onChange={(e) => setCategoriaFormulario(e.target.value as CategoriaProducto)}
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c.valor} value={c.valor}>{c.texto}</option>
                  ))}
                </select>
              </label>
              <div className="productos-modal-acciones">
                <button type="button" className="boton boton--principal" onClick={() => setModalProducto(false)}>Cancelar</button>
                <button className="boton boton--principal" disabled={guardando}>
                  {guardando ? "Guardando..." : "Guardar producto"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {productoActualizado && (
        <div className="fondo-modal productos-modal-fondo" onClick={() => setProductoVariantes(null)}>
          <section className="superficie productos-modal productos-modal-ancho" onClick={(e) => e.stopPropagation()}>
            <div className="productos-modal-encabezado">
              <div>
                <h2>Variantes del producto</h2>
                <p>{productoActualizado.nombre}</p>
              </div>
              <button className="productos-cerrar" onClick={() => setProductoVariantes(null)} aria-label="Cerrar">×</button>
            </div>

            <div className="variantes-contenido">
              <div className="variantes-lista">
                <h3>Descripciones y precios</h3>
                {productoActualizado.variantes.length === 0 ? (
                  <p className="productos-vacio">Este producto todavía no tiene variantes.</p>
                ) : productoActualizado.variantes.map((variante) => (
                  <article className="variante-fila" key={variante.id}>
                    <div>
                      <strong>{variante.nombre}</strong>
                      <span>{variante.descripcion || "Sin descripción"} · {dinero(variante.precioBase)}</span>

                      <small>
                        {variante.bajoPedido ? "Bajo pedido" : "Disponible para registro"} ·{" "}
                        <span className={variante.activo ? "variante-estado-activa" : "variante-estado-inactiva"}>
                          {variante.activo ? "Activa" : "Inactiva"}
                        </span>
                      </small>

                    </div>
                    <div className="productos-acciones">
                      <button onClick={() => editarVariante(variante)}>Editar</button>
                      <button onClick={() => void cambiarEstadoVariante(variante)}>
                        {variante.activo ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <form className="variantes-formulario" onSubmit={guardarVariante}>
                <h3>{varianteEditar ? "Editar variante" : "Nueva variante"}</h3>
                <label className="etiqueta-campo">
                  Nombre de la variante
                  <input className="campo" value={nombreVariante} onChange={(e) => setNombreVariante(e.target.value)} required maxLength={100} placeholder="Ej. 15x20 cm" />
                </label>
                <label className="etiqueta-campo">
                  Descripción
                  <input className="campo" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} maxLength={50} placeholder="Ej. 20 × 30 cm, interior azul o mug mágico" />
                </label>
                <label className="etiqueta-campo">
                  Precio base (COP)
                  <input className="campo" type="number" min="0" step="1" value={precio} onChange={(e) => setPrecio(e.target.value)} required placeholder="15000" />
                </label>
                <label className="variantes-checkbox">
                  <input className="campo" type="checkbox" checked={bajoPedido} onChange={(e) => setBajoPedido(e.target.checked)} />
                  Se fabrica bajo pedido
                </label>
                <div className="productos-modal-acciones">
                  {varianteEditar && (
                    <button type="button" className="boton boton--secundario" onClick={() => { setVarianteEditar(null); setNombreVariante(""); setDescripcion(""); setPrecio(""); setBajoPedido(false); }}>
                      Cancelar edición
                    </button>
                  )}
                  <button className="boton boton--principal" disabled={guardando || !productoActualizado.activo}>
                    {guardando ? "Guardando..." : varianteEditar ? "Guardar cambios" : "Crear variante"}
                  </button>
                </div>
                {!productoActualizado.activo && <small>Activa el producto para agregar variantes.</small>}
              </form>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
