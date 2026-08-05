"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag, TrendingDown } from "lucide-react";
import type { FrecuenciaBarf, ProductoBarf } from "@/lib/tipos";
import { ahorroPorVolumen, frecuenciasBarf, precioKgPara } from "@/data/barf";
import { puntosPorMonto } from "@/data/recompensas";
import { useTienda } from "@/context/Tienda";
import { cx, precio } from "@/lib/formato";
import { Boton } from "@/components/ui/Boton";
import { Pastilla } from "@/components/ui/Elementos";

const ACENTO: Record<string, { chip: string; barra: string }> = {
  coral: { chip: "bg-coral-100 text-coral-500", barra: "bg-coral-500" },
  petroleo: { chip: "bg-petroleo-100 text-petroleo-700", barra: "bg-petroleo-600" },
  ambar: { chip: "bg-ambar-100 text-ambar-500", barra: "bg-ambar-500" },
};

export function SelectorBarf({ producto }: { producto: ProductoBarf }) {
  const { agregar } = useTienda();
  const [kilos, setKilos] = useState(producto.rangos[0].desde);
  const [frecuencia, setFrecuencia] = useState<FrecuenciaBarf>("unica");

  const precioKg = precioKgPara(producto, kilos);
  const total = precioKg * kilos;
  const ahorro = ahorroPorVolumen(producto, kilos);
  const acento = ACENTO[producto.color];

  const rangoActivo = producto.rangos.findIndex(
    (r) => kilos >= r.desde && (r.hasta === null || kilos <= r.hasta),
  );

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-petroleo-700/10 bg-white">
      {/* Cabecera */}
      <div className="relative bg-crema-50 p-6 patron-huellas">
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span
              className={cx(
                "inline-block rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide",
                acento.chip,
              )}
            >
              Receta BARF
            </span>
            <h3 className="mt-3 font-display text-xl font-semibold leading-tight text-petroleo-900">
              {producto.nombre}
            </h3>
          </div>
          <Image
            src={producto.imagen}
            alt=""
            width={300}
            height={160}
            className="h-16 w-auto shrink-0 object-contain drop-shadow-[0_12px_14px_rgba(8,54,59,0.2)]"
          />
        </div>
        <p className="relative mt-3 text-sm leading-relaxed text-grafito">
          {producto.descripcion}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Composición */}
        <div>
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-petroleo-800">
            Composición
          </span>
          <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
            {producto.composicion.map((c) => (
              <li key={c} className="flex items-start gap-1.5 text-xs text-grafito">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-hoja-500" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Tramos de precio */}
        <div>
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-petroleo-800">
            Precio por kilogramo
          </span>
          <ul className="mt-2.5 space-y-1.5">
            {producto.rangos.map((r, i) => (
              <li
                key={r.desde}
                className={cx(
                  "flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                  i === rangoActivo
                    ? "bg-naranja-50 font-semibold text-naranja-700"
                    : "text-grafito",
                )}
              >
                <span>
                  {r.hasta === null
                    ? `${r.desde} kg a más`
                    : `${r.desde} kg a ${r.hasta} kg`}
                </span>
                <span className="tabular-nums">{precio(r.precioKg)} / kg</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cantidad */}
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-petroleo-800">
              ¿Cuántos kilos necesitas?
            </span>
            <span className="font-display text-lg font-semibold text-petroleo-900">
              {kilos} kg
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setKilos((k) => Math.max(1, k - 1))}
              aria-label="Menos kilos"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-petroleo-700/15 text-petroleo-700 transition-colors hover:bg-crema-100"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={kilos}
              onChange={(e) => setKilos(Number(e.target.value))}
              className="min-w-0 flex-1 accent-naranja-500"
              aria-label="Kilos"
            />
            <button
              type="button"
              onClick={() => setKilos((k) => Math.min(30, k + 1))}
              aria-label="Más kilos"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-petroleo-700/15 text-petroleo-700 transition-colors hover:bg-crema-100"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Frecuencia */}
        <div>
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-petroleo-800">
            Frecuencia de entrega
          </span>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {frecuenciasBarf.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFrecuencia(f.id)}
                aria-pressed={frecuencia === f.id}
                className={cx(
                  "rounded-xl border px-3 py-2 text-left text-xs transition-all duration-150",
                  frecuencia === f.id
                    ? "border-naranja-500 bg-naranja-50"
                    : "border-petroleo-700/15 hover:border-petroleo-700/40",
                )}
              >
                <span
                  className={cx(
                    "block font-semibold",
                    frecuencia === f.id ? "text-naranja-700" : "text-petroleo-800",
                  )}
                >
                  {f.nombre}
                </span>
                <span className="block text-[0.68rem] text-grafito">{f.nota}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="mt-auto rounded-2xl bg-crema-50 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-grafito">
                Total {kilos} kg × {precio(precioKg)}
              </span>
              <p className="font-display text-3xl font-semibold leading-none text-petroleo-900">
                {precio(total)}
              </p>
            </div>
            {ahorro > 0 ? (
              <Pastilla tono="suaveHoja">
                <TrendingDown className="h-3.5 w-3.5" />
                Ahorras {precio(ahorro)}
              </Pastilla>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-grafito">
            Suma {puntosPorMonto(total)} puntos del Club Cocina Canina
          </p>
        </div>

        <Boton
          variante="primario"
          medida="lg"
          className="w-full"
          onClick={() =>
            agregar({
              id: `${producto.slug}:${kilos}:${frecuencia}`,
              slug: producto.slug,
              nombre: producto.nombre,
              presentacion: `${kilos} kg · ${precio(precioKg)}/kg`,
              precio: total,
              cantidad: 1,
              imagen: producto.imagen,
              tipo: "barf",
              kilos,
              frecuencia,
            })
          }
        >
          <ShoppingBag className="h-4 w-4" />
          Agregar {kilos} kg al carrito
        </Boton>
      </div>
    </article>
  );
}
