import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function GET() {
  const snap = await adminDb
    .collection("recursos")
    .orderBy("fechaCreacion", "desc")
    .get();

  const recursos = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    fechaCreacion: d.data().fechaCreacion.toDate().toISOString(),
  }));

  return NextResponse.json(recursos);
}

export async function POST(req: NextRequest) {
  const { tipo, red, titulo, contenido, url } = await req.json();

  if (!tipo || !contenido) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const ref = await adminDb.collection("recursos").add({
    tipo,
    red: red || "general",
    titulo: titulo || "",
    contenido,
    url: url || null,
    fechaCreacion: new Date(),
  });

  return NextResponse.json({ id: ref.id });
}