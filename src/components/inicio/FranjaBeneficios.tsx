import Image from "next/image";
import { hero as heroPorDefecto } from "@/data/sitio";

/**
 * Los cuatro sellos de la marca, justo bajo el hero.
 *
 * Los rótulos salen del CMS (bloque "hero"), así que el equipo puede
 * reescribirlos sin tocar código. Los íconos son los PNG oficiales de la marca:
 * mismo trazo y mismo peso visual, sin mezclar estilos ni usar emojis.
 *
 * El bloque del CMS identifica cada sello con una clave (`hoja`, `escudo`,
 * `hueso`, `chef`); aquí se traduce a su PNG. Si algún día llega una clave
 * nueva, cae en `carita` en vez de romper la página.
 */
const ICONOS: Record<string, { src: string; alt: string }> = {
  hoja: { src: "/icons/beneficios/carne.png", alt: "" }, // 100% naturales · ingrediente único
  escudo: { src: "/icons/beneficios/mano.png", alt: "" }, // sin conservantes ni colorantes
  hueso: { src: "/icons/beneficios/huesito.png", alt: "" }, // textura y dureza
  chef: { src: "/icons/beneficios/carita.png", alt: "" }, // para perros de todas las edades
};

const RESERVA = { src: "/icons/beneficios/carita.png", alt: "" };

export function FranjaBeneficios({
  beneficios = heroPorDefecto.beneficios,
}: {
  beneficios?: typeof heroPorDefecto.beneficios;
}) {
  if (!beneficios.length) return null;

  return (
    <section className="relative -mt-6 bg-crema-50 pb-4 md:-mt-8">
      <div className="contenedor">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[22px] bg-crema-200 shadow-suave lg:grid-cols-4">
          {beneficios.map((b) => {
            const icono = ICONOS[b.icono] ?? RESERVA;
            return (
              <li
                key={b.titulo}
                className="flex flex-col items-center gap-2.5 bg-white px-4 py-6 text-center md:py-7"
              >
                <Image
                  src={icono.src}
                  alt={icono.alt}
                  width={256}
                  height={256}
                  loading="lazy"
                  sizes="48px"
                  aria-hidden="true"
                  className="h-10 w-10 object-contain md:h-12 md:w-12"
                />
                <span className="text-[0.82rem] font-bold leading-snug text-petroleo-900 md:text-sm">
                  {b.titulo}
                </span>
                <span className="text-xs leading-snug text-grafito">{b.detalle}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
