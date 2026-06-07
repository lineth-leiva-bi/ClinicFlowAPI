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
    </div>
  );
}

export default Home;