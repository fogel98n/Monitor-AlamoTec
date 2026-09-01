import { useEffect, useState } from "react";

function obtenerTemaInicial(): "light" | "dark" {
  const guardado = localStorage.getItem("tema");
  if (guardado === "dark" || guardado === "light") {
    return guardado;
  }
  // No hay preferencia guardada: usar la del sistema operativo/navegador
  const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefiereOscuro ? "dark" : "light";
}

function ThemeToggle() {
  const [tema, setTema] = useState<"light" | "dark">(obtenerTemaInicial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
  }, [tema]);

  // Si el usuario nunca eligio manualmente, seguir el cambio de tema del sistema en vivo
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const eligioManual = localStorage.getItem("tema");
      if (!eligioManual) {
        setTema(e.matches ? "dark" : "light");
      }
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const cambiarManual = () => {
    const nuevo = tema === "light" ? "dark" : "light";
    setTema(nuevo);
    localStorage.setItem("tema", nuevo);
  };

  return (
    <button className="theme-toggle" onClick={cambiarManual} aria-label="Cambiar tema">
      {tema === "light" ? "🌙 Oscuro" : "☀️ Claro"}
    </button>
  );
}

export default ThemeToggle;