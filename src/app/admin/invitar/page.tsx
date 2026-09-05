"use client";
import { useState } from "react";
import RequireAdmin from "@/components/RequireAdmin";

export default function InvitarPage() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/invitaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, apellido, email }),
    });
    const data = await res.json();
    setLink(`${window.location.origin}/invitacion/${data.token}`);
  }

  return (
    <RequireAdmin>
      <div className="max-w-md mx-auto mt-10 p-6">
        <h1 className="text-xl font-bold mb-4">Invitar referido</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="border p-2 rounded" required />
          <input placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} className="border p-2 rounded" required />
          <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" required />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">Generar invitación</button>
        </form>
        {link && (
          <div className="mt-4 p-3 bg-gray-100 rounded break-all">
            <p className="text-sm text-gray-600 mb-1">Link para compartir:</p>
            <p className="font-mono text-sm">{link}</p>
          </div>
        )}
      </div>
    </RequireAdmin>
  );
}