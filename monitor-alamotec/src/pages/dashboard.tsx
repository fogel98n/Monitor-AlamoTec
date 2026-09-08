import { useEffect, useState, useCallback } from "react";
import "../styles/dashboard.css";
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

export interface SistemaConTareas extends Sistema {
  tareas: CronTaskFernandoorellana[];
  error?: string;
}

function Dashboard() {
  const [sistemas, setSistemas] = useState<SistemaConTareas[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [sistemaEditando, setSistemaEditando] = useState<Sistema | null>(null);

  const cargarSistemas = useCallback(async () => {
    try {
      const listaSistemas = await getSistemas();

      // Promise.allSettled: si un sistema falla, no tumba a los demas
      const resultados = await Promise.allSettled(
        listaSistemas.map((sistema) => getCronTasksBySistema(sistema.id))
      );

      const sistemasConTareas: SistemaConTareas[] = listaSistemas.map((sistema, i) => {
        const resultado = resultados[i];
        if (resultado.status === "fulfilled") {
          return { ...sistema, tareas: resultado.value.tareas, error: resultado.value.error };
        }
        return { ...sistema, tareas: [], error: "No se pudo conectar con este sistema" };
      });

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

        {cargando && <p className="estado-vacio">Cargando sistemas...</p>}
        {!cargando && sistemas.length === 0 && (
          <p className="estado-vacio">No hay sistemas registrados.</p>
        )}
        {!cargando && sistemas.length > 0 && (
          <SystemCard
            sistemas={sistemas}
            onTaskUpdated={cargarSistemas}
            onEditar={(sistema) => setSistemaEditando(sistema)}
          />
        )}
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

      {sistemaEditando && (
        <AgregarSistemaModal
          sistemaExistente={sistemaEditando}
          onClose={() => setSistemaEditando(null)}
          onCreated={() => {
            setSistemaEditando(null);
            cargarSistemas();
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default Dashboard;