import { useState } from "react";
import "../styles/SystemCard.css";
import SystemButton from "./boton";
import {
  actualizarStatusCronTask,
  type CronTaskFernandoorellana,
} from "../services/cron_task_fernandoorellana";

interface SystemCardProps {
  sistemaId: number;
  baseDeDatos: string;
  tasks: CronTaskFernandoorellana[];
  onTaskUpdated: () => void;
}

function SystemCard({
  sistemaId,
  baseDeDatos,
  tasks,
  onTaskUpdated,
}: SystemCardProps) {
  const [cargando, setCargando] = useState<number | null>(null);

  const formatValue = (val: string | number | null) => {
    return val ?? "N/A";
  };

  const handleToggle = async (task: CronTaskFernandoorellana) => {
    const nuevoStatus = task.status === 1 ? 0 : 1;
    setCargando(task.id);
    try {
      await actualizarStatusCronTask(sistemaId, task.id, nuevoStatus);
      onTaskUpdated();
    } catch (error) {
      console.error("Error al actualizar status:", error);
      alert("No se pudo actualizar el status");
    } finally {
      setCargando(null);
    }
  };

  return (
    <div className="system-card">
      <div className="database-info">
        <span>Base de datos</span>
        <strong>{baseDeDatos}</strong>
      </div>

      <div className="modules-container">
        {tasks.map((task) => {
          const isActivo = task.status === 1;
          const isCaido = task.status === 2;
          const statusText = isCaido ? "caido" : isActivo ? "activo" : "inactivo";

          return (
            <div className="module" key={task.id}>
              <div className="module-header">
                <h3>{task.name}</h3>
                <span className={`system-status ${statusText}`}>
                  <span className="status-dot"></span>
                  {statusText}
                </span>
              </div>

              <div className="system-details">
                <p>
                  <strong>Frecuencia:</strong> {task.frequency} segundos
                </p>
                <p>
                  <strong>Último Inicio:</strong> {formatValue(task.laststart)}
                </p>
                <p>
                  <strong>Último Fin:</strong> {formatValue(task.lastend)}
                </p>
                <p>
                  <strong>Duración:</strong>{" "}
                  {task.duracion_segundos !== null
                    ? `${task.duracion_segundos} seg`
                    : "N/A"}
                </p>
              </div>

              <div className="module-buttons">
                <SystemButton
                  type="activado"
                  activo={isActivo}
                  onClick={() => handleToggle(task)}
                  disabled={cargando === task.id}
                />
                <SystemButton type="reset" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SystemCard;