export interface CronTaskFernandoorellana {
  id: number;
  name: string;
  status: number;
  frequency: number;
  laststart: string | null;
  lastend: string | null;
  duracion_segundos: number | null;
}

export interface Sistema {
  id: number;
  nombre: string;
  base_datos: string;
}

const API_URL = "/api";

export async function getSistemas(): Promise<Sistema[]> {
  const response = await fetch(`${API_URL}/sistemas`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.mensaje || "Error al obtener sistemas");
  return data.sistemas;
}

export async function getCronTasksBySistema(sistemaId: number) {
  const response = await fetch(`${API_URL}/sistemas/${sistemaId}/crontask`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.mensaje || "Error al obtener las tareas");
  return data as { sistema: string; baseDeDatos: string; tareas: CronTaskFernandoorellana[] };
}

export async function actualizarStatusCronTask(
  sistemaId: number,
  taskId: number,
  status: 0 | 1
) {
  const response = await fetch(`${API_URL}/sistemas/${sistemaId}/crontask/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.mensaje || "Error al actualizar el status");
  return data;
}

export async function crearSistema(sistema: {
  nombre: string;
  host: string;
  usuario: string;
  password: string;
  base_datos: string;
  puerto?: number;
}) {
  const response = await fetch(`${API_URL}/sistemas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sistema),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.mensaje || "Error al crear el sistema");
  return data;
}