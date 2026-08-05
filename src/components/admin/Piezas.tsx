import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cx } from "@/lib/formato";

/** Cabecera de cada módulo del CMS. */
export function CabeceraModulo({
  titulo,
  texto,
  acciones,
}: {
  titulo: string;
  texto?: string;
  acciones?: ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold text-petroleo-900 md:text-3xl">
          {titulo}
        </h1>
        {texto ? (
          <p className="mt-1.5 max-w-2xl text-sm text-grafito">{texto}</p>
        ) : null}
      </div>
      {acciones ? <div className="flex flex-wrap gap-2.5">{acciones}</div> : null}
    </header>
  );
}

export function Panel({
  titulo,
  descripcion,
  acciones,
  children,
  className,
}: {
  titulo?: string;
  descripcion?: string;
  acciones?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "overflow-hidden rounded-3xl border border-petroleo-700/10 bg-white",
        className,
      )}
    >
      {titulo ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-petroleo-700/10 px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-petroleo-900">
              {titulo}
            </h2>
            {descripcion ? (
              <p className="mt-0.5 text-xs text-grafito">{descripcion}</p>
            ) : null}
          </div>
          {acciones}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Metrica({
  etiqueta,
  valor,
  variacion,
  nota,
  icono: Icono,
}: {
  etiqueta: string;
  valor: string;
  variacion?: number;
  nota?: string;
  icono: React.ComponentType<{ className?: string }>;
}) {
  const sube = (variacion ?? 0) >= 0;

  return (
    <article className="rounded-3xl border border-petroleo-700/10 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-crema-100 text-petroleo-700">
          <Icono className="h-[1.125rem] w-[1.125rem]" />
        </span>
        {variacion !== undefined ? (
          <span
            className={cx(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.68rem] font-bold",
              sube ? "bg-hoja-100 text-hoja-600" : "bg-coral-100 text-coral-500",
            )}
          >
            {sube ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {sube ? "+" : ""}
            {variacion}%
          </span>
        ) : null}
      </div>

      <p className="mt-4 font-display text-3xl font-semibold leading-none text-petroleo-900">
        {valor}
      </p>
      <p className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-grafito">
        {etiqueta}
      </p>
      {nota ? <p className="mt-1 text-xs text-grafito">{nota}</p> : null}
    </article>
  );
}

/** Tabla con scroll horizontal en móvil. */
export function Tabla({
  columnas,
  children,
}: {
  columnas: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[46rem] text-sm">
        <thead>
          <tr className="border-b border-petroleo-700/10 bg-crema-50">
            {columnas.map((c) => (
              <th
                key={c}
                scope="col"
                className="px-5 py-3 text-left text-[0.68rem] font-bold uppercase tracking-[0.08em] text-grafito"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-petroleo-700/8">{children}</tbody>
      </table>
    </div>
  );
}

/** Barra horizontal para los reportes. */
export function BarraDato({
  etiqueta,
  valor,
  maximo,
  formato,
  tono = "naranja",
}: {
  etiqueta: string;
  valor: number;
  maximo: number;
  formato?: (v: number) => string;
  tono?: "naranja" | "petroleo" | "hoja";
}) {
  const color = {
    naranja: "bg-naranja-500",
    petroleo: "bg-petroleo-600",
    hoja: "bg-hoja-500",
  }[tono];

  return (
    <li>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="min-w-0 truncate text-petroleo-900">{etiqueta}</span>
        <span className="shrink-0 font-semibold tabular-nums text-petroleo-900">
          {formato ? formato(valor) : valor}
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-crema-100">
        <div
          className={cx("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${Math.max(4, Math.round((valor / maximo) * 100))}%` }}
        />
      </div>
    </li>
  );
}
