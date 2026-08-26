import Image from "next/image";
import { ArrowRight, Calculator, Snowflake } from "lucide-react";
import type { ProductoBarf } from "@/lib/tipos";
import { precio } from "@/lib/formato";
import { Boton } from "@/components/ui/Boton";
import { Antetitulo } from "@/components/ui/Elementos";
import { Onda } from "@/components/ui/Iconos";

const ACENTO: Record<string, string> = {
  coral: "bg-coral-500",
  petroleo: "bg-petroleo-500",
  ambar: "bg-ambar-500",
};

export function BarfInicio({ productosBarf }: { productosBarf: ProductoBarf[] }) {
  return (
    <section id="barf" className="relative bg-petroleo-800 text-white">
      <Onda className="block h-8 w-full text-white md:h-12" invertida />

      <div className="patron-huellas-claro">
        <div className="contenedor pb-20 pt-6 md:pb-28">
          <div className="grid items-end gap-8 md:grid-cols-[1.15fr_auto]">
            <div className="max-w-2xl">
              <Antetitulo>Alimentación BARF</Antetitulo>
              <h2 className="mt-4 titulo-seccion text-white">
                Alimentación natural diseñada para ellos
              </h2>
              <p className="mt-5 leading-relaxed text-petroleo-100">
                Una dieta fresca y balanceada que respeta las necesidades biológicas de
                tu mascota y contribuye a mejorar su bienestar y calidad de vida.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Boton href="/barf" variante="primario" medida="lg">
                Ver planes BARF
                <ArrowRight className="h-4 w-4" />
              </Boton>
              <Boton
                href="/barf#calculador"
                variante="contornoClaro"
                medida="lg"
              >
                <Calculator className="h-4 w-4" />
                Calcular ración
              </Boton>
            </div>
          </div>

          {/* Dante junto a su ración servida: ocupa la segunda columna del
              grid, que hasta ahora quedaba vacía en pantallas anchas. */}
          <Image
            src="/images/dante/plato_lleno.png"
            alt="Dante sentado junto a un plato servido con alimentación BARF"
            width={1261}
            height={1101}
            loading="lazy"
            sizes="(max-width: 767px) 70vw, 340px"
            className="mx-auto mt-8 h-auto w-56 object-contain drop-shadow-[0_24px_28px_rgba(2,34,38,0.45)] md:mt-0 md:w-full md:max-w-[21rem]"
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {productosBarf.map((p) => (
              <article
                key={p.slug}
                className="group relative overflow-hidden rounded-3xl bg-white/8 p-6 ring-1 ring-white/12 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/12"
              >
                <span
                  className={`absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full opacity-30 blur-2xl ${ACENTO[p.color]}`}
                  aria-hidden="true"
                />

                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-xl font-semibold leading-tight">
                    {p.nombre}
                  </h3>
                  <Image
                    src={p.imagen}
                    alt=""
                    width={300}
                    height={150}
                    className="h-14 w-auto shrink-0 object-contain drop-shadow-[0_10px_12px_rgba(2,34,38,0.4)] transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <p className="mt-3 text-sm leading-relaxed text-petroleo-100">
                  {p.descripcion}
                </p>

                <dl className="mt-5 space-y-1.5 border-t border-white/12 pt-4 text-sm">
                  {p.rangos.map((r) => (
                    <div
                      key={r.desde}
                      className="flex items-center justify-between gap-3"
                    >
                      <dt className="text-petroleo-100">
                        {r.hasta === null
                          ? `${r.desde} kg a más`
                          : `${r.desde} kg a ${r.hasta} kg`}
                      </dt>
                      <dd className="font-semibold text-white">
                        {precio(r.precioKg)}
                        <span className="ml-1 text-xs font-normal text-petroleo-100">
                          / kg
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>

          <p className="mt-7 flex items-center justify-center gap-2 text-xs text-petroleo-100">
            <Snowflake className="h-4 w-4 text-naranja-400" />
            Se entrega congelado. Descongela en refrigeradora la noche anterior y
            consume dentro de las 48 horas siguientes.
          </p>
        </div>
      </div>

      <Onda className="block h-8 w-full text-crema-50 md:h-12" />
    </section>
  );
}
