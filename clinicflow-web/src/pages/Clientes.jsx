import { useCallback, useEffect, useState } from "react";
import API_URL from "../services/api";
import Swal from "sweetalert2";

function Clientes() {
  const [clientes, setClientes] = useState([]);

  const [nombre, setNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [activo, setActivo] = useState(true);

  const [clienteEditandoId, setClienteEditandoId] = useState(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const clientesPorPagina = 5;

  // =========================
  // CARGAR CLIENTES
  // =========================

  const obtenerClientes = useCallback(async () => {
  const token = localStorage.getItem("token");

  const respuesta = await fetch(`${API_URL}/Clientes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!respuesta.ok) {
    if (respuesta.status === 401) {
      throw new Error("Debes iniciar sesión.");
    }

    if (respuesta.status === 403) {
      throw new Error(
        "No tienes permisos para acceder a la gestión de clientes."
      );
    }

    throw new Error("No se pudieron cargar los clientes.");
  }

  return await respuesta.json();
}, []);

const cargarClientes = useCallback(async () => {
  try {
    const data = await obtenerClientes();
    setClientes(data);
  } catch (error) {
    console.error("Error al cargar clientes:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message || "No fue posible cargar los clientes.",
      confirmButtonColor: "#2563eb",
    });
  }
}, [obtenerClientes]);

useEffect(() => {
  let componenteActivo = true;

  obtenerClientes()
    .then((data) => {
      if (componenteActivo) {
        setClientes(data);
      }
    })
    .catch((error) => {
      console.error("Error al cargar clientes:", error);
    });

  return () => {
    componenteActivo = false;
  };
}, [obtenerClientes]);

  // =========================
  // LIMPIAR FORMULARIO
  // =========================

  const limpiarFormulario = () => {
    setClienteEditandoId(null);

    setNombre("");
    setPrimerApellido("");
    setSegundoApellido("");
    setEmail("");
    setTelefono("");
    setActivo(true);

    setModalAbierto(false);
  };

  // =========================
  // SELECCIONAR CLIENTE
  // =========================

  const seleccionarCliente = (cliente) => {
    setClienteEditandoId(cliente.id);

    setNombre(cliente.nombre);
    setPrimerApellido(cliente.primerApellido);
    setSegundoApellido(cliente.segundoApellido || "");
    setEmail(cliente.email);
    setTelefono(cliente.telefono || "");
    setActivo(cliente.activo);

    setModalAbierto(true);
  };

  // =========================
  // GUARDAR / ACTUALIZAR
  // =========================

  const guardarCliente = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const url = clienteEditandoId
      ? `${API_URL}/Clientes/${clienteEditandoId}`
      : `${API_URL}/Clientes`;

    const metodo = clienteEditandoId ? "PUT" : "POST";

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          id: clienteEditandoId ?? 0,
          nombre,
          primerApellido,
          segundoApellido,
          email,
          telefono,
          activo,
        }),
      });

      const data = await respuesta.text();

      if (!respuesta.ok) {
        if (respuesta.status === 401) {
          throw new Error("Debes iniciar sesión.");
        }

        if (respuesta.status === 403) {
          throw new Error(
            "No tienes permisos para realizar esta acción."
          );
        }

        throw new Error(data || "No se pudo guardar el cliente.");
      }

      await Swal.fire({
        icon: "success",
        title: clienteEditandoId
          ? "Cliente actualizado"
          : "Cliente registrado",
        text: clienteEditandoId
          ? "Los datos del cliente fueron actualizados correctamente."
          : "El cliente fue registrado correctamente.",
        confirmButtonColor: "#2563eb",
      });

      limpiarFormulario();

      await cargarClientes();
    } catch (error) {
      console.error("Error al guardar cliente:", error);

      Swal.fire({
        icon: "error",
        title: "No se pudo guardar",
        text: error.message || "Ocurrió un problema.",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  // =========================
  // ACTIVAR / INACTIVAR
  // =========================

  const cambiarEstadoCliente = async (cliente) => {
    const accion = cliente.activo ? "inactivar" : "activar";

    const confirmar = await Swal.fire({
      icon: "warning",

      title: cliente.activo
        ? "¿Inactivar cliente?"
        : "¿Activar cliente?",

      text: cliente.activo
        ? "El cliente no se eliminará, solo quedará inactivo."
        : "El cliente volverá a estar activo en el sistema.",

      showCancelButton: true,

      confirmButtonText: cliente.activo
        ? "Sí, inactivar"
        : "Sí, activar",

      cancelButtonText: "Cancelar",

      confirmButtonColor: cliente.activo
        ? "#dc2626"
        : "#2563eb",

      cancelButtonColor: "#6b7280",
    });

    if (!confirmar.isConfirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const respuesta = await fetch(
        `${API_URL}/Clientes/${cliente.id}/${accion}`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await respuesta.text();

      if (!respuesta.ok) {
        if (respuesta.status === 401) {
          throw new Error("Debes iniciar sesión.");
        }

        if (respuesta.status === 403) {
          throw new Error(
            "No tienes permisos para realizar esta acción."
          );
        }

        throw new Error(
          data || "No se pudo cambiar el estado del cliente."
        );
      }

      await Swal.fire({
        icon: "success",

        title: cliente.activo
          ? "Cliente inactivado"
          : "Cliente activado",

        text: cliente.activo
          ? "El cliente quedó inactivo correctamente."
          : "El cliente quedó activo correctamente.",

        confirmButtonColor: "#2563eb",
      });

      await cargarClientes();
    } catch (error) {
      console.error(
        "Error al cambiar estado del cliente:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "No se pudo cambiar el estado",
        text: error.message || "Ocurrió un problema.",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  // =========================
  // BÚSQUEDA
  // =========================

  const clientesFiltrados = clientes.filter((cliente) => {
    const nombreCompleto = `
      ${cliente.nombre}
      ${cliente.primerApellido}
      ${cliente.segundoApellido || ""}
    `.toLowerCase();

    const correo = cliente.email?.toLowerCase() || "";
    const telefonoCliente = cliente.telefono || "";

    const textoBusqueda = busqueda.toLowerCase();

    return (
      nombreCompleto.includes(textoBusqueda) ||
      correo.includes(textoBusqueda) ||
      telefonoCliente.includes(busqueda)
    );
  });

  // =========================
  // PAGINACIÓN
  // =========================

  const indiceUltimoCliente =
    paginaActual * clientesPorPagina;

  const indicePrimerCliente =
    indiceUltimoCliente - clientesPorPagina;

  const clientesPaginados =
    clientesFiltrados.slice(
      indicePrimerCliente,
      indiceUltimoCliente
    );

  const totalPaginas =
    Math.ceil(
      clientesFiltrados.length / clientesPorPagina
    ) || 1;

  // =========================
  // VISTA
  // =========================

  return (
    <div className="clientes-page">
      <div className="clientes-header">
        <div>
          <h2>Gestión de clientes</h2>

          <p>
            Registra, consulta, actualiza e inactiva
            información de clientes.
          </p>
        </div>

        <div className="clientes-actions">
          <input
            type="text"
            placeholder="Buscar por nombre, correo o teléfono"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />

          <button
            className="btn-primary"
            onClick={() => {
              limpiarFormulario();
              setModalAbierto(true);
            }}
          >
            Nuevo cliente
          </button>
        </div>
      </div>

      {/* MODAL */}

      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>
                {clienteEditandoId
                  ? "Editar cliente"
                  : "Registrar cliente"}
              </h3>

              <button
                type="button"
                className="modal-close"
                onClick={limpiarFormulario}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={guardarCliente}
              className="clientes-form modal-form"
            >
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) =>
                  setNombre(e.target.value)
                }
                required
              />

              <input
                type="text"
                placeholder="Primer apellido"
                value={primerApellido}
                onChange={(e) =>
                  setPrimerApellido(e.target.value)
                }
                required
              />

              <input
                type="text"
                placeholder="Segundo apellido"
                value={segundoApellido}
                onChange={(e) =>
                  setSegundoApellido(e.target.value)
                }
              />

              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

              <input
                type="text"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) =>
                  setTelefono(e.target.value)
                }
                required
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  {clienteEditandoId
                    ? "Actualizar cliente"
                    : "Guardar cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABLA */}

      <section className="clientes-table-card">
        <h3>
          Clientes registrados (
          {clientesFiltrados.length})
        </h3>

        {clientesFiltrados.length === 0 ? (
          <p className="empty-message">
            No hay clientes registrados.
          </p>
        ) : (
          <div className="table-container">
            <table className="clientes-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre completo</th>
                  <th>Correo electrónico</th>
                  <th>Teléfono</th>
                  <th className="actions-column">
                    Acciones
                  </th>
                  <th className="actions-column">
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody>
                {clientesPaginados.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>

                    <td>
                      {cliente.nombre}{" "}
                      {cliente.primerApellido}{" "}
                      {cliente.segundoApellido}
                    </td>

                    <td>{cliente.email}</td>

                    <td>{cliente.telefono}</td>

                    <td className="actions-cell">
                      <div className="table-actions">
                        <button
                          className="btn-edit"
                          onClick={() =>
                            seleccionarCliente(cliente)
                          }
                        >
                          Editar
                        </button>

                        <button
                          className={
                            cliente.activo
                              ? "btn-delete"
                              : "btn-activate"
                          }
                          onClick={() =>
                            cambiarEstadoCliente(cliente)
                          }
                        >
                          {cliente.activo
                            ? "Inactivar"
                            : "Activar"}
                        </button>
                      </div>
                    </td>

                    <td>
                      <span
                        className={
                          cliente.activo
                            ? "badge-active"
                            : "badge-inactive"
                        }
                      >
                        {cliente.activo
                          ? "Activo"
                          : "Inactivo"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                onClick={() =>
                  setPaginaActual(
                    paginaActual - 1
                  )
                }
                disabled={paginaActual === 1}
              >
                Anterior
              </button>

              <span>
                Página {paginaActual} de{" "}
                {totalPaginas}
              </span>

              <button
                onClick={() =>
                  setPaginaActual(
                    paginaActual + 1
                  )
                }
                disabled={
                  paginaActual === totalPaginas
                }
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Clientes;