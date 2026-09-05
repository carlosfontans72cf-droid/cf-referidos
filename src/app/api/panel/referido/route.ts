import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const referidoDoc = await adminDb.collection("referidos").doc(uid).get();
  if (!referidoDoc.exists) {
    return NextResponse.json({ error: "Referido no encontrado" }, { status: 404 });
  }
  const referido = referidoDoc.data()!;

  // Contar visitas de su código
  const visitasSnap = await adminDb
    .collection("visitas")
    .where("codigo", "==", referido.codigo)
    .get();

  // Sus propias ventas
  const conversionesSnap = await adminDb
    .collection("conversiones")
    .where("referidoId", "==", uid)
    .orderBy("fecha", "desc")
    .get();

  // Ventas donde él es el padrino (comisión de segundo nivel)
  const comoPadrinoSnap = await adminDb
    .collection("conversiones")
    .where("padrinoId", "==", uid)
    .get();

  const conversiones = conversionesSnap.docs.map((d) => {
    const data = d.data();
    return {
      producto: data.producto,
      monto: data.monto,
      comision: data.comision,
      estadoPago: data.estadoPago,
      fecha: data.fecha.toDate().toISOString(),
    };
  });

  const totalPendiente =
    conversiones
      .filter((c) => c.estadoPago === "pendiente")
      .reduce((sum, c) => sum + c.comision, 0) +
    comoPadrinoSnap.docs
      .filter((d) => d.data().estadoPago === "pendiente")
      .reduce((sum, d) => sum + (d.data().comisionPadrino || 0), 0);

  const totalPagado =
    conversiones
      .filter((c) => c.estadoPago === "pagado")
      .reduce((sum, c) => sum + c.comision, 0) +
    comoPadrinoSnap.docs
      .filter((d) => d.data().estadoPago === "pagado")
      .reduce((sum, d) => sum + (d.data().comisionPadrino || 0), 0);

  return NextResponse.json({
    nombre: referido.nombre,
    apellido: referido.apellido,
    codigo: referido.codigo,
    comisionPropia: referido.comisionPropia,
    comisionInvitados: referido.comisionInvitados,
    totalVisitas: visitasSnap.size,
    totalVentas: conversiones.length,
    totalPendiente,
    totalPagado,
    conversiones,
  });
}