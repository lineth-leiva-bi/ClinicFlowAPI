import { Users, CalendarDays, LayoutDashboard } from "lucide-react";

function Home({ onLogin }) {
  return (
    <div className="home">
      <nav className="navbar">
        <h2>ClinicFlow</h2>

        <button onClick={onLogin}>
          Iniciar sesión
        </button>
      </nav>

      <section className="hero">
        <div>
          <h1>Gestión clínica simple, rápida y organizada</h1>

          <p>
            ClinicFlow centraliza la gestión de clientes, citas y procesos administrativos
            en una sola plataforma, pensada para facilitar el trabajo diario de clínicas
            pequeñas y medianas.
          </p>

          <button onClick={onLogin}>
            Entrar al sistema
          </button>
        </div>

        <div className="hero-card">
          <h3>Funciones principales</h3>
          <p>✔ Registro de clientes</p>
          <p>✔ Gestión de citas</p>
          <p>✔ Acceso seguro</p>
          <p>✔ Panel administrativo</p>
        </div>
      </section>

      <section className="info-section">
  <h2>Organiza la atención de tus pacientes desde un solo lugar</h2>

  <div className="info-grid">
    <div className="info-card">
  <Users className="info-icon" />
  <h3>Clientes</h3>
  <p>
    Registra, consulta, actualiza y elimina información de clientes de forma
    rápida y organizada.
  </p>
</div>

<div className="info-card">
  <CalendarDays className="info-icon" />
  <h3>Citas</h3>
  <p>
    Administra las citas de la clínica y mejora la organización diaria del
    personal.
  </p>
</div>

<div className="info-card">
  <LayoutDashboard className="info-icon" />
  <h3>Panel administrativo</h3>
  <p>
    Accede a una vista centralizada para gestionar los módulos principales del
    sistema.
  </p>
</div>
  </div>
</section>

<p className="subtitle">
Conoce las principales herramientas que facilitan la gestión diaria de la clínica.
</p>

</div>
  );
}

export default Home;