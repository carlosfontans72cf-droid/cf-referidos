import fs from "fs";

const serviceAccount = {
  type: "service_account",
  project_id: "cf-referidos",
  private_key_id: "2a61bbf197d869ed47e9a8dd00e4e17ee638ba14",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDHFCbZ6TYzz7a+\neDJongkn6Z7f4Po6Pz5+ydQ1J+8AIJfz3NMxhEfqyr+h8lsOVtfaYmj9Q/O3E/Gp\nYIWvmd8NqBmnNCksqehq4dPAayvgZVFUljva4LhtXnKqJGcHoBbe6RkzmM+/+V9E\no9WZLfisWeOB6SHqQfVFevT2AbLr1ew2jf9rv2xoVvymROL9/C4W9ou0NwlZvyxF\nvJYNxt8AlwEh9mvnJft3b2oAetOwC1+Sxnh9F0ikB8vMe8rOYKn5T0zvCz1IOh2R\nyQSe5T7hHdRLX8Cx7JogVhQVrLlOYwgN6/gloJwINShlRJpygoLr+MwgFZB8CInd\n5HDGG1h1AgMBAAECggEACGQ6kQPqE3wFdXjmkw9aTnLkDgbTNWJWFY0XY1g4FFbL\nYO2lf1hWmbiLJF3tZajWd2+fglF7c/Okw6F8cR74zoAP+MLTm3zb/algPiOmWVKb\n/4dHpZ3EWGPbTH21VBZ08Fd+BvVBiJOP5vpK9iaAbW9qjh7QHapDFvcsXTRMIPGz\n6J7IHqbfPjqN3zBjBSWvlQo1Kgt1p3rsgCmLrwWrsIE60wDoK95YweLr844Y/FbB\nax5lFZZBLAXl0PXQLOsqRp7TWAPVqP4ufR2/n3G3pxZcIC62rM0qaod6AsReY2Zy\nY6tJA330iRN0BPJPk79y5hHMI3kypzG0xvm7NkXiEQKBgQD0Joh2XOMnEma8GKg8\nIsj0uWCbP1QqwKAHFozY4ApAkYo5PXmjP+gjprNW2JOTb43hBAl0t+OJWSIuVgMb\n8VcVVf7bwo4fs7tvACyGm1Wfpq7SuyJ1b0gJ+hEnTbHRoPo+ADUQccbzorp+vNzh\njsMNSn9sVamHdmOQGhRT0zyyPQKBgQDQvZ7hqAtPeUOxH9IaUcxW6AHha7NPwN6m\nIE8HflOawc+6M76zuxI680irde05clL7QZuuYHww4T8910C+jKlHXw25JYWf+3ct\nZ+8tgy6WfTNyMxMwVqC+U8etmq0AcQzhZUVqBEpXclCg0TIQdQFVhN4KXtkAyNHg\ncwESVm86mQKBgD3L8wZihGxDUBWT+CEgfNTUhwtEgD1B/D9PCd9q9a1aKS5LzRnw\n9wTvEL2Om+vZdIPbzbjpQoJlOS2ZP7g24d/YoGVnXSnRCEQUOzDm6Ek8m0tjalln\nDUjZLrZQCA4TPMOsscGzyrOoIKQrkYzV4bDfhlkZZYuP/6tdrn95HAfRAoGBAI9i\n0bK8Vhifeeo/q3k82xqPgEsyShfsqoR/CQpisldJ7sE/Li4TwLAR0cdF2FBvwaSq\nKqCb0nNZJrH6HJVH1jgaiTi3F5UPjYv5KwieZfAlzKMThojb2MskjbMo3tHA1lI1\n2Hq8u7xZ4By31qYLWYE/Ja8F/BZX3CNLnF7WVM1xAoGBAOiBdoB4GGyFGcmd/txn\nTiZUApEjY0zq2HWBqzaYqAQzgzi+4oy9FUQfGPp0m/D7MS1KfW5Ztr9ctfrb+omo\nnUOZsljhKOZRyoP9xL2e+kMYzG6gE7o/saDywoFrUcsW2nymnOLu5IQSVpxTvFM1\ne68wqjeSy8nwqfpiji0r6IQM\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@cf-referidos.iam.gserviceaccount.com",
  client_id: "104634457874077255626",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40cf-referidos.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

const json = JSON.stringify(serviceAccount);
const base64 = Buffer.from(json, "utf-8").toString("base64");

fs.writeFileSync("vercel-key.env", `FIREBASE_SERVICE_ACCOUNT_BASE64=${base64}\n`);

console.log("Listo, se creó vercel-key.env");