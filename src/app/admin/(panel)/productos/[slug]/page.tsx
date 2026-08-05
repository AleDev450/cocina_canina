import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { clienteServidor } from "@/lib/supabase/servidor";
import { obtenerCategorias, obtenerProducto } from "@/server/catalogo";
import { exigirGrupo } from "@/server/sesion";
import { EditorProducto } from "@/components/admin/EditorProducto";
import { PanelPresentaciones } from "@/components/admin/PanelPresentaciones";
import { CabeceraModulo } from "@/components/admin/Piezas";

export const metadata: Metadata = { title: "Editar producto" };

export default async function EditarProducto({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await exigirGrupo("Catálogo");
  const { slug } = await params;

  const producto = await obtenerProducto(slug);
  if (!producto) notFound();

  const supabase = await clienteServidor();
  const { data: fila } = await supabase
    .from("productos")
    .select("id, activo, presentaciones ( id, codigo, etiqueta, tipo, precio, stock, orden )")
    .eq("slug", slug)
    .single();

  if (!fila) notFound();

  const categorias = await obtenerCategorias();

  const presentaciones = (
    (fila.presentaciones ?? []) as Array<{
      id: string;
      codigo: string;
      etiqueta: string;
      tipo: string;
      precio: number;
      stock: number;
      orden: number;
    }>
  )
    .sort((a, b) => a.orden - b.orden)
    .map((v) => ({ ...v, precio: Number(v.precio) }));

  return (
    <>
      <CabeceraModulo
        titulo={producto.nombre}
        texto={`/productos/${producto.slug}`}
        acciones={
          <Link
            href={`/productos/${producto.slug}`}
            target="_blank"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-petroleo-700/15 px-4 text-xs font-semibold text-petroleo-800 transition-colors hover:border-petroleo-700/40"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Ver en la tienda
          </Link>
        }
      />

      <div className="mb-6">
        <PanelPresentaciones productoId={fila.id} presentaciones={presentaciones} />
      </div>

      <EditorProducto
        producto={{ ...producto, id: fila.id, activo: fila.activo }}
        categorias={categorias.filter((c) => c.slug !== "barf" && c.slug !== "por-mayor")}
      />
    </>
  );
}
