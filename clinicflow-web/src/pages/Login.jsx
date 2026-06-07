import { useState } from "react";
import API_URL from "../services/api";

function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const iniciarSesion = async (e) => {
    e.preventDefault();

    const respuesta = await fetch(`${API_URL}/Auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo,
        contrasena,
      }),
    });

    const data = await respuesta.json();
    console.log(data);
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>

      <form onSubmit={iniciarSesion}>
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

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default Login;