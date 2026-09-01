import { useState } from "react";
import { crearSistema } from "../services/cron_task_fernandoorellana";

interface AgregarSistemaModalProps {
  onClose: () => void;
  onCreated: () => void;
}

function AgregarSistemaModal({ onClose, onCreated }: AgregarSistemaModalProps) {
  const [form, setForm] = useState({
    nombre: "",
    host: "",
    usuario: "",
    password: "",
    base_datos: "",
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
      await crearSistema(form);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al agregar el sistema");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Agregar sistema</h3>
        <form onSubmit={handleSubmit}>
          <input name="nombre" placeholder="Nombre (ej. Vtiger Cliente X)" value={form.nombre} onChange={handleChange} required />
          <input name="host" placeholder="Host (ej. db.alamotec.com.gt)" value={form.host} onChange={handleChange} required />
          <input name="usuario" placeholder="Usuario MySQL" value={form.usuario} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input name="base_datos" placeholder="Nombre de la base de datos" value={form.base_datos} onChange={handleChange} required />
          <input name="puerto" type="number" placeholder="Puerto" value={form.puerto} onChange={handleChange} />

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-buttons">
            <button type="button" onClick={onClose} disabled={guardando}>
              Cancelar
            </button>
            <button type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgregarSistemaModal;