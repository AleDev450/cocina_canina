import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { obtenerCategorias, obtenerProducto, obtenerProductos } from "@/server/catalogo";
import { obtenerConfiguracion } from "@/server/contenido";
import { obtenerRegla } from "@/server/recompensas";
import { FichaProducto } from "@/components/producto/FichaProducto";
import { TarjetaProducto } from "@/components/producto/TarjetaProducto";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { CabeceraSeccion } from "@/components/ui/Elementos";
import { precioDesde } from "@/lib/precio";
import { precio } from "@/lib/formato";
import { hayConexion } from "@/lib/supabase/entorno";
import { SinConexion } from "@/components/layout/SinConexion";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const producto = await obtenerProducto(slug);
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
  } catch {
    return { title: "Producto" };
  }
}

export default async function PaginaProducto({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!hayConexion) return <SinConexion />;

  const { slug } = await params;

  const producto = await obtenerProducto(slug);
  if (!producto) notFound();

  const [categorias, todos, config, regla] = await Promise.all([
    obtenerCategorias(),
    obtenerProductos(),
    obtenerConfiguracion(),
    obtenerRegla(),
  ]);

  const categoria = categorias.find((c) => c.slug === producto.categoria);

  // Relacionados explícitos; si no hay, se completa con la misma categoría.
  const explicitos = todos.filter((p) => producto.relacionados.includes(p.slug));
  const relacionados =
    explicitos.length > 0
      ? explicitos
      : todos
          .filter((p) => p.categoria === producto.categoria && p.slug !== producto.slug)
          .slice(0, 3);

  return (
    <>
      <CabeceraPagina
        antetitulo={categoria?.nombre}
        titulo={producto.nombre}
        migajas={[
          { nombre: "Inicio", href: "/" },
          { nombre: "Productos", href: "/productos" },
          ...(categoria
            ? [
                {
                  nombre: categoria.nombre,
                  href: `/productos?categoria=${categoria.slug}`,
                },
              ]
            : []),
          { nombre: producto.nombre },
        ]}
      />

      <FichaProducto
        producto={producto}
        whatsapp={config.contacto.whatsapp}
        regla={regla}
      />

      {relacionados.length > 0 ? (
        <section className="bg-crema-50 py-16 md:py-20">
          <div className="contenedor">
            <CabeceraSeccion
              antetitulo="También le puede gustar"
              titulo="Productos relacionados"
            />
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.slice(0, 3).map((p) => (
                <TarjetaProducto key={p.slug} producto={p} compacta />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
