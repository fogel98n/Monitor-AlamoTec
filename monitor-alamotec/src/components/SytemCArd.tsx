import "../styles/SystemCard.css";
import SystemButton from "./boton";
import type { CronTaskFernandoorellana } from "../services/cron_task_fernandoorellana";

interface SystemCardProps {
  task: CronTaskFernandoorellana;
}

function SystemCard({ task }: SystemCardProps) {
  const isActivo = task.status === 1;
  const statusText = isActivo ? "activo" : "inactivo";

  const formatValue = (val: string | number | null) => {
    return val ?? "N/A";
  };

  return (
    <div className="system-card">
      <div className="system-info">
        <h3>{task.name}</h3>

        <div className="system-details">
          <p>
            <strong>Frecuencia:</strong>{" "}
            {task.frequency} segundos
          </p>

          <p>
            <strong>Último Inicio:</strong>{" "}
            {formatValue(task.laststart)}
          </p>

          <p>
            <strong>Último Fin:</strong>{" "}
            {formatValue(task.lastend)}
          </p>

          <p>
            <strong>Duración:</strong>{" "}
            {task.duracion_segundos !== null
              ? `${task.duracion_segundos} seg`
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="system-right">
        <span className={`system-status ${statusText}`}>
          <span className="status-dot"></span>
          {statusText}
        </span>

        <SystemButton type="activado" />

        <SystemButton type="reset" />
      </div>
    </div>
  );
}

export default SystemCard;