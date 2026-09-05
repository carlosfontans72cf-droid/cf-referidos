"use client";
import { useEffect, useState } from "react";
import RequireAdmin from "@/components/RequireAdmin";
import BotonLogout from "@/components/BotonLogout";
import { useAuth } from "@/lib/useAuth";

interface Conversion {
  id: string;
  codigoReferido: string;
  producto: string;
  monto: number;
  comision: number;
  comisionPadrino: number | null;
  estadoPago: string;
  fecha: string;
}

export default function AdminConversionesPage() {
  const { user } = useAuth();
  const [conversiones, setConversiones] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);

  async function cargar() {
    if (!user) return;
    setError(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/conversiones", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (!res.ok || !Array.isArray(json)) {
        setError(json?.error || "Error al cargar las conversiones");
        setConversiones([]);
      } else {
        setConversiones(json);
      }
    } catch (err: any) {
      setError(err.message || "Error de conexión");
      setConversiones([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, [user]);

  async function marcarPagado(id: string, nuevoEstado: string) {
    if (!user) return;
    setActualizandoId(id);
    const token = await user.getIdToken();
    await fetch(`/api/admin/conversiones/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estadoPago: nuevoEstado }),
    });
    setConversiones((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estadoPago: nuevoEstado } : c))
    );
    setActualizandoId(null);
  }

  const totalComisiones = conversiones.reduce(
    (sum, c) => sum + c.comision + (c.comisionPadrino || 0),
    0
  );
  const totalPendiente = conversiones
    .filter((c) => c.estadoPago === "pendiente")
    .reduce((sum, c) => sum + c.comision + (c.comisionPadrino || 0), 0);

  return (
    <RequireAdmin>
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="flex justify-end mb-4">
          <BotonLogout />
        </div>
        <h1 className="text-xl font-bold mb-4">Ventas y comisiones</h1>

        {error && (
          <p className="text-red-600 mb-4">Error: {error}</p>
        )}

        <div className="flex gap-4 mb-6">
          <div className="bg-white border rounded p-3 text-center flex-1">
            <p className="text-xl font-bold">{conversiones.length}</p>
            <p className="text-sm text-gray-600">Ventas totales</p>
          </div>
          <div className="bg-yellow-50 border rounded p-3 text-center flex-1">
            <p className="text-xl font-bold">${totalPendiente}</p>
            <p className="text-sm text-gray-600">Comisiones pendientes</p>
          </div>
          <div className="bg-white border rounded p-3 text-center flex-1">
            <p className="text-xl font-bold">${totalComisiones}</p>
            <p className="text-sm text-gray-600">Comisiones totales</p>
          </div>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : conversiones.length === 0 ? (
          <p className="text-gray-500">Todavía no hay ventas registradas.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Código</th>
                <th className="py-2">Producto</th>
                <th className="py-2">Monto</th>
                <th className="py-2">Comisión</th>
                <th className="py-2">Estado</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {conversiones.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="py-2 font-mono">{c.codigoReferido}</td>
                  <td className="py-2">{c.producto}</td>
                  <td className="py-2">${c.monto}</td>
                  <td className="py-2">
                    ${c.comision}
                    {c.comisionPadrino ? ` (+$${c.comisionPadrino} padrino)` : ""}
                  </td>
                  <td className="py-2 capitalize">{c.estadoPago}</td>
                  <td className="py-2">
                    <button
                      onClick={() =>
                        marcarPagado(c.id, c.estadoPago === "pendiente" ? "pagado" : "pendiente")
                      }
                      disabled={actualizandoId === c.id}
                      className="bg-gray-200 text-xs px-3 py-1 rounded"
                    >
                      {actualizandoId === c.id
                        ? "..."
                        : c.estadoPago === "pendiente"
                        ? "Marcar pagado"
                        : "Marcar pendiente"}
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