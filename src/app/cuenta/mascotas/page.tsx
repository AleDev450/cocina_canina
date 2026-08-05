import type { Metadata } from "next";
import { misMascotas } from "@/server/clientes";
import { PanelMascotas } from "@/components/cuenta/PanelMascotas";

export const metadata: Metadata = { title: "Mis mascotas" };

export default async function PaginaMascotas() {
  const mascotas = await misMascotas();
  return <PanelMascotas mascotas={mascotas} />;
}
