"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { EstadoPuntos, Recompensa } from "@/lib/tipos";
import {
  historialPuntos,
  nombreEstadoPuntos,
  recompensas,
} from "@/data/recompensas";
import { ICONO_RECOMPENSA } from "@/components/recompensas/iconos";
import { cx, fechaCorta } from "@/lib/formato";
import { Boton } from "@/components/ui/Boton";
import { Pastilla, type Tono } from "@/components/ui/Elementos";



const TONO_ESTADO: Record<EstadoPuntos, Tono> = {
  pendiente: "suaveAmbar",
  disponible: "suaveHoja",
  canjeado: "suavePetroleo",
  vencido: "suaveCoral",
  cancelado: "suaveCoral",
};

/* --------------------------- Catálogo de canje --------------------------- */

export function CatalogoRecompensas({ puntos }: { puntos: number }) {
  const [canjeada, setCanjeada] = useState<string | null>(null);

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {recompensas.map((r: Recompensa) => {
        const Icono = ICONO_RECOMPENSA[r.icono];
        const alcanzable = puntos >= r.puntos;
        const progreso = Math.min(100, Math.round((puntos / r.puntos) * 100));

        return (
          <article
            key={r.id}
            className={cx(
              "flex flex-col rounded-3xl border bg-white p-6 transition-all duration-300",
              alcanzable
                ? "border-naranja-500/40 shadow-suave hover:-translate-y-1.5 hover:shadow-tarjeta"
                : "border-petroleo-700/10",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className={cx(
                  "grid h-12 w-12 place-items-center rounded-2xl",
                  alcanzable
                    ? "bg-naranja-500 text-white"
                    : "bg-crema-100 text-petroleo-700",
                )}
              >
                <Icono className="h-5 w-5" />
              </span>
              <span className="font-display text-2xl font-semibold text-petroleo-900">
                {r.puntos}
                <span className="ml-1 text-xs font-normal uppercase tracking-wide text-grafito">
                  pts
                </span>
              </span>
            </div>

            <h3 className="mt-4 font-display text-lg font-semibold text-petroleo-900">
              {r.nombre}
            </h3>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-grafito">
              {r.descripcion}
            </p>

            {!alcanzable ? (
              <div className="mt-5">
                <div className="h-1.5 overflow-hidden rounded-full bg-crema-200">
                  <div
                    className="h-full rounded-full bg-naranja-400 transition-all duration-700"
                    style={{ width: `${progreso}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-grafito">
                  Te faltan {r.puntos - puntos} puntos
                </p>
              </div>
            ) : (
              <Boton
                variante={canjeada === r.id ? "suave" : "primario"}
                medida="md"
                className="mt-5 w-full"
                disabled={canjeada === r.id}
                onClick={() => setCanjeada(r.id)}
              >
                {canjeada === r.id ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    ¡Canjeada!
                  </>
                ) : (
                  "Canjear puntos"
                )}
              </Boton>
            )}
          </article>
        );
      })}
    </div>
  );
}

/* ------------------------------- Historial ------------------------------- */

const FILTROS: Array<{ id: EstadoPuntos | "todos"; nombre: string }> = [
  { id: "todos", nombre: "Todos" },
  { id: "pendiente", nombre: "Pendientes" },
  { id: "disponible", nombre: "Disponibles" },
  { id: "canjeado", nombre: "Canjeados" },
  { id: "vencido", nombre: "Vencidos" },
  { id: "cancelado", nombre: "Cancelados" },
];

export function HistorialPuntos() {
  const [filtro, setFiltro] = useState<EstadoPuntos | "todos">("todos");

  const lista =
    filtro === "todos"
      ? historialPuntos
      : historialPuntos.filter((m) => m.estado === filtro);

  return (
    <div className="overflow-hidden rounded-3xl border border-petroleo-700/10 bg-white">
      <div className="sin-scrollbar flex gap-2 overflow-x-auto border-b border-petroleo-700/10 p-4">
        {FILTROS.map((f) => {
          const cantidad =
            f.id === "todos"
              ? historialPuntos.length
              : historialPuntos.filter((m) => m.estado === f.id).length;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              className={cx(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                filtro === f.id
                  ? "bg-petroleo-700 text-white"
                  : "bg-crema-100 text-grafito hover:text-petroleo-800",
              )}
            >
              {f.nombre} ({cantidad})
            </button>
          );
        })}
      </div>

      {lista.length === 0 ? (
        <p className="p-8 text-center text-sm text-grafito">
          No hay movimientos en este estado.
        </p>
      ) : (
        <ul className="divide-y divide-petroleo-700/10">
          {lista.map((m) => (
            <li key={m.id} className="flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-petroleo-900">
                  {m.concepto}
                </p>
                <p className="text-xs text-grafito">{fechaCorta(m.fecha)}</p>
              </div>
              <Pastilla tono={TONO_ESTADO[m.estado]}>
                {nombreEstadoPuntos[m.estado]}
              </Pastilla>
              <span
                className={cx(
                  "w-16 shrink-0 text-right font-display text-lg font-semibold tabular-nums",
                  m.puntos < 0 ? "text-coral-500" : "text-petroleo-900",
                  (m.estado === "vencido" || m.estado === "cancelado") &&
                    "text-grafito/50 line-through",
                )}
              >
                {m.puntos > 0 ? "+" : ""}
                {m.puntos}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
