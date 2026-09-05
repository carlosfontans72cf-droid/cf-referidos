import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ codigo: string }> }
) {
  const { codigo } = await params;

  // Verificar que el código exista y esté activo
  const snap = await adminDb
    .collection("referidos")
    .where("codigo", "==", codigo)
    .where("activo", "==", true)
    .limit(1)
    .get();

  if (snap.empty) {
    // Código inválido: igual redirige a la home, pero sin marcar nada
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Registrar la visita
  await adminDb.collection("visitas").add({
    codigo,
    fecha: new Date(),
    origen: req.nextUrl.searchParams.get("origen") || null,
  });

  // Redirigir a la home y dejar el código guardado en una cookie por 30 días
  const response = NextResponse.redirect(new URL("/", req.url));
  response.cookies.set("ref", codigo, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}