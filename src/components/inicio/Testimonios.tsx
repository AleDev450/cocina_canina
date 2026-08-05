"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonios } from "@/data/contenido";
import { AvatarMascota, CabeceraSeccion, Estrellas } from "@/components/ui/Elementos";

export function Testimonios() {
  const pista = useRef<HTMLDivElement>(null);

  const mover = (direccion: 1 | -1) => {
    const nodo = pista.current;
    if (!nodo) return;
    nodo.scrollBy({ left: direccion * (nodo.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="contenedor">
        <CabeceraSeccion
          antetitulo="Testimonios"
          titulo="Colitas felices, clientes felices"
          texto="Lo que nos cuentan quienes ya cambiaron los premios industriales por snacks de un solo ingrediente."
          accion={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => mover(-1)}
                aria-label="Testimonios anteriores"
                className="grid h-11 w-11 place-items-center rounded-full border border-petroleo-700/15 text-petroleo-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-naranja-500 hover:text-naranja-600"
              >
                <ChevronLeft className="h-[1.125rem] w-[1.125rem]" />
              </button>
              <button
                type="button"
                onClick={() => mover(1)}
                aria-label="Testimonios siguientes"
                className="grid h-11 w-11 place-items-center rounded-full border border-petroleo-700/15 text-petroleo-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-naranja-500 hover:text-naranja-600"
              >
                <ChevronRight className="h-[1.125rem] w-[1.125rem]" />
              </button>
            </div>
          }
        />
      </div>

      <div
        ref={pista}
        className="sin-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-3 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {testimonios.map((t) => (
          <figure
            key={t.id}
            className="relative flex w-[19rem] shrink-0 snap-start flex-col rounded-3xl border border-petroleo-700/10 bg-crema-50 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-tarjeta sm:w-[21rem]"
          >
            <Quote
              className="absolute right-5 top-5 h-8 w-8 text-naranja-100"
              aria-hidden="true"
            />
            <Estrellas valor={t.calificacion} />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-grafito">
              «{t.comentario}»
            </blockquote>

            <figcaption className="mt-6 flex items-center gap-3 border-t border-petroleo-700/10 pt-4">
              <AvatarMascota nombre={t.mascota} foto={t.foto} className="h-12 w-12" />
              <div className="min-w-0">
                <p className="truncate font-display text-base font-semibold text-petroleo-900">
                  {t.mascota}
                </p>
                <p className="truncate text-xs text-grafito">
                  con {t.dueno} · {t.producto}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
