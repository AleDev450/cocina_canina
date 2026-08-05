import type { Metadata } from "next";
import { obtenerTestimonios } from "@/server/contenido";
import { exigirGrupo } from "@/server/sesion";
import { PanelTestimonios } from "@/components/admin/PanelTestimonios";
import { CabeceraModulo } from "@/components/admin/Piezas";

export const metadata: Metadata = { title: "Testimonios" };

export default async function AdminTestimonios() {
  await exigirGrupo("Contenido");
  const testimonios = await obtenerTestimonios(false);

  return (
    <>
      <CabeceraModulo
        titulo="Testimonios"
        texto="Reseñas de clientes con la foto de su mascota. Solo se muestran en la web las publicadas."
      />
      <PanelTestimonios testimonios={testimonios} />
    </>
  );
}
