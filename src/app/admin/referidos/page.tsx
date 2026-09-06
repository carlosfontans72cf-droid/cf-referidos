"use client";
import { useEffect, useState } from "react";
import RequireAdmin from "@/components/RequireAdmin";
import BotonLogout from "@/components/BotonLogout";
import { useAuth } from "@/lib/useAuth";

interface Referido {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  codigo: string;
  comisionPropia: number;
  comisionInvitados: number;
  activo: boolean;
}

export default function AdminReferidosPage() {
  const { user } = useAuth();
  const [referidos, setReferidos] = useState<Referido[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardandoId, setGuardandoId] = useState<string | null>(null);

  async function cargar() {
    if (!user) return;
    const token = await user.getIdToken();
    const res = await fetch("/api/admin/referidos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    setReferidos(json);
    setLoading(false);
  }

  useEffect(() => {
    cargar();
  }, [user]);

  function actualizarCampo(id: string, campo: keyof Referido, valor: any) {
    setReferidos((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [campo]: valor } : r))
    );
  }

  async function guardar(referido: Referido) {
    if (!user) return;
    setGuardandoId(referido.id);
    const token = await user.getIdToken();
    await fetch(`/api/admin/referidos/${referido.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        comisionPropia: referido.comisionPropia,
        comisionInvitados: referido.comisionInvitados,
        activo: referido.activo,
      }),
    });
    setGuardandoId(null);
  }

  function compartirPorWhatsapp(codigo: string) {
    const link = `${window.location.origin}/r/${codigo}`;
    const mensaje = `¡Hola! Te comparto este link: ${link}`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <RequireAdmin>
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="flex justify-end mb-4">
          <BotonLogout />
        </div>
        <h1 className="text-xl font-bold mb-4">Referidos</h1>

        {loading ? (
          <p>Cargando...</p>
        ) : referidos.length === 0 ? (
          <p className="text-gray-500">Todavía no hay referidos cargados.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Nombre</th>
                <th className="py-2">Código</th>
                <th className="py-2">Email</th>
                <th className="py-2">% Propia</th>
                <th className="py-2">% Invitados</th>
                <th className="py-2">Activo</th>
                <th className="py-2"></th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {referidos.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="py-2">{r.nombre} {r.apellido}</td>
                  <td className="py-2 font-mono">{r.codigo}</td>
                  <td className="py-2">{r.email}</td>
                  <td className="py-2">
                    <input
                      type="number"
                      value={r.comisionPropia}
                      onChange={(e) => actualizarCampo(r.id, "comisionPropia", Number(e.target.value))}
                      className="border rounded w-16 p-1"
                    />
                  </td>
                  <td className="py-2">
                    <input
                      type="number"
                      value={r.comisionInvitados}
                      onChange={(e) => actualizarCampo(r.id, "comisionInvitados", Number(e.target.value))}
                      className="border rounded w-16 p-1"
                    />
                  </td>
                  <td className="py-2">
                    <input
                      type="checkbox"
                      checked={r.activo}
                      onChange={(e) => actualizarCampo(r.id, "activo", e.target.checked)}
                    />
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => guardar(r)}
                      disabled={guardandoId === r.id}
                      className="bg-blue-600 text-white text-xs px-3 py-1 rounded"
                    >
                      {guardandoId === r.id ? "Guardando..." : "Guardar"}
                    </button>
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => compartirPorWhatsapp(r.codigo)}
                      className="bg-green-600 text-white text-xs px-3 py-1 rounded"
                    >
                      WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </RequireAdmin>
  );
}