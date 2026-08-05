import type { Metadata } from "next";
import { obtenerBanners } from "@/server/contenido";
import { exigirGrupo } from "@/server/sesion";
import { PanelBanners } from "@/components/admin/PanelBanners";
import { CabeceraModulo } from "@/components/admin/Piezas";

export const metadata: Metadata = { title: "Banners" };

export default async function AdminBanners() {
  await exigirGrupo("Contenido");
  const banners = await obtenerBanners();

  return (
    <>
      <CabeceraModulo
        titulo="Banners"
        texto="Imágenes, títulos y botones de las piezas destacadas del sitio, con fechas de vigencia."
      />
      <PanelBanners banners={banners} />
    </>
  );
}
