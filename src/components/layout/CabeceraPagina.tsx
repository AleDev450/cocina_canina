import Image from "next/image";
import type { ReactNode } from "react";
import { Migajas } from "@/components/ui/Elementos";
import { Huella, Onda } from "@/components/ui/Iconos";

/** Banda superior común a las páginas internas. */
export function CabeceraPagina({
  antetitulo,
  titulo,
  texto,
  migajas,
  acciones,
  pose,
  imagen,
}: {
  antetitulo?: string;
  titulo: string;
  texto?: string;
  migajas: Array<{ nombre: string; href?: string }>;
  acciones?: ReactNode;
  pose?: "sentado" | "mirada" | "saltando";
  /** Foto propia en lugar de la pose por defecto (p. ej. una de Dante). */
  imagen?: { src: string; ancho: number; alto: number; alt?: string };
}) {
  const foto = imagen ?? (pose ? { src: `/mascota/${pose}.png`, ancho: 733, alto: 1100 } : null);
  return (
    <section className="relative isolate overflow-hidden bg-petroleo-800 text-white">
      <div className="absolute inset-0 patron-huellas-claro" aria-hidden="true" />
      <div
        className="absolute -right-32 -top-40 h-96 w-96 rounded-full bg-naranja-500/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="contenedor relative pb-16 pt-8 md:pb-20">
        <div className="[&_a:hover]:text-naranja-300 [&_a]:text-petroleo-100 [&_li>span]:text-white [&_nav]:text-petroleo-100">
          <Migajas items={migajas} />
        </div>

        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {antetitulo ? (
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-naranja-300">
                <Huella className="h-3.5 w-3.5" />
                {antetitulo}
              </span>
            ) : null}
            <h1 className="mt-4 font-display text-[clamp(2.1rem,1.5rem+2.6vw,3.4rem)] font-semibold leading-[1.06]">
              {titulo}
            </h1>
            {texto ? (
              <p className="mt-4 max-w-xl leading-relaxed text-petroleo-100">{texto}</p>
            ) : null}
          </div>

          {acciones ? <div className="shrink-0">{acciones}</div> : null}

          {foto && !acciones ? (
            <Image
              src={foto.src}
              alt={imagen?.alt ?? ""}
              width={foto.ancho}
              height={foto.alto}
              sizes="208px"
              className="hidden h-44 w-auto shrink-0 self-end object-contain drop-shadow-[0_20px_24px_rgba(2,34,38,0.4)] md:block lg:h-52"
            />
          ) : null}
        </div>
      </div>

      {/* La ola va rellena del color del contenido que viene debajo. El área
          de la página hereda el fondo del body (marfil), no crema-50: con el
          color anterior quedaba una franja clara de ~19px bajo la cabecera. */}
      <Onda className="block h-8 w-full text-crema-100 md:h-10" />
    </section>
  );
}
