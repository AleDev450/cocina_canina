import type { Metadata } from "next";
import { misDirecciones } from "@/server/clientes";
import { PanelDirecciones } from "@/components/cuenta/PanelDirecciones";

export const metadata: Metadata = { title: "Direcciones" };

export default async function PaginaDirecciones() {
  const direcciones = await misDirecciones();
  return <PanelDirecciones direcciones={direcciones} />;
}
