"use client";

import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "@/lib/formato";
import { clasesBoton } from "@/components/ui/Boton";

export interface EstadoAccion {
  ok?: boolean;
  mensaje?: string;
  errores?: Record<string, string>;
}

export const ESTADO_INICIAL: EstadoAccion = {};

/** Mensaje de éxito o error devuelto por una Server Action. */
export function Aviso({ estado }: { estado: EstadoAccion }) {
  if (!estado?.mensaje) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cx(
        "flex items-start gap-2.5 rounded-2xl px-4 py-3 text-sm",
        estado.ok
          ? "bg-hoja-100 text-hoja-600"
          : "bg-coral-100 text-coral-500",
      )}
    >
      {estado.ok ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span className="leading-snug">{estado.mensaje}</span>
    </div>
  );
}

/** Error de un campo concreto, debajo del input. */
export function ErrorCampo({
  estado,
  campo,
}: {
  estado: EstadoAccion;
  campo: string;
}) {
  const texto = estado?.errores?.[campo];
  if (!texto) return null;
  return (
    <p className="mt-1 text-xs font-medium text-coral-500" role="alert">
      {texto}
    </p>
  );
}

interface PropsBoton {
  children: ReactNode;
  variante?: Parameters<typeof clasesBoton>[0];
  medida?: Parameters<typeof clasesBoton>[1];
  className?: string;
  /** Texto alternativo mientras se envía. */
  enviando?: string;
  disabled?: boolean;
}

/** Botón de envío que se deshabilita y muestra progreso automáticamente. */
export function BotonEnviar({
  children,
  variante = "primario",
  medida = "md",
  className,
  enviando = "Guardando…",
  disabled,
}: PropsBoton) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={clasesBoton(variante, medida, className)}
      aria-busy={pending}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {enviando}
        </>
      ) : (
        children
      )}
    </button>
  );
}
