import { useEffect, useState } from "react";
import API_URL from "../services/api";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");

  const cargarClientes = async () => {
    const respuesta = await fetch(`${API_URL}/Clientes`);
    const data = await respuesta.json();

    setClientes(data);
  };

  const guardarCliente = async (e) => {
  e.preventDefault();

  const respuesta = await fetch(`${API_URL}/Clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre,
      telefono,
      correo,
    }),
  });

  const data = await respuesta.text();

  if (!respuesta.ok) {
    alert(data);
    return;
  }

  alert("Cliente registrado correctamente");

  setNombre("");
  setTelefono("");
  setCorreo("");

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
    placeholder="Teléfono"
    value={telefono}
    onChange={(e) => setTelefono(e.target.value)}
  />

  <input
    type="email"
    placeholder="Correo"
    value={correo}
    onChange={(e) => setCorreo(e.target.value)}
  />

  <button type="submit">Guardar cliente</button>
</form>

      {clientes.length === 0 ? (
        <p>No hay clientes registrados.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.correo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Clientes;