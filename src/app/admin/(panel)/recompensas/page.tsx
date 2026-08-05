import type { Metadata } from "next";
import { obtenerRecompensas, obtenerRegla, resumenPuntos } from "@/server/recompensas";
import { exigirGrupo } from "@/server/sesion";
import { nombreEstadoPuntos } from "@/data/recompensas";
import {
  FormularioRegla,
  PanelRecompensas,
} from "@/components/admin/PanelRecompensas";
import { CabeceraModulo } from "@/components/admin/Piezas";

export const metadata: Metadata = { title: "Programa de recompensas" };

export default async function AdminRecompensas() {
  await exigirGrupo("Clientes");

  const [regla, recompensas, resumen] = await Promise.all([
    obtenerRegla(),
    obtenerRecompensas(false),
    resumenPuntos(),
  ]);

  const totales = [
    { estado: "pendiente", total: resumen.pendientes },
    { estado: "disponible", total: resumen.disponibles },
    { estado: "canjeado", total: resumen.canjeados },
    { estado: "vencido", total: resumen.vencidos },
    { estado: "cancelado", total: resumen.cancelados },
  ];

  return (
    <>
      <CabeceraModulo
        titulo="Programa de recompensas"
        texto="Configura la equivalencia de puntos, las campañas y el catálogo de canje del Club Cocina Canina."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {totales.map((t) => (
          <div
            key={t.estado}
            className="rounded-2xl border border-petroleo-700/10 bg-white p-4"
          >
            <p className="font-display text-2xl font-semibold text-petroleo-900">
              {t.total}
            </p>
            <p className="mt-0.5 text-[0.68rem] font-semibold uppercase tracking-wide text-grafito">
              {nombreEstadoPuntos[t.estado]}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <FormularioRegla regla={regla} />
      </div>

      <PanelRecompensas recompensas={recompensas} />
    </>
  );
}
