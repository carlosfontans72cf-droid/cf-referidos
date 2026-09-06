import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdmin } from "@/lib/verifyAdmin";

export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const uid = await verifyAdmin(req);
  if (!uid) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const cambios: Record<string, any> = {};
  if (body.comisionPropia !== undefined) cambios.comisionPropia = Number(body.comisionPropia);
  if (body.comisionInvitados !== undefined) cambios.comisionInvitados = Number(body.comisionInvitados);
  if (body.activo !== undefined) cambios.activo = Boolean(body.activo);

  await adminDb.collection("referidos").doc(id).update(cambios);

  return NextResponse.json({ ok: true });
}