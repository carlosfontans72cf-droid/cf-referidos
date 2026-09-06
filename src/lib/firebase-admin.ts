import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getServiceAccount() {
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!base64) {
    throw new Error("Falta la variable FIREBASE_SERVICE_ACCOUNT_BASE64");
  }
  const json = Buffer.from(base64, "base64").toString("utf-8");
  return JSON.parse(json);
}

const adminApp = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert(getServiceAccount()),
    });

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);