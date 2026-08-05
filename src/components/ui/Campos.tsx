"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { cx } from "@/lib/formato";

const BASE_CAMPO =
  "w-full rounded-2xl border border-petroleo-700/15 bg-white px-4 text-sm text-tinta " +
  "transition-colors placeholder:text-grafito/50 " +
  "hover:border-petroleo-700/30 focus:border-naranja-500 focus:outline-none " +
  "disabled:bg-crema-100 disabled:text-grafito";

function Envoltura({
  etiqueta,
  id,
  ayuda,
  opcional,
  children,
  className,
}: {
  etiqueta?: string;
  id: string;
  ayuda?: string;
  opcional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("space-y-1.5", className)}>
      {etiqueta ? (
        <label
          htmlFor={id}
          className="flex items-baseline gap-2 text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800"
        >
          {etiqueta}
          {opcional ? (
            <span className="text-[0.65rem] font-medium normal-case tracking-normal text-grafito">
              opcional
            </span>
          ) : null}
        </label>
      ) : null}
      {children}
      {ayuda ? <p className="text-xs text-grafito">{ayuda}</p> : null}
    </div>
  );
}

interface PropsCampo extends InputHTMLAttributes<HTMLInputElement> {
  etiqueta?: string;
  ayuda?: string;
  opcional?: boolean;
  contenedor?: string;
}

export function Campo({
  etiqueta,
  ayuda,
  opcional,
  contenedor,
  className,
  id,
  ...resto
}: PropsCampo) {
  const auto = useId();
  const idFinal = id ?? auto;
  return (
    <Envoltura
      etiqueta={etiqueta}
      id={idFinal}
      ayuda={ayuda}
      opcional={opcional}
      className={contenedor}
    >
      <input id={idFinal} className={cx(BASE_CAMPO, "h-12", className)} {...resto} />
    </Envoltura>
  );
}

export function CampoClave({ etiqueta, contenedor, id, ...resto }: PropsCampo) {
  const auto = useId();
  const idFinal = id ?? auto;
  const [visible, setVisible] = useState(false);

  return (
    <Envoltura etiqueta={etiqueta} id={idFinal} className={contenedor}>
      <div className="relative">
        <input
          id={idFinal}
          type={visible ? "text" : "password"}
          className={cx(BASE_CAMPO, "h-12 pr-12")}
          {...resto}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-grafito transition-colors hover:bg-crema-100 hover:text-petroleo-700"
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </Envoltura>
  );
}

interface PropsSelect extends SelectHTMLAttributes<HTMLSelectElement> {
  etiqueta?: string;
  ayuda?: string;
  opcional?: boolean;
  contenedor?: string;
  children: ReactNode;
}

export function Select({
  etiqueta,
  ayuda,
  opcional,
  contenedor,
  className,
  id,
  children,
  ...resto
}: PropsSelect) {
  const auto = useId();
  const idFinal = id ?? auto;
  return (
    <Envoltura
      etiqueta={etiqueta}
      id={idFinal}
      ayuda={ayuda}
      opcional={opcional}
      className={contenedor}
    >
      <div className="relative">
        <select
          id={idFinal}
          className={cx(BASE_CAMPO, "h-12 cursor-pointer appearance-none pr-11", className)}
          {...resto}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-petroleo-700" />
      </div>
    </Envoltura>
  );
}

interface PropsArea extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  etiqueta?: string;
  ayuda?: string;
  opcional?: boolean;
  contenedor?: string;
}

export function AreaTexto({
  etiqueta,
  ayuda,
  opcional,
  contenedor,
  className,
  id,
  ...resto
}: PropsArea) {
  const auto = useId();
  const idFinal = id ?? auto;
  return (
    <Envoltura
      etiqueta={etiqueta}
      id={idFinal}
      ayuda={ayuda}
      opcional={opcional}
      className={contenedor}
    >
      <textarea
        id={idFinal}
        rows={4}
        className={cx(BASE_CAMPO, "resize-y py-3", className)}
        {...resto}
      />
    </Envoltura>
  );
}

export function Casilla({
  etiqueta,
  id,
  ...resto
}: InputHTMLAttributes<HTMLInputElement> & { etiqueta: ReactNode }) {
  const auto = useId();
  const idFinal = id ?? auto;
  return (
    <label htmlFor={idFinal} className="flex cursor-pointer items-start gap-3 text-sm text-grafito">
      <input
        id={idFinal}
        type="checkbox"
        className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 cursor-pointer rounded-md border-petroleo-700/25 text-naranja-500 accent-naranja-500"
        {...resto}
      />
      <span className="leading-snug">{etiqueta}</span>
    </label>
  );
}

/** Grupo de opciones tipo píldora (dureza, frecuencia, método de pago…). */
export function GrupoOpciones<T extends string>({
  opciones,
  valor,
  onCambio,
  columnas = 2,
}: {
  opciones: Array<{ id: T; nombre: string; nota?: string }>;
  valor: T;
  onCambio: (id: T) => void;
  columnas?: 1 | 2 | 3 | 4;
}) {
  const rejilla = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }[columnas];

  return (
    <div className={cx("grid gap-2.5", rejilla)}>
      {opciones.map((o) => {
        const activo = o.id === valor;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onCambio(o.id)}
            aria-pressed={activo}
            className={cx(
              "rounded-2xl border px-4 py-3 text-left transition-all duration-200",
              activo
                ? "border-naranja-500 bg-naranja-50 shadow-suave"
                : "border-petroleo-700/15 bg-white hover:border-petroleo-700/35",
            )}
          >
            <span
              className={cx(
                "block text-sm font-semibold",
                activo ? "text-naranja-700" : "text-petroleo-800",
              )}
            >
              {o.nombre}
            </span>
            {o.nota ? (
              <span className="mt-0.5 block text-xs text-grafito">{o.nota}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
