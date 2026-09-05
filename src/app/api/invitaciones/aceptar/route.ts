import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

function generarCodigo(nombre: string, apellido: string) {
  const base = `${nombre}${apellido}`.toLowerCase().replace(/[^a-z0-9]/g, "");
  const sufijo = Math.floor(100 + Math.random() * 900); // 3 dígitos random para evitar choques
  return `${base}${sufijo}`;
}

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const snap = await adminDb
    .collection("invitaciones")
    .where("token", "==", token)
    .limit(1)
    .get();

  if (snap.empty) {
    return NextResponse.json({ error: "Invitación no encontrada" }, { status: 404 });
  }

  const invitacionDoc = snap.docs[0];
  const invitacion = invitacionDoc.data();

  if (invitacion.estado !== "pendiente") {
    return NextResponse.json({ error: "Esta invitación ya fue usada o expiró" }, { status: 400 });
  }

  // Crear usuario en Firebase Auth
  const userRecord = await adminAuth.createUser({
    email: invitacion.email,
    password,
    displayName: `${invitacion.nombre} ${invitacion.apellido}`,
  });

  const codigo = generarCodigo(invitacion.nombre, invitacion.apellido);

  // Crear documento del referido
  await adminDb.collection("referidos").doc(userRecord.uid).set({
    nombre: invitacion.nombre,
    apellido: invitacion.apellido,
    email: invitacion.email,
    codigo,
    comisionPropia: 15,
    comisionInvitados: 3,
    invitadoPor: invitacion.invitadoPor === "admin" ? null : invitacion.invitadoPor,
    activo: true,
    fechaAlta: new Date(),
  });

  // Marcar invitación como usada
  await invitacionDoc.ref.update({ estado: "usada" });

  return NextResponse.json({ codigo });
}