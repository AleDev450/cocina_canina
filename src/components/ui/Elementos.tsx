import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Star } from "lucide-react";
import { cx } from "@/lib/formato";
import { Huella } from "@/components/ui/Iconos";

/* --------------------------------- Marca --------------------------------- */

export function Logo({
  variante = "color",
  className = "h-10 w-auto",
  prioridad,
}: {
  variante?: "color" | "blanco" | "verde";
  className?: string;
  prioridad?: boolean;
}) {
  const archivo = {
    color: "/marca/logo-color.png",
    blanco: "/marca/logo-blanco.png",
    verde: "/marca/logo-verde.png",
  }[variante];

  return (
    <Image
      src={archivo}
      alt="La Cocina Canina"
      width={2274}
      height={624}
      className={className}
      priority={prioridad}
    />
  );
}

/* -------------------------------- Etiquetas ------------------------------- */

const TONOS = {
  naranja: "bg-naranja-500 text-white",
  petroleo: "bg-petroleo-700 text-white",
  hoja: "bg-hoja-500 text-white",
  coral: "bg-coral-500 text-white",
  ambar: "bg-ambar-500 text-white",
  crema: "bg-crema-200 text-petroleo-800",
  suaveNaranja: "bg-naranja-50 text-naranja-700",
  suavePetroleo: "bg-petroleo-50 text-petroleo-700",
  suaveHoja: "bg-hoja-100 text-hoja-600",
  suaveCoral: "bg-coral-100 text-coral-500",
  suaveAmbar: "bg-ambar-100 text-ambar-500",
  contorno: "border border-petroleo-700/20 text-petroleo-700",
} as const;

export type Tono = keyof typeof TONOS;

