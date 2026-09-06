"use client";
import { useEffect, useState } from "react";
import RequireReferido from "@/components/RequireReferido";
import BotonLogout from "@/components/BotonLogout";
import { useAuth } from "@/lib/useAuth";

interface Conversion {
  producto: string;
  monto: number;
  comision: number;
  estadoPago: string;
  fecha: string;
}

interface Recurso {
  id: string;
  tipo: string;
  red: string;
  titulo: string;
  contenido: string;
  url: string | null;
}

interface PanelData {
  nombre: string;
  apellido: string;
  codigo: string;
  comisionPropia: number;
  comisionInvitados: number;
  totalVisitas: number;
  totalVentas: number;
  totalPendiente: number;
  totalPagado: number;
  conversiones: Conversion[];
}

export default function PanelReferidoPage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<PanelData | null>(null);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (authLoading) return;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/panel/referido", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();

        if (!res.ok) {
          setError(json.error || "Error al cargar los datos");
        } else {
          setData(json);
        }
      } catch (err: any) {
        setError(err.message || "Error de conexión");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user, authLoading]);

  useEffect(() => {
    fetch("/api/recursos")
      .then((res) => res.json())
      .then(setRecursos)
      .catch(() => setRecursos([]));
  }, []);

  function abrirEnlace(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function compartirPorWhatsapp(codigo: string) {
    const link = `${window.location.origin}/r/${codigo}`;
    const mensaje = `¡Hola! Te comparto este link: ${link}`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <RequireReferido>
      <div className="max-w-2xl mx-auto mt-10 p-6">
        <div className="flex justify-end mb-4">
          <BotonLogout />
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : !data ? (
          <p>No se encontraron datos.</p>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-1">
              Hola, {data.nombre} {data.apellido}
            </h1>
            <p className="text-gray-600 mb-6">
              Tu código: <strong>{data.codigo}</strong>
            </p>

            <div className="bg-gray-100 rounded p-4 mb-6 break-all">
              <p className="text-sm text-gray-600 mb-1">Tu link para compartir:</p>
              <p className="font-mono text-sm mb-3">
                {typeof window !== "undefined" ? window.location.origin : ""}/r/{data.codigo}
              </p>
              <button
                onClick={() => compartirPorWhatsapp(data.codigo)}
                className="bg-green-600 text-white text-sm px-4 py-2 rounded"
              >
                Compartir por WhatsApp
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border rounded p-3 text-center">
                <p className="text-2xl font-bold">{data.totalVisitas}</p>
                <p className="text-sm text-gray-600">Visitas</p>
              </div>
              <div className="bg-white border rounded p-3 text-center">
                <p className="text-2xl font-bold">{data.totalVentas}</p>
                <p className="text-sm text-gray-600">Ventas</p>
              </div>
              <div className="bg-yellow-50 border rounded p-3 text-center">
                <p className="text-2xl font-bold">${data.totalPendiente}</p>
                <p className="text-sm text-gray-600">Pendiente</p>
              </div>
              <div className="bg-green-50 border rounded p-3 text-center">
                <p className="text-2xl font-bold">${data.totalPagado}</p>
                <p className="text-sm text-gray-600">Pagado</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-2">Tus ventas</h2>
            {data.conversiones.length === 0 ? (
              <p className="text-gray-500 mb-6">Todavía no tenés ventas registradas.</p>
            ) : (
              <table className="w-full text-sm border-collapse mb-6">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Producto</th>
                    <th className="py-2">Monto</th>
                    <th className="py-2">Comisión</th>
                    <th className="py-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.conversiones.map((c, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{c.producto}</td>
                      <td className="py-2">${c.monto}</td>
                      <td className="py-2">${c.comision}</td>
                      <td className="py-2 capitalize">{c.estadoPago}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <h2 className="text-lg font-semibold mt-8 mb-2">Material para compartir</h2>
            {recursos.length === 0 ? (
              <p className="text-gray-500">Todavía no hay material cargado.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {recursos.map((r) => (
                  <div key={r.id} className="border rounded p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs uppercase text-gray-500">
                        {r.tipo} · {r.red}
                      </span>
                    </div>
                    {r.titulo && <p className="font-semibold">{r.titulo}</p>}
                    <p className="text-sm whitespace-pre-wrap">{r.contenido}</p>
                    {r.url ? (
                      <button
                        onClick={() => abrirEnlace(r.url as string)}
                        className="text-blue-600 text-sm underline block mt-1"
                      >
                        Ver enlace
                      </button>
                    ) : null}
                    <div>
                      <button
                        onClick={() => navigator.clipboard.writeText(r.contenido)}
                        className="mt-2 text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        Copiar texto
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </RequireReferido>
  );
}