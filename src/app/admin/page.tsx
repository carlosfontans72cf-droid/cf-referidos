import Link from "next/link";
import RequireAdmin from "@/components/RequireAdmin";
import BotonLogout from "@/components/BotonLogout";

export default function AdminHomePage() {
  return (
    <RequireAdmin>
      <div className="max-w-md mx-auto mt-10 p-6">
        <div className="flex justify-end mb-4">
          <BotonLogout />
        </div>
        <h1 className="text-xl font-bold mb-4">Panel de administración</h1>
        <div className="flex flex-col gap-3">
          <Link href="/admin/invitar" className="bg-blue-600 text-white p-2 rounded text-center">
            Invitar referido
          </Link>
          <Link href="/admin/venta" className="bg-blue-600 text-white p-2 rounded text-center">
            Cargar venta
          </Link>
          <Link href="/admin/referidos" className="bg-blue-600 text-white p-2 rounded text-center">
            Ver referidos
          </Link>
          <Link href="/admin/conversiones" className="bg-blue-600 text-white p-2 rounded text-center">
            Ver ventas y comisiones
          </Link>
          <Link href="/admin/recursos" className="bg-blue-600 text-white p-2 rounded text-center">
            Agregar material
          </Link>
        </div>
      </div>
    </RequireAdmin>
  );
}