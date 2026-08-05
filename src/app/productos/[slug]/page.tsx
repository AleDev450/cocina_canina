import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { obtenerProducto, precioDesde, productos } from "@/data/productos";
import { obtenerCategoria } from "@/data/categorias";
import { FichaProducto } from "@/components/producto/FichaProducto";
import { TarjetaProducto } from "@/components/producto/TarjetaProducto";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { CabeceraSeccion } from "@/components/ui/Elementos";
import { precio } from "@/lib/formato";

export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const producto = obtenerProducto(slug);
  if (!producto) return { title: "Producto no encontrado" };

  return {
    title: producto.nombre,
    description: `${producto.descripcion} Desde ${precio(precioDesde(producto))}.`,
    openGraph: {
      title: `${producto.nombre} · La Cocina Canina`,
      description: producto.beneficioPrincipal,
      images: [producto.imagen],
    },
  };
}

export default async function PaginaProducto({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const producto = obtenerProducto(slug);
  if (!producto) notFound();

  const categoria = obtenerCategoria(producto.categoria);
  const relacionados = producto.relacionados
    .map((s) => obtenerProducto(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <CabeceraPagina
        antetitulo={categoria?.nombre}
        titulo={producto.nombre}
        migajas={[
          { nombre: "Inicio", href: "/" },
          { nombre: "Productos", href: "/productos" },
          ...(categoria
            ? [{ nombre: categoria.nombre, href: `/productos?categoria=${categoria.slug}` }]
            : []),
          { nombre: producto.nombre },
        ]}
      />

      <FichaProducto producto={producto} />

      {relacionados.length > 0 ? (
        <section className="bg-crema-50 py-16 md:py-20">
          <div className="contenedor">
            <CabeceraSeccion
              antetitulo="También le puede gustar"
              titulo="Productos relacionados"
            />
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((p) => (
                <TarjetaProducto key={p.slug} producto={p} compacta />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
