"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, SlidersHorizontal, X } from "lucide-react";
import type { Producto } from "@/lib/tipos";
import { precioDesde, productos as todos } from "@/data/productos";
import {
  categorias,
  nombreDureza,
  nombreEdad,
  nombreProteina,
  nombreTamano,
} from "@/data/categorias";
import { TarjetaProducto } from "@/components/producto/TarjetaProducto";
import { Boton } from "@/components/ui/Boton";
import { EstadoVacio, Pastilla } from "@/components/ui/Elementos";
import { cx, precio } from "@/lib/formato";

type Orden =
  | "mas-vendidos"
  | "precio-asc"
  | "precio-desc"
  | "nuevos"
  | "recomendados";

const ORDENES: Array<{ id: Orden; nombre: string }> = [
  { id: "mas-vendidos", nombre: "Más vendidos" },
  { id: "precio-asc", nombre: "Precio: menor a mayor" },
  { id: "precio-desc", nombre: "Precio: mayor a menor" },
  { id: "nuevos", nombre: "Nuevos productos" },
  { id: "recomendados", nombre: "Recomendados" },
];

const PROTEINAS = ["res", "cerdo", "pollo", "cordero", "pescado", "cabra"] as const;
const DUREZAS = ["suave", "media", "larga-duracion"] as const;
const TAMANOS = ["pequeno", "mediano", "grande"] as const;
const EDADES = ["cachorro", "adulto", "senior"] as const;

const CATEGORIAS_SNACK = categorias.filter((c) =>
  ["dureza-suave", "dureza-media", "larga-duracion"].includes(c.slug),
);

const PRECIO_MAXIMO = 50;

interface Filtros {
  categorias: string[];
  proteinas: string[];
  durezas: string[];
  tamanos: string[];
  edades: string[];
  precioMax: number;
  soloDisponibles: boolean;
  soloPorMayor: boolean;
}

const VACIOS: Filtros = {
  categorias: [],
  proteinas: [],
  durezas: [],
  tamanos: [],
  edades: [],
  precioMax: PRECIO_MAXIMO,
  soloDisponibles: false,
  soloPorMayor: false,
};

function alternar(lista: string[], valor: string): string[] {
  return lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];
}

/* ------------------------------ Sub-bloques ------------------------------ */

