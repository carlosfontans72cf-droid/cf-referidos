"use client";
import { useState } from "react";
import RequireAdmin from "@/components/RequireAdmin";
import BotonLogout from "@/components/BotonLogout";

export default function CargarVentaPage() {
  const [codigo, setCodigo] = useState("");
  const [producto, setProducto] = useState("");
  const [monto, setMonto] = useState("");
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResultado(null);

    const res = await fetch("/api/conversiones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo, producto, monto }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Ocurrió un error");
      return;
    }

    setResultado(data);
    setCodigo("");
    setProducto("");
    setMonto("");
  }

  return (
    <RequireAdmin>
      <div className="max-w-md mx-auto mt-10 p-6">
        <div className="flex justify-end mb-4">
          <BotonLogout />
        </div>

        <h1 className="text-xl font-bold mb-4">Cargar venta</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            placeholder="Código de referido"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Producto (ej: App Taxuber)"
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            Registrar venta
          </button>
        </form>

        {error && <p className="text-red-600 mt-3">{error}</p>}

        {resultado && (
          <div className="mt-4 p-3 bg-green-50 rounded">
            <p>
              Venta registrada para <strong>{resultado.referido}</strong>
            </p>
            <p>
              Comisión: <strong>${resultado.comision}</strong>
            </p>
            {resultado.comisionPadrino && (
              <p>
                Comisión extra para su padrino: <strong>${resultado.comisionPadrino}</strong>
              </p>
            )}
          </div>
        )}
      </div>
    </RequireAdmin>
  );
}