import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdmin } from "@/lib/verifyAdmin";

export async function GET(req: NextRequest) {
  const uid = await verifyAdmin(req);
  if (!uid) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const snap = await adminDb.collection("referidos").orderBy("fechaAlta", "desc").get();

  const referidos = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      codigo: data.codigo,
      comisionPropia: data.comisionPropia,
      comisionInvitados: data.comisionInvitados,
      activo: data.activo,
      invitadoPor: data.invitadoPor,
    };
  });

  return NextResponse.json(referidos);
}