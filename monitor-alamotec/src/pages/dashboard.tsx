import { useEffect, useState, useCallback } from "react";
import "../styles/Dashboard.css";
import "../styles/SystemCard.css";
import Footer from "../components/footer";
import SystemCard from "../components/SytemCArd";
import AgregarSistemaModal from "../components/AgregarSistemaModal";
import {
  getSistemas,
  getCronTasksBySistema,
  type Sistema,
  type CronTaskFernandoorellana,
} from "../services/cron_task_fernandoorellana";

interface SistemaConTareas extends Sistema {
  tareas: CronTaskFernandoorellana[];
}

function Dashboard() {
  const [sistemas, setSistemas] = useState<SistemaConTareas[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarSistemas = useCallback(async () => {
    try {
      const listaSistemas = await getSistemas();
      const sistemasConTareas = await Promise.all(
        listaSistemas.map(async (sistema) => {
          const { tareas } = await getCronTasksBySistema(sistema.id);
          return { ...sistema, tareas };
        })
      );
      setSistemas(sistemasConTareas);
    } catch (error) {
      console.error("Error al cargar sistemas:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarSistemas();
  }, [cargarSistemas]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Panel de monitoreo</p>
        </div>

        <div className="header-actions">
          <button className="btn-agregar-sistema" onClick={() => setMostrarModal(true)}>
            + Agregar sistema
          </button>
          <div className="header-user">
            <span>Usuario</span>
            <div className="user-avatar">U</div>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="titulo">
          <h3>Sistemas</h3>
        </div>

        <div className="systems-row-wrapper">
          <div className="systems-grid">
            {cargando && <p className="estado-vacio">Cargando sistemas...</p>}
            {!cargando && sistemas.length === 0 && (
              <p className="estado-vacio">No hay sistemas registrados.</p>
            )}
            {sistemas.map((sistema) => (
              <SystemCard
                key={sistema.id}
                sistemaId={sistema.id}
                baseDeDatos={sistema.nombre}
                tasks={sistema.tareas}
                onTaskUpdated={cargarSistemas}
              />
            ))}
          </div>
        </div>
      </main>

      {mostrarModal && (
        <AgregarSistemaModal
          onClose={() => setMostrarModal(false)}
          onCreated={() => {
            setMostrarModal(false);
            cargarSistemas();
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default Dashboard;