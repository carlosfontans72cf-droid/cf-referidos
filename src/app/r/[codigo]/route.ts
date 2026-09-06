import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ codigo: string }> }
) {
  const { codigo } = await params;

  const snap = await adminDb
    .collection("referidos")
    .where("codigo", "==", codigo)
    .where("activo", "==", true)
    .limit(1)
    .get();

  if (snap.empty) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  await adminDb.collection("visitas").add({
    codigo,
    fecha: new Date(),
    origen: req.nextUrl.searchParams.get("origen") || null,
  });

  const response = NextResponse.redirect(new URL("/", req.url));
  response.cookies.set("ref", codigo, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}