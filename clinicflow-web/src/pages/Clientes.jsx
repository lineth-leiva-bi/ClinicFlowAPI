import { useEffect, useState } from "react";
import API_URL from "../services/api";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [clienteEditandoId, setClienteEditandoId] = useState(null);

  const cargarClientes = async () => {
    const respuesta = await fetch(`${API_URL}/Clientes`);
    const data = await respuesta.json();
    setClientes(data);
  };

  const seleccionarCliente = (cliente) => {
    setClienteEditandoId(cliente.id);
    setNombre(cliente.nombre);
    setPrimerApellido(cliente.primerApellido);
    setSegundoApellido(cliente.segundoApellido);
    setEmail(cliente.email);
    setTelefono(cliente.telefono);
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

    alert(
      clienteEditandoId
        ? "Cliente actualizado correctamente"
        : "Cliente registrado correctamente"
    );

    setClienteEditandoId(null);
    setNombre("");
    setPrimerApellido("");
    setSegundoApellido("");
    setEmail("");
    setTelefono("");

    cargarClientes();
  };

  useEffect(() => {
    const obtenerClientes = async () => {
      await cargarClientes();
    };

    obtenerClientes();
  }, []);

  return (
    <div>
      <h2>Clientes</h2>

      <form onSubmit={guardarCliente}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="text"
          placeholder="Primer apellido"
          value={primerApellido}
          onChange={(e) => setPrimerApellido(e.target.value)}
        />

        <input
          type="text"
          placeholder="Segundo apellido"
          value={segundoApellido}
          onChange={(e) => setSegundoApellido(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <button type="submit">
          {clienteEditandoId ? "Actualizar cliente" : "Guardar cliente"}
        </button>
      </form>

      {clientes.length === 0 ? (
        <p>No hay clientes registrados.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Primer Apellido</th>
              <th>Segundo Apellido</th>
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.primerApellido}</td>
                <td>{cliente.segundoApellido}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>
                  <button onClick={() => seleccionarCliente(cliente)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Clientes;