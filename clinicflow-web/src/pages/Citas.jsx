import { useEffect, useState } from "react";
import API_URL from "../services/api";

function Citas() {
  const [citas, setCitas] = useState([]);

  const cargarCitas = async () => {
    const token = localStorage.getItem("token");

    const respuesta = await fetch(`${API_URL}/Cita/mis-citas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await respuesta.json();
    setCitas(data);
  };

  useEffect(() => {
    const obtenerCitas = async () => {
      await cargarCitas();
    };

    obtenerCitas();
  }, []);

  return (
    <div>
      <h2>Mis citas</h2>

      {citas.length === 0 ? (
        <p>No tienes citas registradas.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha y hora</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Observaciones</th>
            </tr>
          </thead>

          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id}>
                <td>{cita.id}</td>
                <td>{cita.fechaHora}</td>
                <td>{cita.motivo}</td>
                <td>{cita.estado}</td>
                <td>{cita.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Citas;