import { useState } from "react";

import Clientes from "./Clientes";
import Citas from "./Citas";

function Dashboard({ rol, onLogout }) {
  const [seccion, setSeccion] = useState("inicio");

  const esAdmin = rol === "Admin";
  const esCliente = rol === "Cliente";

  return (
    <div className="dashboard">
      <nav className="dashboard-navbar">
        <div className="logo-container">
          <img src="/logo1.png" alt="ClinicFlow" />
          <span>ClinicFlow</span>
        </div>

        <div className="dashboard-menu">
          <button onClick={() => setSeccion("inicio")}>Inicio</button>

          {esAdmin && (
            <>
              <button onClick={() => setSeccion("clientes")}>Clientes</button>
              <button onClick={() => setSeccion("citas")}>Citas</button>
            </>
          )}

          {esCliente && (
            <>
              <button onClick={() => setSeccion("citas")}>Mis citas</button>
            </>
          )}

          <button className="logout-btn" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        {seccion === "inicio" && (
          <section className="dashboard-welcome">
            <h1>Bienvenido a ClinicFlow</h1>

            {esAdmin && (
              <>
                <p>
                  Administra clientes, citas y procesos clínicos desde una
                  plataforma simple, segura y organizada.
                </p>

                <div className="dashboard-cards">
                  <div className="dashboard-card">
                    <h3>Clientes</h3>
                    <p>
                      Consulta y administra la información de tus clientes.
                    </p>
                    <button onClick={() => setSeccion("clientes")}>
                      Ver clientes
                    </button>
                  </div>

                  <div className="dashboard-card">
                    <h3>Citas</h3>
                    <p>
                      Organiza las citas de la clínica de forma rápida.
                    </p>
                    <button onClick={() => setSeccion("citas")}>
                      Ver citas
                    </button>
                  </div>
                </div>
              </>
            )}

            {esCliente && (
              <>
                <p>
                  Consulta tus citas y administra tus próximas visitas desde un
                  solo lugar.
                </p>

                <div className="dashboard-cards">
                  <div className="dashboard-card">
                    <h3>Mis citas</h3>
                    <p>
                      Revisa las citas que tienes agendadas y su estado.
                    </p>
                    <button onClick={() => setSeccion("citas")}>
                      Ver mis citas
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        )}

        {esAdmin && seccion === "clientes" && (
          <section className="dashboard-module">
            <Clientes />
          </section>
        )}

        {seccion === "citas" && (
          <section className="dashboard-module">
            <Citas rol={rol} />
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;