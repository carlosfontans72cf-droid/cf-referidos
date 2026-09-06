import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { randomBytes } from "crypto";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { nombre, apellido, email, invitadoPor } = await req.json();

  if (!nombre || !apellido || !email) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const token = randomBytes(16).toString("hex");

  await adminDb.collection("invitaciones").add({
    nombre,
    apellido,
    email,
    token,
    estado: "pendiente",
    invitadoPor: invitadoPor || "admin",
    fechaCreacion: new Date(),
  });

  return NextResponse.json({ token });
}