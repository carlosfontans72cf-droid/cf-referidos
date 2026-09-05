"use client";
import { useState } from "react";
import RequireAdmin from "@/components/RequireAdmin";
import BotonLogout from "@/components/BotonLogout";

export default function AdminRecursosPage() {
  const [tipo, setTipo] = useState("post");
  const [red, setRed] = useState("instagram");
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [url, setUrl] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensaje("");

    const res = await fetch("/api/recursos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, red, titulo, contenido, url }),
    });

    if (res.ok) {
      setMensaje("Recurso agregado correctamente.");
      setTitulo("");
      setContenido("");
      setUrl("");
    } else {
      setMensaje("Ocurrió un error al guardar.");
    }
  }

  return (
    <RequireAdmin>
      <div className="max-w-lg mx-auto mt-10 p-6">
        <div className="flex justify-end mb-4">
          <BotonLogout />
        </div>

        <h1 className="text-xl font-bold mb-4">Agregar material para referidos</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-sm text-gray-600">Tipo de contenido</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="border p-2 rounded">
            <option value="post">Post</option>
            <option value="historia">Historia</option>
            <option value="mensaje">Mensaje / Tip de venta</option>
            <option value="video">Video</option>
            <option value="podcast">Podcast / Audio</option>
          </select>

          <label className="text-sm text-gray-600">Red social</label>
          <select value={red} onChange={(e) => setRed(e.target.value)} className="border p-2 rounded">
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
            <option value="general">General / Cualquiera</option>
          </select>

          <input
            placeholder="Título (opcional)"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="border p-2 rounded"
          />

          <textarea
            placeholder="Texto, copy o descripción"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            className="border p-2 rounded min-h-[100px]"
            required
          />

          <input
            placeholder="Link (si es video/podcast, opcional)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-2 rounded"
          />

          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            Guardar recurso
          </button>
        </form>
        {mensaje && <p className="mt-3 text-sm">{mensaje}</p>}
      </div>
    </RequireAdmin>
  );
}