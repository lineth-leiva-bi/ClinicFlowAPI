import { useState } from "react";
import API_URL from "../services/api";
import Swal from "sweetalert2";

function Login({ onLogin, onRegistro, onHome }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch(`${API_URL}/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: correo,
          contrasenna: contrasena,
        }),
      });

      const contentType = respuesta.headers.get("content-type");

      const data = contentType?.includes("application/json")
        ? await respuesta.json()
        : await respuesta.text();

      if (!respuesta.ok) {
        await Swal.fire({
          icon: "error",
          title: "No se pudo iniciar sesión",
          text:
            typeof data === "string"
              ? data
              : data?.mensaje || "Verifica tu correo y contraseña.",
        });

        return;
      }

      if (!data?.token) {
        throw new Error("La respuesta del servidor no contiene un token.");
      }

      localStorage.setItem("token", data.token);

      await Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: "Inicio de sesión realizado correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

      onLogin();
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      await Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No fue posible conectar con ClinicFlow.",
      });
    }
  };

  return (
    <div className="login">
      <nav className="navbar">
        <div className="logo-container">
          <img src="/logo1.png" alt="ClinicFlow" />
          <span>ClinicFlow</span>
        </div>

        <button onClick={onHome}>Inicio</button>
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

          <p className="auth-subtitle">
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={iniciarSesion}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />

            <button type="submit">Ingresar</button>

            <p className="register-link">
              ¿No tienes cuenta?{" "}
              <span onClick={onRegistro}>Regístrate aquí</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;