import { useState } from "react";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

function App() {
  const [pantalla, setPantalla] = useState("home");

  if (pantalla === "home") {
    return <Home onLogin={() => setPantalla("login")} />;
  }

  if (pantalla === "dashboard") {
    return <Dashboard onLogout={() => setPantalla("login")} />;
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
      onLogin={() => setPantalla("dashboard")}
      onRegistro={() => setPantalla("registro")}
      onHome={() => setPantalla("home")}
    />
  );
}

export default App;