import type { SVGProps } from "react";

/**
 * Iconografía propia de la marca: huella, hueso, plato y olla.
 * Se dibujan como formas sólidas para acompañar bien al logotipo.
 */

type Props = SVGProps<SVGSVGElement>;

export function Huella(props: Props) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true" {...props}>
      <ellipse cx="12.5" cy="15" rx="5" ry="7" transform="rotate(-16 12.5 15)" />
      <ellipse cx="23.5" cy="10.5" rx="5.1" ry="7.4" />
      <ellipse cx="34.5" cy="14.5" rx="5" ry="7" transform="rotate(16 34.5 14.5)" />
      <ellipse cx="41.5" cy="25.5" rx="4.4" ry="6" transform="rotate(28 41.5 25.5)" />
      <path d="M24 21.5c-5.4 0-11.4 4.2-13 9.6-1.6 5.4 2 9.9 7.6 10.6 3.6.5 6.4-.9 9-.9 2.7 0 5.5 1.4 9.1.8 5.5-.8 8.6-5.5 6.7-10.8-1.9-5.4-8-9.3-13.4-9.3Z" />
    </svg>
  );
}

export function Hueso(props: Props) {
  return (
    <svg viewBox="0 0 64 32" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M46.5 3.2c-3.4 0-6.2 2.3-6.9 5.4H24.4C23.7 5.5 20.9 3.2 17.5 3.2c-4 0-7.1 3-7.1 6.7 0 .8.2 1.6.5 2.4C7.7 13.4 5.6 16 5.6 19c0 3.9 3.4 7 7.6 7 3.3 0 6.1-1.9 7.1-4.6h23.4c1 2.7 3.8 4.6 7.1 4.6 4.2 0 7.6-3.1 7.6-7 0-3-2.1-5.6-5.3-6.7.3-.8.5-1.6.5-2.4 0-3.7-3.1-6.7-7.1-6.7Z" />
    </svg>
  );
}

export function HuesoContorno(props: Props) {
  return (
    <svg
      viewBox="0 0 64 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M46.5 3.2c-3.4 0-6.2 2.3-6.9 5.4H24.4C23.7 5.5 20.9 3.2 17.5 3.2c-4 0-7.1 3-7.1 6.7 0 .8.2 1.6.5 2.4C7.7 13.4 5.6 16 5.6 19c0 3.9 3.4 7 7.6 7 3.3 0 6.1-1.9 7.1-4.6h23.4c1 2.7 3.8 4.6 7.1 4.6 4.2 0 7.6-3.1 7.6-7 0-3-2.1-5.6-5.3-6.7.3-.8.5-1.6.5-2.4 0-3.7-3.1-6.7-7.1-6.7Z" />
    </svg>
  );
}

export function Olla(props: Props) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true" {...props}>
      <path
        d="M18 4c-1.6 2-1.6 3.6 0 5.6s1.6 3.6 0 5.6M25 3c-1.6 2-1.6 3.6 0 5.6s1.6 3.6 0 5.6M32 5c-1.4 1.8-1.4 3.2 0 5s1.4 3.2 0 5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <path d="M6 19h36v3a4 4 0 0 1-4 4h-1.2l-1.6 12.3A4 4 0 0 1 31.2 42H16.8a4 4 0 0 1-4-3.7L11.2 26H10a4 4 0 0 1-4-4v-3Z" />
      <rect x="2" y="20" width="5" height="4.5" rx="2.2" />
      <rect x="41" y="20" width="5" height="4.5" rx="2.2" />
    </svg>
  );
}

export function Plato(props: Props) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M9 18h30a3 3 0 0 1 3 3.3l-1.6 12.4A7 7 0 0 1 33.4 40H14.6a7 7 0 0 1-6.9-6.3L6 21.3A3 3 0 0 1 9 18Z" />
      <path
        d="M15 13.5c0-3 3-3 3-6M24 12c0-3 3-3 3-6M33 13.5c0-3 3-3 3-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Hoja(props: Props) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M40 6c-16 0-28 6-30.6 17.6C7 34 12 41 20 42c9 1 17-5 19.4-16.2C41 18.4 41.6 12 40 6Z" />
      <path
        d="M34 13 10 42"
        fill="none"
        stroke="#fff"
        strokeOpacity=".85"
        strokeWidth={2.6}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Escudo(props: Props) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M24 3 7 9.5v13.2C7 33.4 14.2 42 24 45c9.8-3 17-11.6 17-22.3V9.5L24 3Z" />
      <path
        d="m16.5 23.5 5.2 5.4 10-10.6"
        fill="none"
        stroke="#fff"
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Termometro(props: Props) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M24 3a6.5 6.5 0 0 0-6.5 6.5v17.2a11 11 0 1 0 13 0V9.5A6.5 6.5 0 0 0 24 3Zm0 4a2.5 2.5 0 0 1 2.5 2.5V29l1.4 1a7 7 0 1 1-7.8 0l1.4-1V9.5A2.5 2.5 0 0 1 24 7Z" />
      <rect x="21.5" y="14" width="5" height="20" rx="2.5" />
      <circle cx="24" cy="35.5" r="5" />
    </svg>
  );
}

export function Corazon(props: Props) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M24 42S5 30.4 5 18.6C5 11.6 10.4 6.5 17 6.5c4 0 6.5 2 7 3.6.5-1.6 3-3.6 7-3.6 6.6 0 12 5.1 12 12.1C43 30.4 24 42 24 42Z" />
    </svg>
  );
}

export function Chef(props: Props) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M24 4c-4.3 0-8 2.4-9.6 5.9C8.7 10.4 4.5 15 4.5 20.6c0 4.6 2.8 8.5 6.8 10.1V34h25.4v-3.3c4-1.6 6.8-5.5 6.8-10.1 0-5.6-4.2-10.2-9.9-10.7C32 6.4 28.3 4 24 4Z" />
      <rect x="11.3" y="37" width="25.4" height="7" rx="2.4" />
    </svg>
  );
}

/** Onda decorativa para separar bloques de color. */
export function Onda({ className, invertida }: { className?: string; invertida?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      style={invertida ? { transform: "scaleY(-1)" } : undefined}
    >
      <path
        d="M0 44c180 34 340 44 520 30S880 22 1060 14s280 4 380 22V90H0V44Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const iconosPorNombre = {
  hoja: Hoja,
  escudo: Escudo,
  hueso: Hueso,
  chef: Chef,
  termometro: Termometro,
  corazon: Corazon,
  huella: Huella,
  olla: Olla,
  plato: Plato,
} as const;

export type NombreIcono = keyof typeof iconosPorNombre;
