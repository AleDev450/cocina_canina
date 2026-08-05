import type { Metadata } from "next";
import { obtenerCategoriasAdmin } from "@/server/catalogo";
import { exigirGrupo } from "@/server/sesion";
import { PanelCategorias } from "@/components/admin/PanelCategorias";
import { CabeceraModulo } from "@/components/admin/Piezas";

export const metadata: Metadata = { title: "Categorías" };

export default async function AdminCategorias() {
  await exigirGrupo("Catálogo");
  const categorias = await obtenerCategoriasAdmin();

  return (
    <>
      <CabeceraModulo
        titulo="Categorías"
        texto="Crea, ordena y oculta las categorías del catálogo."
      />
      <PanelCategorias categorias={categorias} />
    </>
  );
}
