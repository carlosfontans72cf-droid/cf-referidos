import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getPrivateKey(): string {
  const base64Key = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64;
  if (base64Key) {
    const decoded = Buffer.from(base64Key, "base64").toString("utf-8");
    return decoded.replace(/\\n/g, "\n");
  }
  return process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n") || "";
}

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = getPrivateKey();

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    `Faltan variables de Firebase Admin. projectId: ${projectId ? "OK" : "FALTA"}, clientEmail: ${clientEmail ? "OK" : "FALTA"}, privateKey: ${privateKey ? "OK (" + privateKey.length + " chars)" : "FALTA"}`
  );
}

const adminApp = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);