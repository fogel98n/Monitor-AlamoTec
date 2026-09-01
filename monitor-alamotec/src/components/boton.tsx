import "../styles/boton.css"

interface systemButtonProps{
    type?:"activado"|"reset"
    activo?:boolean
    onClick?:()=>void
    disabled?:boolean
}
 function SystemButton({type="activado",activo=false,onClick,disabled}:systemButtonProps){
    if(type === "reset"){
        return(
            <button type="button" className="system-button reset" onClick={onClick} disabled={disabled}>Reset</button>
        )
    }
    return(
        <button type="button" className={`system-button ${activo?"desactivar":"activar"}`} onClick={onClick} disabled={disabled}>
            {activo?"Desactivar":"Activar"}
        </button>
    )
 }
export default SystemButton