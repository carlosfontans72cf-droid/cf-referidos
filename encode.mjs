import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf-8");
const match = envContent.match(/FIREBASE_ADMIN_PRIVATE_KEY=(.+)/);

if (!match) {
  console.log("No se encontró la variable");
  process.exit(1);
}

let value = match[1].trim();
if (value.startsWith('"') && value.endsWith('"')) {
  value = value.slice(1, -1);
}

const base64 = Buffer.from(value, "utf-8").toString("base64");

fs.writeFileSync("vercel-key.env", `FIREBASE_ADMIN_PRIVATE_KEY_BASE64=${base64}\n`);

console.log("Listo, se creó el archivo vercel-key.env");