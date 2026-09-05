import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import "dotenv/config";

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const auth = getAuth(app);

const email = "carlosfontans72.cf@gmail.com"; // reemplazá por el mail que cargaste en el paso 1

const user = await auth.getUserByEmail(email);
await auth.setCustomUserClaims(user.uid, { admin: true });

console.log(`Listo: ${email} ahora es admin.`);
process.exit(0);