export function Etiqueta({
  children,
  tono = "crema",
  className,
}: {
  children: ReactNode;
  tono?: Tono;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em]",
        TONOS[tono],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Pastilla({
  children,
  tono = "suavePetroleo",
  className,
}: {
  children: ReactNode;
  tono?: Tono;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        TONOS[tono],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* -------------------------------- Secciones ------------------------------- */

export function Antetitulo({ children }: { children: ReactNode }) {
  return (
    <span className="antetitulo">
      <Huella className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

export function CabeceraSeccion({
  antetitulo,
  titulo,
  texto,
  centrado,
  claro,
  accion,
}: {
  antetitulo?: string;
  titulo: ReactNode;
  texto?: string;
  centrado?: boolean;
  claro?: boolean;
  accion?: ReactNode;
}) {
  return (
    <div
      className={cx(
        "flex flex-col gap-5",
        centrado && "items-center text-center",
        accion && "md:flex-row md:items-end md:justify-between md:text-left",
      )}
    >
      <div className={cx("max-w-2xl space-y-3", centrado && !accion && "mx-auto")}>
        {antetitulo ? <Antetitulo>{antetitulo}</Antetitulo> : null}
        <h2
          className={cx(
            "titulo-seccion",
            claro ? "text-white" : "text-petroleo-900",
          )}
        >
          {titulo}
        </h2>
        {texto ? (
          <p
            className={cx(
              "text-[0.98rem] leading-relaxed",
              claro ? "text-petroleo-100" : "text-grafito",
            )}
          >
            {texto}
          </p>
        ) : null}
      </div>
      {accion ? <div className="shrink-0">{accion}</div> : null}
    </div>
  );
}

export function Seccion({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cx("py-16 md:py-24", className)}>
      <div className="contenedor">{children}</div>
    </section>
  );
}

/* -------------------------------- Estrellas ------------------------------- */

export function Estrellas({
  valor,
  className,
}: {
  valor: number;
  className?: string;
}) {
  return (
    <span className={cx("inline-flex items-center gap-0.5", className)} aria-label={`${valor} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cx(
            "h-4 w-4",
            i <= valor ? "fill-naranja-500 text-naranja-500" : "text-crema-300",
          )}
        />
      ))}
    </span>
  );
}

/* ---------------------------------- Sello --------------------------------- */

/** Sello circular con texto en curva, como los de producto artesanal. */
export function SelloCircular({
  texto,
  className,
}: {
  texto: string;
  className?: string;
}) {
  const repetido = `${texto} · `;
  return (
    <div className={cx("relative aspect-square", className)}>
      <svg viewBox="0 0 200 200" className="h-full w-full animate-girar-lento">
        <defs>
          <path
            id="circulo-sello"
            d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
            fill="none"
          />
        </defs>
        <text
          className="fill-white text-[15.5px] font-bold uppercase"
          style={{ letterSpacing: "0.16em" }}
        >
          <textPath href="#circulo-sello" startOffset="0">
            {repetido.repeat(2)}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center">
        <Huella className="h-11 w-11 text-naranja-500" />
      </span>
    </div>
  );
}

/* --------------------------------- Avatar --------------------------------- */

const COLORES_AVATAR = [
  "bg-petroleo-700",
  "bg-naranja-500",
  "bg-coral-500",
  "bg-hoja-500",
  "bg-ambar-500",
  "bg-petroleo-500",
];

/** Foto de la mascota o, si aún no hay, su inicial sobre color de marca. */
export function AvatarMascota({
  nombre,
  foto,
  className = "h-14 w-14",
}: {
  nombre: string;
  foto?: string;
  className?: string;
}) {
  if (foto) {
    return (
      <span
        className={cx(
          "relative block shrink-0 overflow-hidden rounded-full bg-crema-100 ring-2 ring-white",
          className,
        )}
      >
        <Image src={foto} alt={nombre} fill sizes="120px" className="object-cover" />
      </span>
    );
  }

  const indice =
    nombre.split("").reduce((t, c) => t + c.charCodeAt(0), 0) % COLORES_AVATAR.length;

  return (
    <span
      className={cx(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full font-display text-lg font-semibold text-white ring-2 ring-white",
        COLORES_AVATAR[indice],
        className,
      )}
      aria-hidden="true"
    >
      <Huella className="absolute -bottom-1 -right-1 h-6 w-6 text-white/20" />
      {nombre.charAt(0).toUpperCase()}
    </span>
  );
}

/* -------------------------------- Migajas -------------------------------- */

export function Migajas({
  items,
}: {
  items: Array<{ nombre: string; href?: string }>;
}) {
  return (
    <nav aria-label="Migas de pan" className="text-xs text-grafito">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.nombre} className="flex items-center gap-1.5">
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-naranja-600">
                {item.nombre}
              </Link>
            ) : (
              <span className="font-semibold text-petroleo-800">{item.nombre}</span>
            )}
            {i < items.length - 1 ? <span className="text-crema-300">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ------------------------------ Estado vacío ------------------------------ */

export function EstadoVacio({
  titulo,
  texto,
  accion,
  pose = "sentado",
  imagen,
}: {
  titulo: string;
  texto: string;
  accion?: ReactNode;
  pose?: "sentado" | "mirada" | "saltando";
  /** Composición propia en lugar de la pose por defecto (p. ej. el plato). */
  imagen?: { src: string; ancho: number; alto: number };
}) {
  const foto = imagen ?? { src: `/mascota/${pose}.png`, ancho: 520, alto: 560 };

  return (
    <div className="flex flex-col items-center gap-5 py-14 text-center">
      <div className="relative">
        <div className="absolute inset-x-2 bottom-3 h-6 rounded-[50%] bg-petroleo-900/10 blur-md" />
        <Image
          src={foto.src}
          alt=""
          width={foto.ancho}
          height={foto.alto}
          className="relative h-40 w-auto object-contain"
        />
      </div>
      <div className="max-w-sm space-y-2">
        <h3 className="font-display text-xl font-semibold text-petroleo-900">{titulo}</h3>
        <p className="text-sm text-grafito">{texto}</p>
      </div>
      {accion}
    </div>
  );
}
