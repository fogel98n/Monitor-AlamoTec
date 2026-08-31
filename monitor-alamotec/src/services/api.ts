//const API_URL = "/api";
const API_URL = "http://localhost:3000/";

export async function login(username: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      correo: username,
      password: password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || "Usuario o contraseña incorrectos"
    );
  }

  return data;
}