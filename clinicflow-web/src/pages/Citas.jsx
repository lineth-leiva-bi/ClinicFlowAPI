import { useCallback, useEffect, useState } from "react";
import API_URL from "../services/api";
import Swal from "sweetalert2";

function Citas({ rol }) {
  const [citas, setCitas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [fechaHora, setFechaHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [citaEditando, setCitaEditando] = useState(null);

  const esAdmin = rol === "Admin";

  // Fecha mínima usando la hora local
  const obtenerFechaMinima = () => {
    const ahora = new Date();
    ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());

    return ahora.toISOString().slice(0, 16);
  };

  // =========================
  // CARGAR CITAS
  // =========================

  const obtenerCitas = useCallback(async () => {
  const token = localStorage.getItem("token");

  const endpoint = esAdmin
    ? `${API_URL}/Cita/admin/todas`
    : `${API_URL}/Cita/mis-citas`;

  const respuesta = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar las citas.");
  }

  return await respuesta.json();
}, [esAdmin]);

const cargarCitas = useCallback(async () => {
  try {
    const data = await obtenerCitas();
    setCitas(data);
  } catch (error) {
    console.error("Error al cargar citas:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No fue posible cargar las citas.",
    });
  }
}, [obtenerCitas]);

useEffect(() => {
  let componenteActivo = true;

  obtenerCitas()
    .then((data) => {
      if (componenteActivo) {
        setCitas(data);
      }
    })
    .catch((error) => {
      console.error("Error al cargar citas:", error);
    });

  return () => {
    componenteActivo = false;
  };
}, [obtenerCitas]);

  // =========================
  // LIMPIAR FORMULARIO
  // =========================

  const limpiarFormulario = () => {
    setFechaHora("");
    setMotivo("");
    setObservaciones("");
    setCitaEditando(null);
  };

  // =========================
  // ABRIR / CERRAR FORMULARIO
  // =========================

  const abrirNuevaCita = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    limpiarFormulario();
    setMostrarFormulario(false);
  };

  // =========================
  // CREAR CITA
  // =========================

  const crearCita = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const respuesta = await fetch(`${API_URL}/Cita`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fechaHora,
          motivo,
          estado: "Pendiente",
          observaciones,
        }),
      });

      if (!respuesta.ok) {
        const mensaje = await respuesta.text();
        throw new Error(mensaje);
      }

      await Swal.fire({
        icon: "success",
        title: "Cita agendada",
        text: "Tu cita fue registrada correctamente.",
        timer: 1600,
        showConfirmButton: false,
      });

      limpiarFormulario();
      setMostrarFormulario(false);

      await cargarCitas();
    } catch (error) {
      console.error("Error al crear cita:", error);

      Swal.fire({
        icon: "error",
        title: "No se pudo agendar",
        text: "Ocurrió un problema al registrar la cita.",
      });
    }
  };

  // =========================
  // PREPARAR EDICIÓN
  // =========================

  const editarCita = (cita) => {
    setCitaEditando(cita);

    setFechaHora(cita.fechaHora.slice(0, 16));
    setMotivo(cita.motivo);
    setObservaciones(cita.observaciones || "");

    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // ACTUALIZAR CITA
  // =========================

  const actualizarCita = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const respuesta = await fetch(
        `${API_URL}/Cita/${citaEditando.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fechaHora,
            motivo,
            estado: citaEditando.estado,
            observaciones,
          }),
        }
      );

      if (!respuesta.ok) {
        const mensaje = await respuesta.text();
        throw new Error(mensaje);
      }

      await Swal.fire({
        icon: "success",
        title: "Cita actualizada",
        text: "Los cambios se guardaron correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

      limpiarFormulario();
      setMostrarFormulario(false);

      await cargarCitas();
    } catch (error) {
      console.error("Error al actualizar cita:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No fue posible actualizar la cita.",
      });
    }
  };

  // =========================
  // CANCELAR CITA
  // =========================

  const cancelarCita = async (id) => {
    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Cancelar cita?",
      text: "La cita quedará registrada como cancelada.",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Volver",
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const respuesta = await fetch(
        `${API_URL}/Cita/${id}/cancelar`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo cancelar la cita.");
      }

      await Swal.fire({
        icon: "success",
        title: "Cita cancelada",
        text: "La cita fue cancelada correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

      await cargarCitas();
    } catch (error) {
      console.error("Error al cancelar cita:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No fue posible cancelar la cita.",
      });
    }
  };

  return (
    <div className="citas-container">
      {/* ENCABEZADO */}

      <div className="citas-header">
        <div>
          <h2>{esAdmin ? "Gestión de citas" : "Mis citas"}</h2>

          <p>
            {esAdmin
              ? "Consulta y administra las citas registradas."
              : "Consulta y administra tus próximas citas."}
          </p>
        </div>

        {!esAdmin && (
          <>
            {!mostrarFormulario ? (
              <button
                className="btn-primary"
                onClick={abrirNuevaCita}
              >
                + Agendar cita
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={cerrarFormulario}
              >
                Cerrar
              </button>
            )}
          </>
        )}
      </div>

      {/* FORMULARIO CLIENTE */}

      {!esAdmin && mostrarFormulario && (
        <form
          className="cita-form"
          onSubmit={citaEditando ? actualizarCita : crearCita}
        >
          <h3>
            {citaEditando
              ? "Editar / Reprogramar cita"
              : "Agendar nueva cita"}
          </h3>

          <div>
            <label>Fecha y hora</label>

            <input
              type="datetime-local"
              value={fechaHora}
              onChange={(e) => setFechaHora(e.target.value)}
              onClick={(e) => e.currentTarget.showPicker?.()}
              min={obtenerFechaMinima()}
              required
            />
          </div>

          <div>
            <label>Motivo</label>

            <input
              type="text"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej. Consulta general"
              required
            />
          </div>

          <div>
            <label>Observaciones</label>

            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Información adicional para la cita"
              rows="3"
            />
          </div>

          <button type="submit" className="btn-primary">
            {citaEditando ? "Guardar cambios" : "Agendar cita"}
          </button>
        </form>
      )}

      {/* SIN CITAS */}

      {citas.length === 0 ? (
        <div className="empty-state">
          <h3>No hay citas registradas</h3>

          <p>
            {esAdmin
              ? "Todavía no existen citas en el sistema."
              : "Cuando agendes una cita aparecerá aquí."}
          </p>
        </div>
      ) : (
        /* TABLA */

        <div className="table-responsive">
          <table className="citas-table">
            <thead>
              <tr>
                {esAdmin && <th>Cliente</th>}

                <th>Fecha y hora</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Observaciones</th>

                {!esAdmin && <th>Acciones</th>}
              </tr>
            </thead>

            <tbody>
              {citas.map((cita) => (
                <tr key={cita.id}>
                  {esAdmin && (
                    <td>{cita.clienteNombre}</td>
                  )}

                  <td>
                    {new Date(cita.fechaHora).toLocaleString(
                      "es-CR"
                    )}
                  </td>

                  <td>{cita.motivo}</td>

                  <td>
                    <span
                      className={`estado estado-${cita.estado?.toLowerCase()}`}
                    >
                      {cita.estado}
                    </span>
                  </td>

                  <td>
                    {cita.observaciones || "Sin observaciones"}
                  </td>

                  {!esAdmin && (
                    <td>
                      {cita.estado !== "Cancelada" ? (
                        <div className="acciones-cita">
                          <button
                            className="btn-editar"
                            onClick={() => editarCita(cita)}
                          >
                            Editar
                          </button>

                          <button
                            className="btn-cancelar"
                            onClick={() =>
                              cancelarCita(cita.id)
                            }
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <span>Cancelada</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Citas;