import type { Metadata } from "next";
import Image from "next/image";
import { Gift, History, ShoppingBag, Sparkles, UserPlus } from "lucide-react";
import {
  historialPuntos,
  nombreEstadoPuntos,
  reglaPuntos,
  siguienteRecompensa,
} from "@/data/recompensas";
import { clienteDemo, cuponesDemo } from "@/data/cuenta";
import { CatalogoRecompensas, HistorialPuntos } from "@/components/recompensas/Piezas";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { Boton } from "@/components/ui/Boton";
import { CabeceraSeccion, Pastilla } from "@/components/ui/Elementos";
import { fechaCorta, precio } from "@/lib/formato";

export const metadata: Metadata = {
  title: "Club Cocina Canina",
  description:
    "Acumula puntos con cada compra y canjéalos por descuentos, envíos gratis y snacks de regalo.",
};

const PASOS = [
  {
    icono: UserPlus,
    titulo: "Crea tu cuenta",
    texto: "El registro es gratuito y te da 20 puntos de bienvenida.",
  },
  {
    icono: ShoppingBag,
    titulo: "Compra normalmente",
    texto: `Por cada S/ ${reglaPuntos.montoPorPunto.toFixed(2)} ganas ${reglaPuntos.puntosOtorgados} punto, en la web o por WhatsApp.`,
  },
  {
    icono: Gift,
    titulo: "Canjea tu premio",
    texto: "Descuentos, envío gratis, productos o regalos sorpresa.",
  },
];

export default function PaginaRecompensas() {
  const puntos = clienteDemo.puntos;
  const siguiente = siguienteRecompensa(puntos);
  const faltan = siguiente ? siguiente.puntos - puntos : 0;
  const progreso = siguiente ? Math.round((puntos / siguiente.puntos) * 100) : 100;

  const resumen = (["pendiente", "disponible", "canjeado", "vencido"] as const).map(
    (estado) => ({
      estado,
      total: historialPuntos
        .filter((m) => m.estado === estado)
        .reduce((t, m) => t + Math.abs(m.puntos), 0),
    }),
  );

  return (
    <>
      <CabeceraPagina
        antetitulo="Programa de fidelización"
        titulo="Club Cocina Canina"
        texto={`Por cada S/ ${reglaPuntos.montoPorPunto.toFixed(2)} de compra ganas ${reglaPuntos.puntosOtorgados} punto. Sin costo de membresía y con campañas de puntos dobles durante el año.`}
        migajas={[{ nombre: "Inicio", href: "/" }, { nombre: "Recompensas" }]}
        pose="saltando"
      />

      {/* Estado de la cuenta */}
      <section className="py-14">
        <div className="contenedor">
          <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
            <div className="relative overflow-hidden rounded-blob bg-petroleo-800 p-8 text-white md:p-10">
              <div className="absolute inset-0 patron-huellas-claro" aria-hidden="true" />
              <div
                className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-naranja-500/25 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-naranja-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Tu cuenta
                </span>
                <p className="mt-5 font-display text-2xl">Hola, {clienteDemo.nombres}</p>
                <p className="mt-1 font-display text-[3.6rem] font-semibold leading-none">
                  {puntos}
                  <span className="ml-2 text-lg font-normal text-petroleo-100">
                    puntos
                  </span>
                </p>

                {siguiente ? (
                  <div className="mt-7 max-w-md">
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
                        className="h-full rounded-full bg-gradient-to-r from-naranja-400 to-naranja-500"
                        style={{ width: `${progreso}%` }}
                      />
                    </div>
                    <p className="mt-2.5 text-sm text-petroleo-100">
                      Te faltan{" "}
                      <strong className="font-semibold text-white">{faltan} puntos</strong>
                      , cerca de {precio(faltan * reglaPuntos.montoPorPunto)} en compras.
                    </p>
                  </div>
                ) : null}

                <div className="mt-8 flex flex-wrap gap-2.5">
                  <Boton href="#catalogo" variante="primario" medida="md">
                    Canjear puntos
                  </Boton>
                  <Boton href="#historial" variante="contornoClaro" medida="md">
                    <History className="h-4 w-4" />
                    Ver historial
                  </Boton>
                </div>
              </div>

              <Image
                src="/mascota/mirada.png"
                alt=""
                width={716}
                height={1100}
                className="pointer-events-none absolute -bottom-4 right-2 hidden h-52 w-auto object-contain drop-shadow-[0_20px_24px_rgba(2,34,38,0.4)] lg:block"
              />
            </div>

            {/* Desglose */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:content-start">
              <div className="grid grid-cols-2 gap-3">
                {resumen.map((r) => (
                  <div
                    key={r.estado}
                    className="rounded-2xl border border-petroleo-700/10 bg-white p-4"
                  >
                    <p className="font-display text-2xl font-semibold text-petroleo-900">
                      {r.total}
                    </p>
                    <p className="text-xs text-grafito">
                      {nombreEstadoPuntos[r.estado]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-petroleo-700/10 bg-white p-5 sm:col-span-2 lg:col-span-1">
                <h2 className="font-display text-base font-semibold text-petroleo-900">
                  Cupones disponibles
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {cuponesDemo
                    .filter((c) => !c.usado)
                    .map((c) => (
                      <li
                        key={c.codigo}
                        className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-petroleo-700/25 px-3.5 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-petroleo-900">
                            {c.codigo}
                          </p>
                          <p className="truncate text-xs text-grafito">
                            {c.descripcion}
                          </p>
                        </div>
                        <Pastilla tono="suaveAmbar">
                          Vence {fechaCorta(c.vence)}
                        </Pastilla>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-white py-16 md:py-20">
        <div className="contenedor">
          <CabeceraSeccion
            centrado
            antetitulo="Cómo funciona"
            titulo="Tres pasos y ya estás sumando"
          />
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {PASOS.map((p, i) => (
              <li
                key={p.titulo}
                className="relative rounded-3xl border border-petroleo-700/10 bg-crema-50 p-7"
              >
                <span className="absolute right-6 top-5 font-display text-5xl font-semibold text-petroleo-700/8">
                  {i + 1}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-naranja-500 text-white">
                  <p.icono className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-petroleo-900">
                  {p.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-grafito">{p.texto}</p>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-center text-xs text-grafito">
            Vigencia del programa: {fechaCorta(reglaPuntos.vigenciaDesde)} al{" "}
            {fechaCorta(reglaPuntos.vigenciaHasta)}. Los puntos caducan a los 12 meses de
            acreditados.
          </p>
        </div>
      </section>

      {/* Catálogo */}
      <section id="catalogo" className="py-16 md:py-20">
        <div className="contenedor">
          <CabeceraSeccion
            antetitulo="Catálogo de recompensas"
            titulo="En qué puedes gastar tus puntos"
            texto="Las recompensas y sus equivalencias se administran desde el CMS: se pueden activar, cambiar de valor o vincular a campañas puntuales."
          />
          <div className="mt-12">
            <CatalogoRecompensas puntos={puntos} />
          </div>
        </div>
      </section>

      {/* Historial */}
      <section id="historial" className="bg-white py-16 md:py-20">
        <div className="contenedor max-w-3xl">
          <CabeceraSeccion
            antetitulo="Movimientos"
            titulo="Historial de puntos"
            texto="Cada compra, canje y vencimiento queda registrado con su estado."
          />
          <div className="mt-10">
            <HistorialPuntos />
          </div>
        </div>
      </section>
    </>
  );
}
