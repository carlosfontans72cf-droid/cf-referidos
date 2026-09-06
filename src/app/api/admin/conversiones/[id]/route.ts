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
  const { estadoPago } = await req.json();

  if (!["pendiente", "pagado"].includes(estadoPago)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  await adminDb.collection("conversiones").doc(id).update({ estadoPago });

  return NextResponse.json({ ok: true });
}