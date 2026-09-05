import { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function verifyAdmin(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    if (decoded.admin === true) {
      return decoded.uid;
    }
    return null;
  } catch {
    return null;
  }
}