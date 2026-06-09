import { useState } from "react";
import Clientes from "./Clientes";
import Citas from "./Citas";

function Dashboard({ onLogout }) {
  const [seccion, setSeccion] = useState("inicio");

  return (
    <div className="dashboard">
      <nav className="dashboard-navbar">
        <div className="logo-container">
          <img src="/logo1.png" alt="ClinicFlow" />
          <span>ClinicFlow</span>
        </div>

        <div className="dashboard-menu">
          <button onClick={() => setSeccion("inicio")}>Inicio</button>
          <button onClick={() => setSeccion("clientes")}>Clientes</button>
          <button onClick={() => setSeccion("citas")}>Citas</button>
          <button className="logout-btn" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        {seccion === "inicio" && (
          <section className="dashboard-welcome">
            <h1>Bienvenido a ClinicFlow</h1>
            <p>
              Administra clientes, citas y procesos clínicos desde una plataforma
              simple, segura y organizada.
            </p>

            <div className="dashboard-cards">
              <div className="dashboard-card">
                <h3>Clientes</h3>
                <p>Consulta y administra la información de tus clientes.</p>
                <button onClick={() => setSeccion("clientes")}>
                  Ver clientes
                </button>
              </div>

              <div className="dashboard-card">
                <h3>Citas</h3>
                <p>Organiza las citas de la clínica de forma rápida.</p>
                <button onClick={() => setSeccion("citas")}>
                  Ver citas
                </button>
              </div>
            </div>
          </section>
        )}

        {seccion === "clientes" && (
          <section className="dashboard-module">
            <Clientes />
          </section>
        )}

        {seccion === "citas" && (
          <section className="dashboard-module">
            <Citas />
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;