//const API_URL = "/api";
const API_URL = "http://localhost:3000/";


export interface CronTaskFernandoorellana {
    name: string;
    status: number;
    frequency: number;
    laststart: string | null;
    lastend: string | null;
    duracion_segundos: number | null;
}

export interface CronTaskResponse {
    mensaje: string;
    baseDeDatos?: string;
    tareas: CronTaskFernandoorellana[];
}

// 3. Tipamos la función indicando que retorna un Promise<CronTaskResponse>
export async function GetCrontaskFernandoorellana(): Promise<CronTaskResponse> {
    const response = await fetch(`${API_URL}/crontask/fernandoorellana`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const data: CronTaskResponse = await response.json();
    
    if (!response.ok) {
        throw new Error(data.mensaje || "Error al obtener las tareas del crontask");
    }
    
    return data;
}