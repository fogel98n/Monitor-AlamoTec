import "../styles/SystemCard.css"
import SystemButton from "./boton";
interface system{
    id:number
    name:string;
    description:string;
    status:"activo"|"inactivo";
}

export const systems:system[]=[
     {
    id: 1,
    name: "Vtiger",
    description: "Sistema de gestión CRM",
    status: "activo",
  },
  {
    id: 2,
    name: "Sistema de Ventas",
    description: "Gestión y seguimiento de ventas",
    status: "activo",
  },
  {
    id: 3,
    name: "Recursos Humanos",
    description: "Gestión de empleados",
    status: "activo",
  },
  {
    id: 4,
    name: "Sistema de Inventario",
    description: "Control de productos e inventario",
    status: "inactivo",
  },
]

interface systemcardprops{
    system:system
}

function Systemcard({system
}:systemcardprops){
    const statusClass={
        activo:"activo",
        inactivo:"inactivo"
    }
    return(<div className="system-card">
        <div className="system-info">
            <h3>{system.name}</h3>
        </div>
        <div className="system-rigth">
            <span className={`system-status ${statusClass[system.status]}`}>
                <span className="status-dot"></span>
                {system.status}
            </span>
            <SystemButton type="activado"/>
            <SystemButton type="reset"/>
        </div>
    </div>)
}

export default Systemcard
