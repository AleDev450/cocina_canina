import type { Metadata } from "next";
import { Catalogo } from "@/components/producto/Catalogo";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { obtenerCategorias, obtenerProductos } from "@/server/catalogo";
import { hayConexion } from "@/lib/supabase/entorno";
import { SinConexion } from "@/components/layout/SinConexion";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Snacks deshidratados de ingrediente único para perros: dureza suave, media y larga duración. Filtra por proteína, tamaño, edad y precio.",
};

export default async function PaginaProductos({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  if (!hayConexion) return <SinConexion />;

  const { categoria } = await searchParams;

  const [productos, categorias] = await Promise.all([
    obtenerProductos(),
    obtenerCategorias(),
  ]);

  const info = categoria ? categorias.find((c) => c.slug === categoria) : undefined;

  return (
    <>
      <CabeceraPagina
        antetitulo="Catálogo"
        titulo={info ? info.nombre : "Todos nuestros snacks"}
        texto={
          info
            ? info.descripcion
            : "Un solo ingrediente por snack, deshidratado lento y sin conservantes. Filtra por dureza, proteína o el tamaño de tu perro para encontrar el indicado."
        }
        migajas={[
          { nombre: "Inicio", href: "/" },
          ...(info
            ? [{ nombre: "Productos", href: "/productos" }, { nombre: info.nombre }]
            : [{ nombre: "Productos" }]),
        ]}
        pose="mirada"
      />

      <Catalogo
        productos={productos}
        categorias={categorias}
        categoriaInicial={info?.slug}
      />
    </>
  );
}
