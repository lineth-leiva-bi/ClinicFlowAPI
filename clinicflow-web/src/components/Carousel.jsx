import { useState } from "react";

function Carousel() {
  const slides = [
    {
      titulo: "Gestión de clientes",
      texto: "Administra clientes, datos de contacto e información importante desde una vista centralizada.",
      imagen:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    },
    {
      titulo: "Gestión de citas",
      texto: "Organiza la agenda clínica y mejora el control de la atención diaria.",
      imagen:
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    },
    {
      titulo: "Acceso seguro",
      texto: "Protege el ingreso al sistema mediante autenticación de usuarios.",
      imagen:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const [actual, setActual] = useState(0);

  const anterior = () => {
    setActual(actual === 0 ? slides.length - 1 : actual - 1);
  };

  const siguiente = () => {
    setActual(actual === slides.length - 1 ? 0 : actual + 1);
  };

  return (
    <section className="carousel-section">
      <h2>Explora el sistema</h2>

      <p className="carousel-subtitle">
        Conoce algunas de las funcionalidades principales de ClinicFlow.
      </p>

      <div className="carousel">
        <button onClick={anterior} className="carousel-btn">
          ‹
        </button>

        <div className="carousel-content">
          <img src={slides[actual].imagen} alt={slides[actual].titulo} />

          <div className="carousel-text">
            <h3>{slides[actual].titulo}</h3>
            <p>{slides[actual].texto}</p>
          </div>
        </div>

        <button onClick={siguiente} className="carousel-btn">
          ›
        </button>
      </div>

      <div className="carousel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActual(index)}
            className={actual === index ? "dot active" : "dot"}
          />
        ))}
      </div>
    </section>
  );
}

export default Carousel;