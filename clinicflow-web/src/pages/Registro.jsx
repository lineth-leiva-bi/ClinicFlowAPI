import { useState } from "react";
import API_URL from "../services/api";

function Registro({ onLogin, onHome }) {
  const [nombre, setNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");

  const registrarme = async (e) => {
    e.preventDefault();

    const nuevoUsuario = {
      id: 0,
      contrasena: contrasena,
      rol: "Cliente",
      clienteId: 0,
      cliente: {
        id: 0,
        nombre: nombre,
        primerApellido: primerApellido,
        segundoApellido: segundoApellido,
        email: email,
        telefono: telefono,
      },
    };

    const respuesta = await fetch(`${API_URL}/Auth/Registrarme`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoUsuario),
    });

    const data = await respuesta.text();

    if (!respuesta.ok) {
      alert(data);
      return;
    }

    alert("Registro realizado correctamente");
    onLogin();
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
          <h1>Crear cuenta</h1>
          <p>
            Regístrate en ClinicFlow para gestionar tus citas y acceder a los
            servicios clínicos desde una sola plataforma.
          </p>
        </div>

        <div className="auth-card registro">
          <h2>Registrarme</h2>
          <p className="auth-subtitle">Completa tus datos para crear tu cuenta</p>

          <form onSubmit={registrarme}>
  <div className="form-grid">

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
      required
    />

    <input
      type="text"
      placeholder="Teléfono"
      value={telefono}
      onChange={(e) => setTelefono(e.target.value)}
      required
    />

    <input
      type="email"
      placeholder="Correo electrónico"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />

    <input
      type="password"
      placeholder="Contraseña"
      value={contrasena}
      onChange={(e) => setContrasena(e.target.value)}
      required
    />

  </div>

  <button type="submit">
    Registrarme
  </button>

  <p className="register-link">
    ¿Ya tienes cuenta?{" "}
    <span onClick={onLogin}>Inicia sesión aquí</span>
  </p>
</form>
        </div>
      </div>
    </div>
  );
}

export default Registro;