import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/formato";

type Variante =
  | "primario"
  | "petroleo"
  | "contorno"
  | "contornoClaro"
  | "fantasma"
  | "whatsapp"
  | "suave";

type Medida = "sm" | "md" | "lg";

const VARIANTES: Record<Variante, string> = {
  primario:
    "bg-naranja-500 text-white shadow-suave hover:bg-naranja-600 active:bg-naranja-700",
  petroleo:
    "bg-petroleo-700 text-white shadow-suave hover:bg-petroleo-800 active:bg-petroleo-900",
  contorno:
    "border border-petroleo-700/25 bg-white/70 text-petroleo-800 hover:border-petroleo-700/50 hover:bg-white",
  contornoClaro:
    "border border-white/35 text-white hover:border-white/70 hover:bg-white/10",
  fantasma: "text-petroleo-800 hover:bg-petroleo-50",
  whatsapp: "bg-[#25D366] text-[#053f22] shadow-suave hover:bg-[#1eb959]",
  suave: "bg-crema-200 text-petroleo-800 hover:bg-crema-300",
};

const MEDIDAS: Record<Medida, string> = {
  sm: "h-9 px-4 text-[0.8rem] gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-[0.95rem] gap-2.5",
};

const BASE =
  "inline-flex items-center justify-center rounded-full font-semibold tracking-tight " +
  "transition-all duration-200 ease-out will-change-transform " +
  "hover:-translate-y-0.5 active:translate-y-0 " +
  "disabled:pointer-events-none disabled:opacity-45";

export function clasesBoton(
  variante: Variante = "primario",
  medida: Medida = "md",
  extra?: string,
): string {
  return cx(BASE, VARIANTES[variante], MEDIDAS[medida], extra);
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  medida?: Medida;
  href?: string;
  externo?: boolean;
  children: ReactNode;
}

export function Boton({
  variante = "primario",
  medida = "md",
  href,
  externo,
  className,
  children,
  ...resto
}: Props) {
  const clases = clasesBoton(variante, medida, className);

  if (href) {
    if (externo) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={clases}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={clases}>
        {children}
      </Link>
    );
  }

  return (
    <button className={clases} {...resto}>
      {children}
    </button>
  );
}
