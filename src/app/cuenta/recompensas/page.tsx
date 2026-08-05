import type { Metadata } from "next";
import {
  misMovimientos,
  obtenerRecompensas,
  obtenerRegla,
} from "@/server/recompensas";
import { exigirCliente } from "@/server/sesion";
import { nombreEstadoPuntos } from "@/data/recompensas";
import { CatalogoRecompensas, HistorialPuntos } from "@/components/recompensas/Piezas";
import { fechaCorta, precio } from "@/lib/formato";

export const metadata: Metadata = { title: "Mis puntos" };

export default async function PaginaRecompensasCuenta() {
  const cliente = await exigirCliente();

  const [regla, recompensas, movimientos] = await Promise.all([
    obtenerRegla(),
    obtenerRecompensas(),
    misMovimientos(),
  ]);

  const puntos = cliente.puntos;
  const siguiente = [...recompensas]
    .sort((a, b) => a.puntos - b.puntos)
    .find((r) => r.puntos > puntos);
  const faltan = siguiente ? siguiente.puntos - puntos : 0;
  const progreso = siguiente ? Math.round((puntos / siguiente.puntos) * 100) : 100;

  const totales = (["pendiente", "disponible", "canjeado", "vencido", "cancelado"] as const).map(
    (estado) => ({
      estado,
      total: movimientos
        .filter((m) => m.estado === estado)
        .reduce((t, m) => t + Math.abs(m.puntos), 0),
    }),
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-petroleo-900">
          Mis puntos
        </h2>
        <p className="mt-1.5 text-sm text-grafito">
          Ganas {regla.puntosOtorgados} punto por cada S/{" "}
          {regla.montoPorPunto.toFixed(2)} de compra. Los puntos vencen a los 12 meses de
          acreditados.
        </p>
      </div>

      <section className="rounded-3xl border border-petroleo-700/10 bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-grafito">
              Puntos disponibles
            </span>
            <p className="font-display text-5xl font-semibold leading-none text-petroleo-900">
              {puntos}
            </p>
          </div>
          {siguiente ? (
            <p className="text-sm text-grafito">
              Siguiente:{" "}
              <strong className="font-semibold text-petroleo-900">
                {siguiente.nombre}
              </strong>{" "}
              · faltan {faltan} pts ({precio(faltan * regla.montoPorPunto)})
            </p>
          ) : null}
        </div>

        <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-crema-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-naranja-400 to-naranja-500"
            style={{ width: `${progreso}%` }}
          />
        </div>

        <dl className="mt-6 grid gap-3 sm:grid-cols-5">
          {totales.map((t) => (
            <div key={t.estado} className="rounded-2xl bg-crema-50 p-3.5 text-center">
              <dt className="text-[0.68rem] font-semibold uppercase tracking-wide text-grafito">
                {nombreEstadoPuntos[t.estado]}
              </dt>
              <dd className="font-display text-2xl font-semibold text-petroleo-900">
                {t.total}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 text-xs text-grafito">
          Programa vigente del {fechaCorta(regla.vigenciaDesde)} al{" "}
          {fechaCorta(regla.vigenciaHasta)}.
        </p>
      </section>

      <section>
        <h3 className="mb-4 font-display text-xl font-semibold text-petroleo-900">
          Canjear puntos
        </h3>
        <CatalogoRecompensas recompensas={recompensas} puntos={puntos} autenticado />
      </section>

      <section>
        <h3 className="mb-4 font-display text-xl font-semibold text-petroleo-900">
          Historial de movimientos
        </h3>
        <HistorialPuntos movimientos={movimientos} />
      </section>
    </div>
  );
}