function GrupoFiltro({
  titulo,
  opciones,
  activos,
  onAlternar,
}: {
  titulo: string;
  opciones: Array<{ id: string; nombre: string }>;
  activos: string[];
  onAlternar: (id: string) => void;
}) {
  return (
    <fieldset className="border-b border-petroleo-700/10 pb-5">
      <legend className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-petroleo-800">
        {titulo}
      </legend>
      <div className="flex flex-wrap gap-2">
        {opciones.map((o) => {
          const activo = activos.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onAlternar(o.id)}
              aria-pressed={activo}
              className={cx(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-150",
                activo
                  ? "border-naranja-500 bg-naranja-500 text-white"
                  : "border-petroleo-700/15 bg-white text-grafito hover:border-petroleo-700/40 hover:text-petroleo-800",
              )}
            >
              {o.nombre}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function PanelFiltros({
  filtros,
  setFiltros,
  onLimpiar,
}: {
  filtros: Filtros;
  setFiltros: (f: Filtros) => void;
  onLimpiar: () => void;
}) {
  return (
    <div className="space-y-5">
      <GrupoFiltro
        titulo="Categoría"
        opciones={CATEGORIAS_SNACK.map((c) => ({
          id: c.slug,
          nombre: c.nombre.replace("Snacks de ", ""),
        }))}
        activos={filtros.categorias}
        onAlternar={(id) =>
          setFiltros({ ...filtros, categorias: alternar(filtros.categorias, id) })
        }
      />

      <GrupoFiltro
        titulo="Tipo de proteína"
        opciones={PROTEINAS.map((p) => ({ id: p, nombre: nombreProteina[p] }))}
        activos={filtros.proteinas}
        onAlternar={(id) =>
          setFiltros({ ...filtros, proteinas: alternar(filtros.proteinas, id) })
        }
      />

      <GrupoFiltro
        titulo="Nivel de dureza"
        opciones={DUREZAS.map((d) => ({
          id: d,
          nombre: nombreDureza[d].replace("Dureza ", ""),
        }))}
        activos={filtros.durezas}
        onAlternar={(id) =>
          setFiltros({ ...filtros, durezas: alternar(filtros.durezas, id) })
        }
      />

      <GrupoFiltro
        titulo="Tamaño del perro"
        opciones={TAMANOS.map((t) => ({
          id: t,
          nombre: nombreTamano[t].replace("Perro ", ""),
        }))}
        activos={filtros.tamanos}
        onAlternar={(id) =>
          setFiltros({ ...filtros, tamanos: alternar(filtros.tamanos, id) })
        }
      />

      <GrupoFiltro
        titulo="Edad del perro"
        opciones={EDADES.map((e) => ({ id: e, nombre: nombreEdad[e] }))}
        activos={filtros.edades}
        onAlternar={(id) =>
          setFiltros({ ...filtros, edades: alternar(filtros.edades, id) })
        }
      />

      {/* Precio */}
      <fieldset className="border-b border-petroleo-700/10 pb-5">
        <legend className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-petroleo-800">
          Rango de precio
        </legend>
        <input
          type="range"
          min={3}
          max={PRECIO_MAXIMO}
          step={1}
          value={filtros.precioMax}
          onChange={(e) => setFiltros({ ...filtros, precioMax: Number(e.target.value) })}
          className="w-full accent-naranja-500"
          aria-label="Precio máximo"
        />
        <div className="mt-1.5 flex justify-between text-xs text-grafito">
          <span>{precio(3)}</span>
          <span className="font-semibold text-petroleo-800">
            hasta {precio(filtros.precioMax)}
          </span>
        </div>
      </fieldset>

      {/* Interruptores */}
      <fieldset className="space-y-3">
        <legend className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-petroleo-800">
          Disponibilidad
        </legend>
        {[
          {
            id: "soloDisponibles" as const,
            texto: "Solo productos con stock",
          },
          {
            id: "soloPorMayor" as const,
            texto: "Disponible por mayor",
          },
        ].map((s) => (
          <label
            key={s.id}
            className="flex cursor-pointer items-center justify-between gap-3 text-sm text-grafito"
          >
            {s.texto}
            <input
              type="checkbox"
              checked={filtros[s.id]}
              onChange={(e) => setFiltros({ ...filtros, [s.id]: e.target.checked })}
              className="peer sr-only"
            />
            <span className="relative h-6 w-11 shrink-0 rounded-full bg-crema-300 transition-colors peer-checked:bg-naranja-500 peer-checked:[&>span]:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-naranja-500">
              <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform" />
            </span>
          </label>
        ))}
      </fieldset>

      <button
        type="button"
        onClick={onLimpiar}
        className="w-full rounded-full border border-petroleo-700/15 py-2.5 text-sm font-semibold text-petroleo-800 transition-colors hover:border-petroleo-700/40"
      >
        Limpiar filtros
      </button>
    </div>
  );
}

/* -------------------------------- Catálogo ------------------------------- */

export function Catalogo({ categoriaInicial }: { categoriaInicial?: string }) {
  const [filtros, setFiltros] = useState<Filtros>({
    ...VACIOS,
    categorias: categoriaInicial ? [categoriaInicial] : [],
  });
  const [orden, setOrden] = useState<Orden>("mas-vendidos");
  const [panelAbierto, setPanelAbierto] = useState(false);

  const activos =
    filtros.categorias.length +
    filtros.proteinas.length +
    filtros.durezas.length +
    filtros.tamanos.length +
    filtros.edades.length +
    (filtros.precioMax < PRECIO_MAXIMO ? 1 : 0) +
    (filtros.soloDisponibles ? 1 : 0) +
    (filtros.soloPorMayor ? 1 : 0);

  const resultados = useMemo(() => {
    const filtrados = todos.filter((p: Producto) => {
      if (filtros.categorias.length && !filtros.categorias.includes(p.categoria))
        return false;
      if (
        filtros.proteinas.length &&
        !p.proteinas.some((x) => filtros.proteinas.includes(x))
      )
        return false;
      if (filtros.durezas.length && !filtros.durezas.includes(p.dureza)) return false;
      if (filtros.tamanos.length && !p.tamanos.some((x) => filtros.tamanos.includes(x)))
        return false;
      if (filtros.edades.length && !p.edades.some((x) => filtros.edades.includes(x)))
        return false;
      if (precioDesde(p) > filtros.precioMax) return false;
      if (
        filtros.soloDisponibles &&
        p.presentaciones.every((v) => v.stock === 0)
      )
        return false;
      if (filtros.soloPorMayor && !p.disponiblePorMayor) return false;
      return true;
    });

    const ordenado = [...filtrados];
    switch (orden) {
      case "precio-asc":
        ordenado.sort((a, b) => precioDesde(a) - precioDesde(b));
        break;
      case "precio-desc":
        ordenado.sort((a, b) => precioDesde(b) - precioDesde(a));
        break;
      case "nuevos":
        ordenado.sort((a, b) => b.orden - a.orden);
        break;
      case "recomendados":
        ordenado.sort(
          (a, b) =>
            Number(b.etiquetas.includes("recomendado")) -
              Number(a.etiquetas.includes("recomendado")) || b.ventas - a.ventas,
        );
        break;
      default:
        ordenado.sort((a, b) => b.ventas - a.ventas);
    }
    return ordenado;
  }, [filtros, orden]);

  const limpiar = () => setFiltros(VACIOS);

  return (
    <div className="contenedor grid gap-8 py-12 lg:grid-cols-[16.5rem_1fr] lg:gap-10">
      {/* Filtros escritorio */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 rounded-3xl border border-petroleo-700/10 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-petroleo-900">
              Filtros
            </h2>
            {activos > 0 ? (
              <Pastilla tono="suaveNaranja">{activos} activos</Pastilla>
            ) : null}
          </div>
          <PanelFiltros filtros={filtros} setFiltros={setFiltros} onLimpiar={limpiar} />
        </div>
      </aside>

      {/* Resultados */}
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-grafito">
            <strong className="font-semibold text-petroleo-900">
              {resultados.length}
            </strong>{" "}
            {resultados.length === 1 ? "producto" : "productos"}
            {activos > 0 ? " con los filtros aplicados" : " en el catálogo"}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPanelAbierto(true)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-petroleo-700/15 bg-white px-4 text-sm font-semibold text-petroleo-800 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {activos > 0 ? (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-naranja-500 text-[0.65rem] text-white">
                  {activos}
                </span>
              ) : null}
            </button>

            <div className="relative">
              <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-petroleo-700" />
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value as Orden)}
                aria-label="Ordenar productos"
                className="h-11 cursor-pointer appearance-none rounded-full border border-petroleo-700/15 bg-white pl-11 pr-5 text-sm font-semibold text-petroleo-800 focus:border-naranja-500 focus:outline-none"
              >
                {ORDENES.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {resultados.length === 0 ? (
          <div className="rounded-3xl border border-petroleo-700/10 bg-white">
            <EstadoVacio
              pose="mirada"
              titulo="No encontramos snacks con esos filtros"
              texto="Prueba quitando alguna condición: quizá el rango de precio o la combinación de proteína y dureza es muy estrecha."
              accion={
                <Boton variante="primario" medida="md" onClick={limpiar}>
                  Limpiar filtros
                </Boton>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {resultados.map((p) => (
              <TarjetaProducto key={p.slug} producto={p} />
            ))}
          </div>
        )}
      </div>

      {/* Filtros móvil */}
      <div
        className={cx(
          "fixed inset-0 z-[75] lg:hidden",
          panelAbierto ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!panelAbierto}
      >
        <button
          type="button"
          tabIndex={panelAbierto ? 0 : -1}
          aria-label="Cerrar filtros"
          onClick={() => setPanelAbierto(false)}
          className={cx(
            "absolute inset-0 bg-petroleo-950/45 backdrop-blur-sm transition-opacity duration-300",
            panelAbierto ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cx(
            "absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-3xl bg-crema-50 p-6 transition-transform duration-350 ease-out",
            panelAbierto ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-petroleo-900">
              Filtros
            </h2>
            <button
              type="button"
              onClick={() => setPanelAbierto(false)}
              aria-label="Cerrar"
              className="grid h-10 w-10 place-items-center rounded-full text-petroleo-700 hover:bg-crema-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <PanelFiltros filtros={filtros} setFiltros={setFiltros} onLimpiar={limpiar} />

          <Boton
            variante="primario"
            medida="lg"
            className="mt-6 w-full"
            onClick={() => setPanelAbierto(false)}
          >
            Ver {resultados.length}{" "}
            {resultados.length === 1 ? "producto" : "productos"}
          </Boton>
        </div>
      </div>
    </div>
  );
}
