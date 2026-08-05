import type { Metadata } from "next";
import { FormularioAdmin } from "@/components/auth/FormularioAdmin";

export const metadata: Metadata = {
  title: "Entrar al panel",
  robots: { index: false, follow: false },
};

export default async function IngresarAdmin({
  searchParams,
}: {
  searchParams: Promise<{ siguiente?: string; error?: string }>;
}) {
  const { siguiente, error } = await searchParams;
  return <FormularioAdmin siguiente={siguiente} error={error} />;
}
