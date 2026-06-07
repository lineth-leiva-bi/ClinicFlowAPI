import { useState } from "react";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";

function App() {

  const [pantalla, setPantalla] = useState("login");

  if (pantalla === "dashboard") {
    return <Dashboard onLogout={() => setPantalla("login")} />;
  }

  if (pantalla === "registro") {
    return (
      <>
        <Registro />
        <button onClick={() => setPantalla("login")}>
          Ya tengo cuenta
        </button>
      </>
    );
  }

  return (
    <>
      <Login onLogin={() => setPantalla("dashboard")} />
      <button onClick={() => setPantalla("registro")}>
        Registrarme
      </button>
    </>
  );
}

export default App;