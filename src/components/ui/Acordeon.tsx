"use client";

import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { cx } from "@/lib/formato";

interface Item {
  id: string;
  pregunta: string;
  respuesta: ReactNode;
}

export function Acordeon({
  items,
  abiertoInicial,
}: {
  items: Item[];
  abiertoInicial?: string;
}) {
  const [abierto, setAbierto] = useState<string | null>(abiertoInicial ?? null);

  return (
    <div className="divide-y divide-petroleo-700/10 overflow-hidden rounded-3xl border border-petroleo-700/10 bg-white">
      {items.map((item) => {
        const activo = abierto === item.id;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => setAbierto(activo ? null : item.id)}
                aria-expanded={activo}
                className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left transition-colors hover:bg-crema-50 md:px-7"
              >
                <span
                  className={cx(
                    "font-display text-base font-semibold transition-colors md:text-lg",
                    activo ? "text-naranja-600" : "text-petroleo-900",
                  )}
                >
                  {item.pregunta}
                </span>
                <span
                  className={cx(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300",
                    activo
                      ? "rotate-45 bg-naranja-500 text-white"
                      : "bg-crema-100 text-petroleo-700",
                  )}
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <div
              className={cx(
                "grid transition-all duration-300 ease-out",
                activo ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-6 text-sm leading-relaxed text-grafito md:px-7 md:pr-20">
                  {item.respuesta}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
