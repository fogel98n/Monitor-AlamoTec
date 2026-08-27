
import { useState } from "react"
import"../styles/boton.css"

interface systemButtonProps{
    type?:"activado"|"reset"
}
 function SystemButton({type="activado",}:systemButtonProps){
    const [activo,setActivo]=useState(false)
    const handleClick=()=>{
        setActivo(!activo)
    }
    if(type === "reset"){
        return(
            <button type="button" className="system-button reset" onClick={handleClick}>Reset</button>
        )
    }
    return(
        <button type="button" className={`system-button ${activo?"desactivar":"activar"}`} onClick={handleClick}>
            {activo?"desactivar":"activar"}
        </button>
    )
 }
export default SystemButton