import { useState } from "react";
import Clientes from "./Clientes";
import Citas from "./Citas";

function Dashboard({ onLogout }) {
  const [seccion, setSeccion] = useState("inicio");

  return (
    <div>
      <h1>ClinicFlow</h1>

      <hr />

      <button onClick={() => setSeccion("clientes")}>Clientes</button>
      <button onClick={() => setSeccion("citas")}>Citas</button>
      <button onClick={onLogout}>Cerrar Sesión</button>

      <div>
        {seccion === "inicio" && <h2>Bienvenido al sistema</h2>}
        {seccion === "clientes" && <Clientes />}
        {seccion === "citas" && <Citas />}
      </div>
    </div>
  );
}

export default Dashboard;