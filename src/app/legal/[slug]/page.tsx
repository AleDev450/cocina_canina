import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { legales, obtenerLegal } from "@/data/legales";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { fechaLarga } from "@/lib/formato";

export function generateStaticParams() {
  return legales.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const legal = obtenerLegal(slug);
  if (!legal) return { title: "Documento no encontrado" };
  return { title: legal.titulo, description: legal.resumen };
}

export default async function PaginaLegal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const legal = obtenerLegal(slug);
  if (!legal) notFound();

  return (
    <>
      <CabeceraPagina
        antetitulo="Información legal"
        titulo={legal.titulo}
        texto={legal.resumen}
        migajas={[{ nombre: "Inicio", href: "/" }, { nombre: legal.titulo }]}
      />

      <div className="contenedor grid gap-10 py-14 lg:grid-cols-[15rem_1fr] lg:items-start">
        {/* Índice */}
        <nav aria-label="Otros documentos" className="lg:sticky lg:top-28">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-grafito">
            Documentos
          </p>
          <ul className="space-y-1">
            {legales.map((l) => (
              <li key={l.slug}>
                <Link
                  href={`/legal/${l.slug}`}
                  className={
                    l.slug === legal.slug
                      ? "block rounded-xl bg-petroleo-700 px-3.5 py-2.5 text-sm font-semibold text-white"
                      : "block rounded-xl px-3.5 py-2.5 text-sm font-medium text-grafito transition-colors hover:bg-crema-100 hover:text-petroleo-800"
                  }
                >
                  {l.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contenido */}
        <article className="max-w-3xl rounded-3xl border border-petroleo-700/10 bg-white p-7 md:p-10">
          <p className="text-xs text-grafito">
            Última actualización: {fechaLarga(legal.actualizado)}
          </p>

          <div className="mt-8 space-y-9">
            {legal.secciones.map((s) => (
              <section key={s.titulo}>
                <h2 className="font-display text-xl font-semibold text-petroleo-900">
                  {s.titulo}
                </h2>
                <div className="mt-3 space-y-3">
                  {s.parrafos.map((p) => (
                    <p key={p} className="leading-relaxed text-grafito">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </>
  );
}
