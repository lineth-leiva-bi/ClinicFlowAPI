import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./App.css";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

const obtenerSesionInicial = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      pantalla: "home",
      rol: null,
    };
  }

  try {
    const decoded = jwtDecode(token);

    // Verificar si el token tiene fecha de expiración
    if (!decoded.exp) {
      localStorage.removeItem("token");

      return {
        pantalla: "home",
        rol: null,
      };
    }

    // Verificar si ya expiró
    const fechaExpiracion = decoded.exp * 1000;

    if (fechaExpiracion < Date.now()) {
      localStorage.removeItem("token");

      return {
        pantalla: "home",
        rol: null,
      };
    }

    // Obtener rol
    const rolUsuario =
      decoded.role ||
      decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];

    if (!rolUsuario) {
      localStorage.removeItem("token");

      return {
        pantalla: "home",
        rol: null,
      };
    }

    // Token válido
    return {
      pantalla: "dashboard",
      rol: rolUsuario,
    };
  } catch (error) {
    console.error("No se pudo recuperar la sesión:", error);
    localStorage.removeItem("token");

    return {
      pantalla: "home",
      rol: null,
    };
  }
};

function App() {
  const [sesionInicial] = useState(obtenerSesionInicial);

  const [pantalla, setPantalla] = useState(sesionInicial.pantalla);
  const [rol, setRol] = useState(sesionInicial.rol);

  const obtenerRolToken = (token) => {
    try {
      const decoded = jwtDecode(token);

      return (
        decoded.role ||
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ]
      );
    } catch (error) {
      console.error("No se pudo leer el token:", error);
      return null;
    }
  };

  const manejarLogin = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const rolUsuario = obtenerRolToken(token);

    if (rolUsuario) {
      setRol(rolUsuario);
      setPantalla("dashboard");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setRol(null);
    setPantalla("login");
  };

  if (pantalla === "home") {
    return <Home onLogin={() => setPantalla("login")} />;
  }

  if (pantalla === "dashboard") {
    return <Dashboard rol={rol} onLogout={cerrarSesion} />;
  }

  if (pantalla === "registro") {
    return (
      <Registro
        onLogin={() => setPantalla("login")}
        onHome={() => setPantalla("home")}
      />
    );
  }

  return (
    <Login
      onLogin={manejarLogin}
      onRegistro={() => setPantalla("registro")}
      onHome={() => setPantalla("home")}
    />
  );
}

export default App;