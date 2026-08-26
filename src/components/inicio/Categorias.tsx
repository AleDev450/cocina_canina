import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Categoria } from "@/lib/tipos";

import { CabeceraSeccion } from "@/components/ui/Elementos";
import { Hoja, Hueso, Huella, Olla, Plato } from "@/components/ui/Iconos";
import { cx } from "@/lib/formato";

const ICONO = { suave: Hoja, media: Huella, larga: Hueso, barf: Olla, mayor: Plato };

const ACENTO: Record<string, { fondo: string; icono: string; borde: string }> = {
  hoja: { fondo: "bg-hoja-100", icono: "text-hoja-600", borde: "group-hover:border-hoja-500/40" },
  ambar: { fondo: "bg-ambar-100", icono: "text-ambar-500", borde: "group-hover:border-ambar-500/40" },
  coral: { fondo: "bg-coral-100", icono: "text-coral-500", borde: "group-hover:border-coral-500/40" },
  petroleo: { fondo: "bg-petroleo-100", icono: "text-petroleo-700", borde: "group-hover:border-petroleo-500/40" },
  naranja: { fondo: "bg-naranja-100", icono: "text-naranja-600", borde: "group-hover:border-naranja-500/40" },
};

const DESTINO: Record<string, string> = {
  barf: "/barf",
  "por-mayor": "/por-mayor",
};

/** Las tres primeras ocupan una fila; BARF y por mayor van más anchas abajo. */
const AMPLITUD = ["lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3", "lg:col-span-3"];

export function Categorias({
  categorias,
  conteos,
}: {
  categorias: Categoria[];
  conteos: Record<string, number>;
}) {
  return (
    <section id="categorias" className="bg-crema-50 py-16 md:py-24">
      <div className="contenedor">
        <CabeceraSeccion
          antetitulo="Nuestro catálogo"
          titulo="Todo el catálogo, por categoría"
          texto="Cada categoría responde a una necesidad distinta: premiar sin engordar, entretener por horas o cubrir la alimentación completa del día."
          accion={
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-naranja-600 transition-colors hover:text-naranja-700"
            >
              Ver todos los productos
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {categorias.map((cat, i) => {
            const Icono = ICONO[cat.icono];
            const acento = ACENTO[cat.acento];
            const destino = DESTINO[cat.slug] ?? `/productos?categoria=${cat.slug}`;
            const total = conteos[cat.slug] ?? 0;

            return (
              <Link
                key={cat.slug}
                href={destino}
                className={cx(
                  "group relative flex flex-col overflow-hidden rounded-3xl border border-petroleo-700/10 bg-white p-6",
                  "transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-tarjeta",
                  acento.borde,
                  AMPLITUD[i],
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={cx(
                      "grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110",
                      acento.fondo,
                      acento.icono,
                    )}
                  >
                    <Icono
                      className={cat.icono === "larga" ? "h-6 w-6" : "h-[1.375rem] w-[1.375rem]"}
                    />
                  </span>
                  <span className="rounded-full bg-crema-100 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-grafito">
                    {total} {total === 1 ? "producto" : "productos"}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-xl font-semibold leading-tight text-petroleo-900">
                  {cat.nombre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-grafito">
                  {cat.descripcion}
                </p>

                <div className="mt-5 flex items-end justify-between gap-3 pt-1">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-naranja-600">
                    Ver categoría
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                  <Image
                    src={cat.imagen}
                    alt=""
                    width={280}
                    height={280}
                    className="h-20 w-20 shrink-0 object-contain drop-shadow-[0_12px_14px_rgba(8,54,59,0.18)] transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
