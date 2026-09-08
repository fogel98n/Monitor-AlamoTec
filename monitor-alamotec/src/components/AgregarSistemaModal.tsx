import { useState } from "react";
import { crearSistema, actualizarSistema, type Sistema } from "../services/cron_task_fernandoorellana";

interface AgregarSistemaModalProps {
  onClose: () => void;
  onCreated: () => void;
  sistemaExistente?: Sistema;
}

function AgregarSistemaModal({ onClose, onCreated, sistemaExistente }: AgregarSistemaModalProps) {
  const esEdicion = !!sistemaExistente;

  const [form, setForm] = useState({
    nombre: sistemaExistente?.nombre || "",
    host: "",
    usuario: "",
    password: "",
    base_datos: sistemaExistente?.base_datos || "",
    puerto: 3306,
  });
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "puerto" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      if (esEdicion && sistemaExistente) {
        // Solo se envian los campos que tengan valor (para no borrar password si se deja vacio)
        const cambios: Record<string, string | number> = { nombre: form.nombre, base_datos: form.base_datos };
        if (form.host) cambios.host = form.host;
        if (form.usuario) cambios.usuario = form.usuario;
        if (form.password) cambios.password = form.password;
        if (form.puerto) cambios.puerto = form.puerto;
        await actualizarSistema(sistemaExistente.id, cambios);
      } else {
        await crearSistema(form);
      }
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el sistema");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{esEdicion ? "Editar sistema" : "Agregar sistema"}</h3>
        <form onSubmit={handleSubmit}>
          <input name="nombre" placeholder="Nombre (ej. Vtiger Cliente X)" value={form.nombre} onChange={handleChange} required />
          <input
            name="host"
            placeholder={esEdicion ? "Host (dejar vacio para no cambiar)" : "Host (ej. db.alamotec.com.gt)"}
            value={form.host}
            onChange={handleChange}
            required={!esEdicion}
          />
          <input
            name="usuario"
            placeholder={esEdicion ? "Usuario (dejar vacio para no cambiar)" : "Usuario MySQL"}
            value={form.usuario}
            onChange={handleChange}
            required={!esEdicion}
          />
          <input
            name="password"
            type="password"
            placeholder={esEdicion ? "Password (dejar vacio para no cambiar)" : "Password"}
            value={form.password}
            onChange={handleChange}
            required={!esEdicion}
          />
          <input name="base_datos" placeholder="Nombre de la base de datos" value={form.base_datos} onChange={handleChange} required />
          <input name="puerto" type="number" placeholder="Puerto" value={form.puerto} onChange={handleChange} />

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-buttons">
            <button type="button" onClick={onClose} disabled={guardando}>
              Cancelar
            </button>
            <button type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgregarSistemaModal;