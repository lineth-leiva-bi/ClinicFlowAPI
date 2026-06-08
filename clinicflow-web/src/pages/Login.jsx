import { useState } from "react";
import API_URL from "../services/api";

function Login({ onLogin , onRegistro , onhome }) {
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

const data = await respuesta.text();

if (!respuesta.ok) {
  alert(data);
  return;
}

localStorage.setItem("token", data);

alert("Inicio de sesión correcto");
onLogin();

alert("Inicio de sesión correcto");
  };

  return (

    <div className="login">
      <nav className="navbar">
        <div className="logo-container">
        <img src="/logo.png" alt="ClinicFlow" />
        <span>ClinicFlow</span>
        </div>
        
        <h2>ClinicFlow</h2>

        <button onClick={onhome}>
          Inicio
        </button>
      </nav>  

  <div className="auth-page">
    <div className="auth-info">
      <h1>ClinicFlow</h1>
      <p>
        Accede a tu sistema clínico para gestionar clientes, citas y procesos
        administrativos desde una sola plataforma.
      </p>
    </div>

    <div className="auth-card">
      <h2>Iniciar sesión</h2>
      <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>

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

        <p className="register-link">
        ¿No tienes cuenta? <span onClick={onRegistro}>Regístrate aquí</span>
        </p>

      </form>
    </div>
  </div>
  </div>
);
}

export default Login;