import type { Metadata } from "next";
import { obtenerCategorias } from "@/server/catalogo";
import { exigirGrupo } from "@/server/sesion";
import { EditorProducto } from "@/components/admin/EditorProducto";
import { CabeceraModulo } from "@/components/admin/Piezas";

export const metadata: Metadata = { title: "Nuevo producto" };

export default async function NuevoProducto() {
  await exigirGrupo("Catálogo");
  const categorias = await obtenerCategorias();

  return (
    <>
      <CabeceraModulo
        titulo="Nuevo producto"
        texto="Al crearlo pasarás a su ficha para agregarle presentaciones y precios."
      />
      <EditorProducto
        categorias={categorias.filter((c) => c.slug !== "barf" && c.slug !== "por-mayor")}
      />
    </>
  );
}
