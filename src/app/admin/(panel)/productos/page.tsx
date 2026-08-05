import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { obtenerCategorias, obtenerProductosAdmin } from "@/server/catalogo";
import { exigirGrupo } from "@/server/sesion";
import { TablaProductos } from "@/components/admin/TablaProductos";
import { CabeceraModulo } from "@/components/admin/Piezas";
import { Boton } from "@/components/ui/Boton";

export const metadata: Metadata = { title: "Productos" };

export default async function AdminProductos() {
  await exigirGrupo("Catálogo");

  const [productos, categorias] = await Promise.all([
    obtenerProductosAdmin(),
    obtenerCategorias(),
  ]);

  const deSnacks = categorias.filter((c) =>
    ["dureza-suave", "dureza-media", "larga-duracion"].includes(c.slug),
  );

  return (
    <>
      <CabeceraModulo
        titulo="Productos"
        texto="Crea, edita, activa o desactiva cualquier producto. Los cambios se ven al instante en la tienda."
        acciones={
          <Boton href="/admin/productos/nuevo" variante="primario" medida="sm">
            <Plus className="h-3.5 w-3.5" />
            Nuevo producto
          </Boton>
        }
      />

      <TablaProductos productos={productos} categorias={deSnacks} />
    </>
  );
}
