import { useState } from "react";
import "../styles/SystemCard.css";
import {
  actualizarStatusCronTask,
  resetTimestampCronTask,
  actualizarSistema,
  eliminarSistema,
  type CronTaskFernandoorellana,
  type Sistema,
} from "../services/cron_task_fernandoorellana";

interface SistemaConTareas extends Sistema {
  tareas: CronTaskFernandoorellana[];
  error?: string;
}

interface SystemCardProps {
  sistemas: SistemaConTareas[];
  onTaskUpdated: () => void;
  onEditar: (sistema: Sistema) => void;
}

const ORDEN_MODULOS = ["Workflow", "ScheduleReports"];

function ordenarModulos(nombres: string[]): string[] {
  return [...nombres].sort((a, b) => {
    const ia = ORDEN_MODULOS.indexOf(a);
    const ib = ORDEN_MODULOS.indexOf(b);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

function formatRelativo(fecha: string | null): string {
  if (!fecha) return "N/A";
  const diffMs = Date.now() - new Date(fecha).getTime();
  if (diffMs < 0) return "N/A";
  const min = Math.floor(diffMs / 60000);
  const horas = Math.floor(min / 60);
  const dias = Math.floor(horas / 24);
  const meses = Math.floor(dias / 30);
  if (meses >= 1) return `hace ${meses} mes${meses > 1 ? "es" : ""}`;
  if (dias >= 1) return `hace ${dias} d`;
  if (horas >= 1) return `hace ${horas} h`;
  if (min >= 1) return `hace ${min} min`;
  return "hace instantes";
}

function IconPause() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}
function IconPlay() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 4v16l14-8L7 4z" />
    </svg>
  );
}
function IconRefresh() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4v6h6" />
      <path d="M20 20v-6h-6" />
      <path d="M20 10a8 8 0 00-14.9-3.5M4 14a8 8 0 0014.9 3.5" />
    </svg>
  );
}
function IconEjecutar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}
function IconEditar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
function IconBorrar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2" />
      <path d="M19 6l-1 14a1 1 0 01-1 1H7a1 1 0 01-1-1L5 6" />
    </svg>
  );
}
function IconArriba() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 5l7 8h-5v6h-4v-6H5z" />
    </svg>
  );
}
function IconAbajo() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 19l-7-8h5V5h4v6h5z" />
    </svg>
  );
}

