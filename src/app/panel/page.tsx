"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

export default function PanelRedirectPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (isAdmin) {
      router.push("/admin");
    } else {
      router.push("/panel/referido");
    }
  }, [user, isAdmin, loading, router]);

  return <p className="text-center mt-10">Cargando...</p>;
}