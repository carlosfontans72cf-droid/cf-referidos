import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdmin } from "@/lib/verifyAdmin";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const uid = await verifyAdmin(req);
  if (!uid) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const snap = await adminDb.collection("conversiones").orderBy("fecha", "desc").get();

  const conversiones = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      codigoReferido: data.codigoReferido,
      producto: data.producto,
      monto: data.monto,
      comision: data.comision,
      comisionPadrino: data.comisionPadrino,
      estadoPago: data.estadoPago,
      fecha: data.fecha.toDate().toISOString(),
    };
  });

  return NextResponse.json(conversiones);
}