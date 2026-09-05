"use client";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function BotonLogout() {
  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);
    router.push("/login");
  }

  return (
    <button onClick={handleLogout} className="text-sm text-gray-500 underline">
      Cerrar sesión
    </button>
  );
}