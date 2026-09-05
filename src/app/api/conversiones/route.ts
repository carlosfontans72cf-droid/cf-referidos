import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const { codigo, producto, monto } = await req.json();

  if (!codigo || !producto || !monto) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  // Buscar al referido por su código
  const referidoSnap = await adminDb
    .collection("referidos")
    .where("codigo", "==", codigo)
    .limit(1)
    .get();

  if (referidoSnap.empty) {
    return NextResponse.json({ error: "Código de referido no encontrado" }, { status: 404 });
  }

  const referidoDoc = referidoSnap.docs[0];
  const referido = referidoDoc.data();
  const referidoId = referidoDoc.id;

  const montoNum = Number(monto);
  const comision = (montoNum * referido.comisionPropia) / 100;

  // Ver si tiene padrino (alguien que lo invitó) para la comisión de segundo nivel
  let comisionPadrino = null;
  let padrinoId = null;

  if (referido.invitadoPor) {
    const padrinoDoc = await adminDb.collection("referidos").doc(referido.invitadoPor).get();
    if (padrinoDoc.exists) {
      const padrino = padrinoDoc.data()!;
      comisionPadrino = (montoNum * padrino.comisionInvitados) / 100;
      padrinoId = padrinoDoc.id;
    }
  }

  const conversionRef = await adminDb.collection("conversiones").add({
    codigoReferido: codigo,
    referidoId,
    producto,
    monto: montoNum,
    porcentajeAplicado: referido.comisionPropia,
    comision,
    comisionPadrino,
    padrinoId,
    estadoPago: "pendiente",
    fecha: new Date(),
  });

  return NextResponse.json({
    id: conversionRef.id,
    comision,
    comisionPadrino,
    referido: `${referido.nombre} ${referido.apellido}`,
  });
}