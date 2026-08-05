"use client";

import { useState, useTransition, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cx } from "@/lib/formato";

/**
 * Interruptor que llama a una Server Action. Actualiza de inmediato en la
 * interfaz y revierte si el servidor rechaza el cambio.
 */
export function Interruptor({
  activo,
  alCambiar,
  etiqueta,
  tamano = "md",
}: {
  activo: boolean;
  alCambiar: (valor: boolean) => Promise<void>;
  etiqueta: string;
  tamano?: "sm" | "md";
}) {
  const [optimista, setOptimista] = useState(activo);
  const [pendiente, iniciar] = useTransition();

  const alternar = () => {
    const siguiente = !optimista;
    setOptimista(siguiente);
    iniciar(async () => {
      try {
        await alCambiar(siguiente);
      } catch {
        setOptimista(!siguiente);
      }
    });
  };

  const medidas =
    tamano === "sm"
      ? { pista: "h-5 w-9", bola: "h-4 w-4", off: "translate-x-0.5", on: "translate-x-[1.125rem]" }
      : { pista: "h-6 w-11", bola: "h-5 w-5", off: "translate-x-0.5", on: "translate-x-[1.375rem]" };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimista}
      aria-label={etiqueta}
      onClick={alternar}
      disabled={pendiente}
      className={cx(
        "relative shrink-0 rounded-full transition-colors disabled:opacity-60",
        medidas.pista,
        optimista ? "bg-hoja-500" : "bg-crema-300",
      )}
    >
      <span
        className={cx(
          "absolute top-0.5 rounded-full bg-white shadow transition-transform",
          medidas.bola,
          optimista ? medidas.on : medidas.off,
        )}
      />
    </button>
  );
}

/**
 * Botón que ejecuta una Server Action, con confirmación opcional.
 * Se usa para eliminar y para acciones puntuales de las tablas.
 */
export function BotonAccion({
  children,
  accion,
  confirmar,
  className,
  etiqueta,
  title,
}: {
  children: ReactNode;
  accion: () => Promise<void>;
  confirmar?: string;
  className?: string;
  etiqueta: string;
  title?: string;
}) {
  const [pendiente, iniciar] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const ejecutar = () => {
    if (confirmar && !window.confirm(confirmar)) return;
    setError(null);
    iniciar(async () => {
      try {
        await accion();
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo completar la acción.");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={ejecutar}
        disabled={pendiente}
        aria-label={etiqueta}
        title={title ?? etiqueta}
        className={cx("disabled:opacity-50", className)}
      >
        {pendiente ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : children}
      </button>
      {error ? (
        <span role="alert" className="block text-[0.68rem] text-coral-500">
          {error}
        </span>
      ) : null}
    </>
  );
}

/** Selector que dispara una acción al cambiar (estados de pedido, roles…). */
export function SelectAccion({
  valor,
  opciones,
  alCambiar,
  etiqueta,
  className,
}: {
  valor: string;
  opciones: Array<{ id: string; nombre: string }>;
  alCambiar: (valor: string) => Promise<void>;
  etiqueta: string;
  className?: string;
}) {
  const [actual, setActual] = useState(valor);
  const [pendiente, iniciar] = useTransition();

  return (
    <select
      value={actual}
      aria-label={etiqueta}
      disabled={pendiente}
      onChange={(e) => {
        const siguiente = e.target.value;
        const previo = actual;
        setActual(siguiente);
        iniciar(async () => {
          try {
            await alCambiar(siguiente);
          } catch {
            setActual(previo);
          }
        });
      }}
      className={cx(
        "h-9 cursor-pointer rounded-lg border border-petroleo-700/15 bg-white px-2.5 text-xs font-semibold text-petroleo-800 focus:border-naranja-500 focus:outline-none disabled:opacity-60",
        className,
      )}
    >
      {opciones.map((o) => (
        <option key={o.id} value={o.id}>
          {o.nombre}
        </option>
      ))}
    </select>
  );
}
