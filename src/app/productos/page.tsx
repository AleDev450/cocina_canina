import type { Metadata } from "next";
import { Catalogo } from "@/components/producto/Catalogo";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { obtenerCategoria } from "@/data/categorias";

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
  const { categoria } = await searchParams;
  const info = categoria ? obtenerCategoria(categoria) : undefined;

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

      <Catalogo categoriaInicial={info?.slug} />
    </>
  );
}
