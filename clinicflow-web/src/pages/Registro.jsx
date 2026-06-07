import { useState } from "react";
import API_URL from "../services/api";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const registrarUsuario = async (e) => {
    e.preventDefault();

    const respuesta = await fetch(`${API_URL}/Auth/Registrarme`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        correo,
        contrasena,
      }),
    });

    const data = await respuesta.text();
    console.log(data);

    if (!respuesta.ok) {
      alert(data);
      return;
    }

    alert("Usuario registrado correctamente");
  };

  return (
    <div>
      <h2>Registrarme</h2>

      <form onSubmit={registrarUsuario}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        <button type="submit">Registrarme</button>
      </form>
    </div>
  );
}

export default Registro;