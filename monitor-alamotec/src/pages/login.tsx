import "../styles/Login-style.css";
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate=useNavigate();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/dashboard")
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Bienvenido</h1>

        <p>Inicia sesión para continuar</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Usuario</label>

            <input
              type="text"
              id="username"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password">Contraseña</label>

            <input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;