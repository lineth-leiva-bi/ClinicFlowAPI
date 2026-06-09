import { Users, CalendarDays, LayoutDashboard } from "lucide-react";
import { FaReact, FaDatabase, FaLock } from "react-icons/fa";
import { SiDotnet } from "react-icons/si";
import Carousel from "../components/Carousel";

function Home({ onLogin }) {
  return (
    <div className="home">
      <nav className="navbar">
        <div className="logo-container">
        <img src="/logo1.png" alt="ClinicFlow" />
        <span>ClinicFlow</span>
        </div>

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
  <h2>Todo lo que tu clínica necesita en una sola plataforma</h2>

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

<Carousel />

<section className="tech-section">
  <h2>Tecnologías utilizadas</h2>

    <p className="tech-description">
  Desarrollado con tecnologías modernas para construir una aplicación web
  segura, conectada y fácil de mantener.
</p>

  <div className="tech-grid">
    <div className="tech-card">
      <FaReact className="tech-icon" />
      <span>React</span>
    </div>

    <div className="tech-card">
      <SiDotnet className="tech-icon" />
      <span>ASP.NET Core</span>
    </div>

    <div className="tech-card">
      <FaDatabase className="tech-icon" />
      <span>SQL Server</span>
    </div>

    <div className="tech-card">
      <FaDatabase className="tech-icon" />
      <span>Entity Framework</span>
    </div>

    <div className="tech-card">
      <FaLock className="tech-icon" />
      <span>Autenticación</span>
    </div>
  </div>
</section>

<footer className="footer">
  <div>
    <h2>ClinicFlow</h2>
    <p>Sistema de gestión clínica desarrollado como proyecto de portafolio.</p>
  </div>

  <div>
    <h3>Desarrollado por</h3>
    <p>Lineth Leiva</p>
    <p>Ingeniería en Sistemas de Información</p>
  </div>

  <div>
  <h3>Contacto</h3>

  <a href="mailto:linethleivacr@gmail.com">
    📧 linethleivacr@gmail.com
  </a>

  <a
    href="https://github.com/lineth-leiva-bi"
    target="_blank"
    rel="noopener noreferrer"
  >
    💻 GitHub: lineth-leiva-bi
  </a>

  <a
    href="https://www.linkedin.com/in/lineth-leiva-vargas/"
    target="_blank"
    rel="noopener noreferrer"
  >
    🔗 Perfil de LinkedIn
  </a>
</div>
</footer>

</div>
  );
}

export default Home;