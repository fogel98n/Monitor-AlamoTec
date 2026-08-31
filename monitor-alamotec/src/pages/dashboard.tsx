import { useEffect, useState } from "react";

import "../styles/Dashboard.css";
import "../styles/SystemCard.css";

import Footer from "../components/footer";
import SystemCard from "../components/SytemCArd";

import {
  GetCrontaskFernandoorellana,
  type CronTaskFernandoorellana,
} from "../services/cron_task_fernandoorellana";

function Dashboard() {
  const [tasks, setTasks] = useState<CronTaskFernandoorellana[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarTasks = async () => {
      try {
        const data = await GetCrontaskFernandoorellana();

        // La API devuelve { mensaje, tareas }
        setTasks(data.tareas);

      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los Crontask");
      } finally {
        setLoading(false);
      }
    };

    cargarTasks();
  }, []);

  return (
    <div className="dashboard">

      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Panel de monitoreo</p>
        </div>

        <div className="header-user">
          <span>Usuario</span>

          <div className="user-avatar">
            U
          </div>
        </div>
      </header>

      <main className="dashboard-content">

        <div className="titulo">
          <h3>Sistemas</h3>
          <h3>Crontask</h3>
          <h3>ScheduleReports</h3>
        </div>

        <div className="dashboard-title">

          {loading && (
            <p>Cargando Crontask...</p>
          )}

          {error && (
            <p>{error}</p>
          )}

          {!loading && !error && (
            <div className="systems-grid">

              {tasks.map((task, index) => (
                <SystemCard
                  key={`${task.name}-${index}`}
                  task={task}
                />
              ))}

            </div>
          )}

        </div>

      </main>

      <Footer />

    </div>
  );
}

export default Dashboard;