function SystemCard({ sistemas, onTaskUpdated, onEditar }: SystemCardProps) {
  const [cargando, setCargando] = useState<string | null>(null);

  const nombresModulos = ordenarModulos(
    Array.from(new Set(sistemas.flatMap((s) => s.tareas.map((t) => t.name))))
  );

  const totalAtrasadas = sistemas.reduce(
    (acc, s) => acc + s.tareas.filter((t) => t.status === 2).length,
    0
  );

  const handleToggle = async (sistemaId: number, task: CronTaskFernandoorellana) => {
    const key = `toggle-${task.id}`;
    const nuevoStatus = task.status === 1 ? 0 : 1;
    setCargando(key);
    try {
      await actualizarStatusCronTask(sistemaId, task.id, nuevoStatus);
      onTaskUpdated();
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el status");
    } finally {
      setCargando(null);
    }
  };

  const handleReset = async (sistemaId: number, task: CronTaskFernandoorellana) => {
    const key = `reset-${task.id}`;
    setCargando(key);
    try {
      await resetTimestampCronTask(sistemaId, task.id);
      onTaskUpdated();
    } catch (error) {
      console.error(error);
      alert("No se pudo reiniciar el timestamp");
    } finally {
      setCargando(null);
    }
  };

  const handleBorrar = async (sistema: SistemaConTareas) => {
    if (!confirm(`¿Eliminar el sistema "${sistema.nombre}"? Esta accion no se puede deshacer.`)) return;
    setCargando(`del-${sistema.id}`);
    try {
      await eliminarSistema(sistema.id);
      onTaskUpdated();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el sistema");
    } finally {
      setCargando(null);
    }
  };

  const handleMover = async (index: number, direccion: -1 | 1) => {
    const otroIndex = index + direccion;
    if (otroIndex < 0 || otroIndex >= sistemas.length) return;

    const actual = sistemas[index];
    const otro = sistemas[otroIndex];
    setCargando(`orden-${actual.id}`);
    try {
      await Promise.all([
        actualizarSistema(actual.id, { orden: otro.orden }),
        actualizarSistema(otro.id, { orden: actual.orden }),
      ]);
      onTaskUpdated();
    } catch (error) {
      console.error(error);
      alert("No se pudo cambiar el orden");
    } finally {
      setCargando(null);
    }
  };

  return (
    <div className="system-card">
      <div className="table-topbar">
        <div className="topbar-badges">
          <span className="badge badge-info">{sistemas.length} sistemas</span>
          {totalAtrasadas > 0 && (
            <span className="badge badge-warning">
              {totalAtrasadas} atrasada{totalAtrasadas > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <span className="topbar-updated">
          Actualizado {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      <div className="table-scroll">
        <table className="modules-table">
          <thead>
            <tr>
              <th className="col-basedatos" rowSpan={2}>Base de datos</th>
              {nombresModulos.map((nombre) => (
                <th key={nombre} colSpan={2} className="col-modulo-header">
                  {nombre}
                </th>
              ))}
            </tr>
            <tr>
              {nombresModulos.map((nombre) => (
                <>
                  <th key={`${nombre}-e`} className="col-sub">Estado</th>
                  <th key={`${nombre}-u`} className="col-sub">Última · dur.</th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {sistemas.map((sistema, index) => (
              <tr key={sistema.id}>
                <td className="col-basedatos">
                  <div className="fila-basedatos">
                    <div className="orden-botones">
                      <button
                        className="icon-btn icon-btn-orden"
                        onClick={() => handleMover(index, -1)}
                        disabled={index === 0 || cargando === `orden-${sistema.id}`}
                        title="Mover arriba"
                      >
                        <IconArriba />
                      </button>
                      <button
                        className="icon-btn icon-btn-orden"
                        onClick={() => handleMover(index, 1)}
                        disabled={index === sistemas.length - 1 || cargando === `orden-${sistema.id}`}
                        title="Mover abajo"
                      >
                        <IconAbajo />
                      </button>
                    </div>

                    <strong>{sistema.nombre}</strong>

                    <div className="acciones-basedatos">
                      <button
                        className="icon-btn icon-btn-editar"
                        title="Editar sistema"
                        onClick={() => onEditar(sistema)}
                      >
                        <IconEditar />
                      </button>
                      <button
                        className="icon-btn icon-btn-borrar"
                        title="Eliminar sistema"
                        disabled={cargando === `del-${sistema.id}`}
                        onClick={() => handleBorrar(sistema)}
                      >
                        <IconBorrar />
                      </button>
                    </div>
                  </div>
                </td>

                {sistema.error ? (
                  <td colSpan={nombresModulos.length * 2} className="col-sub error-sistema">
                    {sistema.error}
                  </td>
                ) : (
                  nombresModulos.map((nombreModulo) => {
                    const task = sistema.tareas.find((t) => t.name === nombreModulo);
                    if (!task) {
                      return (
                        <td colSpan={2} className="col-sub sin-datos" key={nombreModulo}>
                          N/A
                        </td>
                      );
                    }

                    const isActivo = task.status === 1;
                    const isCaido = task.status === 2;
                    const statusText = isCaido ? "detenido" : isActivo ? "activo" : "inactivo";

                    return (
                      <>
                        <td className="col-sub" key={`${task.id}-estado`}>
                          <span className={`pill pill-${statusText}`}>{statusText}</span>
                        </td>
                        <td className="col-sub" key={`${task.id}-dur`}>
                          <div className="ultima-dur">
                            <span className="ultima-texto">
                              {formatRelativo(task.laststart)}
                              {task.duracion_segundos !== null && (
                                <> · <span className="dur-valor">{task.duracion_segundos} s</span></>
                              )}
                            </span>

                            <div className="acciones-icono">
                              <button
                                className={`icon-btn ${isActivo ? "icon-btn-pause" : "icon-btn-play"}`}
                                title={isActivo ? "Desactivar" : "Activar"}
                                disabled={cargando === `toggle-${task.id}`}
                                onClick={() => handleToggle(sistema.id, task)}
                              >
                                {isActivo ? <IconPause /> : <IconPlay />}
                              </button>

                              <button
                                className="icon-btn icon-btn-refresh"
                                title="Reiniciar timestamp"
                                disabled={cargando === `reset-${task.id}`}
                                onClick={() => handleReset(sistema.id, task)}
                              >
                                <IconRefresh />
                              </button>

                              <button className="icon-btn icon-btn-ejecutar" title="Ejecutar ahora">
                                <IconEjecutar />
                              </button>
                            </div>
                          </div>
                        </td>
                      </>
                    );
                  })
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SystemCard;