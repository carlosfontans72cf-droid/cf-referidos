"use client";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function AceptarInvitacionPage() {
  const params = useParams();
  const token = params.token as string;
  const [password, setPassword] = useState("");
  const [resultado, setResultado] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/invitaciones/aceptar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Ocurrió un error");
      return;
    }

    setResultado(data.codigo);
  }

  if (resultado) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 text-center">
        <h1 className="text-xl font-bold mb-2">¡Cuenta creada!</h1>
        <p>Tu código de referido es:</p>
        <p className="text-2xl font-mono mt-2">{resultado}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-xl font-bold mb-4">Completá tu registro</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          placeholder="Elegí tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
          minLength={6}
        />
        <button type="submit" className="bg-green-600 text-white p-2 rounded">
          Crear cuenta
        </button>
      </form>
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
}