import Image from "next/image";
import { ArrowRight, Gift, History, Sparkles } from "lucide-react";
import type { Recompensa, ReglaPuntos } from "@/lib/tipos";

import { precio } from "@/lib/formato";
import { Boton } from "@/components/ui/Boton";
import { Antetitulo } from "@/components/ui/Elementos";
import { Huella } from "@/components/ui/Iconos";

export function ClubPuntos({
  regla,
  recompensas,
  puntos,
  nombre,
}: {
  regla: ReglaPuntos;
  recompensas: Recompensa[];
  puntos: number;
  nombre: string;
}) {
  const reglaPuntos = regla;
  const siguiente = [...recompensas]
    .sort((a, b) => a.puntos - b.puntos)
    .find((r) => r.puntos > puntos);
  const faltan = siguiente ? siguiente.puntos - puntos : 0;
  const progreso = siguiente ? Math.round((puntos / siguiente.puntos) * 100) : 100;

  return (
    <section id="recompensas" className="bg-crema-50 py-16 md:py-24">
      <div className="contenedor">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* Texto */}
          <div>
            <Antetitulo>Club Cocina Canina</Antetitulo>
            <h2 className="mt-4 titulo-seccion text-petroleo-900">
              Cada compra suma para el siguiente premio
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-grafito">
              Por cada{" "}
              <strong className="font-semibold text-petroleo-900">
                S/ {reglaPuntos.montoPorPunto.toFixed(2)}
              </strong>{" "}
              de compra ganas{" "}
              <strong className="font-semibold text-petroleo-900">
                {reglaPuntos.puntosOtorgados} punto
              </strong>
              . Canjéalos por descuentos, envíos gratis o snacks de regalo. Sin costo,
              sin letra chica y con campañas de puntos dobles durante el año.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {recompensas.slice(0, 4).map((r) => (
                <li
                  key={r.id}
                  className="flex items-center gap-3 rounded-2xl border border-petroleo-700/10 bg-white px-4 py-3"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-naranja-50 text-naranja-600">
                    <Gift className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-petroleo-900">
                      {r.nombre}
                    </span>
                    <span className="block text-xs text-grafito">{r.puntos} puntos</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Boton href="/recompensas" variante="primario" medida="lg">
                Ver mis recompensas
                <ArrowRight className="h-4 w-4" />
              </Boton>
              <Boton href="/registro" variante="contorno" medida="lg">
                Crear mi cuenta gratis
              </Boton>
            </div>
          </div>

          {/* Tarjeta de puntos */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-blob bg-petroleo-800 p-8 text-white shadow-elevada md:p-10">
              <div className="absolute inset-0 patron-huellas-claro" aria-hidden="true" />
              <div
                className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-naranja-500/25 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-naranja-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Club Cocina Canina
                </div>

                <p className="mt-6 font-display text-2xl font-medium">
                  Hola, {nombre}
                </p>
                <p className="mt-1 font-display text-[3.4rem] font-semibold leading-none">
                  {puntos}
                  <span className="ml-2 text-lg font-normal text-petroleo-100">
                    puntos
                  </span>
                </p>

                {siguiente ? (
                  <div className="mt-7">
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="text-petroleo-100">
                        Siguiente recompensa:{" "}
                        <strong className="font-semibold text-white">
                          {siguiente.nombre}
                        </strong>
                      </span>
                      <span className="shrink-0 font-semibold text-naranja-300">
                        {siguiente.puntos} pts
                      </span>
                    </div>

                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/15">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-naranja-400 to-naranja-500 transition-all duration-700"
                        style={{ width: `${progreso}%` }}
                      />
                    </div>
                    <p className="mt-2.5 text-sm text-petroleo-100">
                      Te faltan{" "}
                      <strong className="font-semibold text-white">{faltan} puntos</strong>{" "}
                      — cerca de {precio(faltan * reglaPuntos.montoPorPunto)} en compras.
                    </p>
                  </div>
                ) : null}

                <div className="mt-8 flex flex-wrap gap-2.5">
                  <Boton href="/recompensas" variante="primario" medida="sm">
                    Canjear puntos
                  </Boton>
                  <Boton href="/cuenta/recompensas" variante="contornoClaro" medida="sm">
                    <History className="h-3.5 w-3.5" />
                    Ver historial
                  </Boton>
                </div>
              </div>
            </div>

            {/* Mascota asomándose */}
            <Image
              src="/images/dante/alegre.png"
              alt=""
              width={624}
              height={1300}
              loading="lazy"
              sizes="208px"
              className="pointer-events-none absolute -bottom-6 -right-3 h-40 w-auto object-contain drop-shadow-[0_18px_20px_rgba(2,34,38,0.3)] md:h-52 lg:-right-8"
            />
            <span
              className="absolute -left-4 -top-4 grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-tarjeta"
              aria-hidden="true"
            >
              <Huella className="h-6 w-6 text-naranja-500" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
