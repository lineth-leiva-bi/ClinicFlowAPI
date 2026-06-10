import { useEffect, useState } from "react";
import API_URL from "../services/api";
import Swal from "sweetalert2";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [clienteEditandoId, setClienteEditandoId] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 5;
  const [modalAbierto, setModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const cargarClientes = async () => {
    const respuesta = await fetch(`${API_URL}/Clientes`);
    const data = await respuesta.json();
    setClientes(data);
  };

  const limpiarFormulario = () => {
  setClienteEditandoId(null);
  setNombre("");
  setPrimerApellido("");
  setSegundoApellido("");
  setEmail("");
  setTelefono("");
  setModalAbierto(false);
};

  const seleccionarCliente = (cliente) => {
  setClienteEditandoId(cliente.id);
  setNombre(cliente.nombre);
  setPrimerApellido(cliente.primerApellido);
  setSegundoApellido(cliente.segundoApellido);
  setEmail(cliente.email);
  setTelefono(cliente.telefono);
  setModalAbierto(true);
};

  const guardarCliente = async (e) => {
    e.preventDefault();

    const url = clienteEditandoId
      ? `${API_URL}/Clientes/${clienteEditandoId}`
      : `${API_URL}/Clientes`;

    const metodo = clienteEditandoId ? "PUT" : "POST";

    const respuesta = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: clienteEditandoId ?? 0,
        nombre,
        primerApellido,
        segundoApellido,
        email,
        telefono,
      }),
    });

    const data = await respuesta.text();

    if (!respuesta.ok) {
      alert(data);
      return;
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
    cargarClientes();
  };

  const confirmar = await Swal.fire({
  icon: "warning",
  title: "¿Deseas eliminar este cliente?",
  text: "Esta acción no se puede deshacer.",
  showCancelButton: true,
  confirmButtonText: "Sí, eliminar",
  cancelButtonText: "Cancelar",
  confirmButtonColor: "#dc2626",
  cancelButtonColor: "#6b7280",
});

if (!confirmar.isConfirmed) return;

    const respuesta = await fetch(`${API_URL}/Clientes/${id}`, {
      method: "DELETE",
    });

    if (!respuesta.ok) {
      const data = await respuesta.text();
      Swal.fire({
  icon: "error",
  title: "Error",
  text: data,
  confirmButtonColor: "#2563eb",
});
      return;
    }

    await Swal.fire({
  icon: "success",
  title: "Cliente eliminado",
  text: "El cliente fue eliminado correctamente.",
  confirmButtonColor: "#2563eb",
});
    cargarClientes();
  };

useEffect(() => {
  const obtenerClientes = async () => {
    await cargarClientes();
  };

  obtenerClientes();
}, []);

const clientesFiltrados = clientes.filter((cliente) => {
  const nombreCompleto = `${cliente.nombre} ${cliente.primerApellido} ${cliente.segundoApellido}`.toLowerCase();

  return (
    nombreCompleto.includes(busqueda.toLowerCase()) ||
    cliente.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.telefono.includes(busqueda)
  );
});

const indiceUltimoCliente = paginaActual * clientesPorPagina;
const indicePrimerCliente = indiceUltimoCliente - clientesPorPagina;

const clientesPaginados = clientesFiltrados.slice(
  indicePrimerCliente,
  indiceUltimoCliente
);

const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);

  return (
    <div className="clientes-page">
      <div className="clientes-header">
  <div>
    <h2>Gestión de clientes</h2>
    <p>Registra, consulta, actualiza y elimina información de clientes.</p>
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

      {modalAbierto && (
  <div className="modal-overlay">
    <div className="modal-card">
      <div className="modal-header">
        <h3>{clienteEditandoId ? "Editar cliente" : "Registrar cliente"}</h3>

        <button className="modal-close" onClick={limpiarFormulario}>
          ×
        </button>
      </div>

      <form onSubmit={guardarCliente} className="clientes-form modal-form">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Primer apellido"
          value={primerApellido}
          onChange={(e) => setPrimerApellido(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Segundo apellido"
          value={segundoApellido}
          onChange={(e) => setSegundoApellido(e.target.value)}
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={limpiarFormulario}>
            Cancelar
          </button>

          <button type="submit" className="btn-primary">
            {clienteEditandoId ? "Actualizar cliente" : "Guardar cliente"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      <section className="clientes-table-card">
        <h3>Clientes registrados</h3>

        {clientesFiltrados.length === 0 ? (
          <p className="empty-message">No hay clientes registrados.</p>
        ) : (
          <div className="table-container">
            <table className="clientes-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre completo</th>
                  <th>Correo electrónico</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {clientesPaginados.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td>
  {cliente.nombre} {cliente.primerApellido} {cliente.segundoApellido}
                    </td>
                    <td>{cliente.email}</td>
                    <td>{cliente.telefono}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-edit"
                          onClick={() => seleccionarCliente(cliente)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn-delete"
                          onClick={() => eliminarCliente(cliente.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
  <button
    onClick={() => setPaginaActual(paginaActual - 1)}
    disabled={paginaActual === 1}
  >
    Anterior
  </button>

  <span>
    Página {paginaActual} de {totalPaginas}
  </span>

  <button
    onClick={() => setPaginaActual(paginaActual + 1)}
    disabled={paginaActual === totalPaginas}
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