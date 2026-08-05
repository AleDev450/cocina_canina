"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { productos as todos, precioDesde, stockTotal } from "@/data/productos";
import { categorias, nombreDureza, nombreEtiqueta } from "@/data/categorias";
import { cx, normalizar, precio } from "@/lib/formato";
import { Boton } from "@/components/ui/Boton";
import { Etiqueta, Pastilla } from "@/components/ui/Elementos";
import { Panel, Tabla } from "@/components/admin/Piezas";

const CATEGORIAS = categorias.filter((c) =>
  ["dureza-suave", "dureza-media", "larga-duracion"].includes(c.slug),
);

export function TablaProductos() {
  const [consulta, setConsulta] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [inactivos, setInactivos] = useState<string[]>([]);

  const lista = useMemo(() => {
    const q = normalizar(consulta.trim());
    return todos.filter(
      (p) =>
        (categoria === "todas" || p.categoria === categoria) &&
        (q.length < 2 || normalizar(p.nombre).includes(q)),
    );
  }, [consulta, categoria]);

  const alternarActivo = (slug: string) =>
    setInactivos((a) =>
      a.includes(slug) ? a.filter((s) => s !== slug) : [...a, slug],
    );

  return (
    <Panel>
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3 border-b border-petroleo-700/10 p-5">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-grafito" />
          <input
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder="Buscar producto…"
            aria-label="Buscar producto"
            className="h-10 w-full rounded-full border border-petroleo-700/12 bg-crema-50 pl-11 pr-4 text-sm placeholder:text-grafito/60 focus:border-naranja-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[{ slug: "todas", nombre: "Todas" }, ...CATEGORIAS].map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategoria(c.slug)}
              className={cx(
                "rounded-full px-3.5 py-2 text-xs font-semibold transition-colors",
                categoria === c.slug
                  ? "bg-petroleo-700 text-white"
                  : "bg-crema-100 text-grafito hover:text-petroleo-800",
              )}
            >
              {c.nombre.replace("Snacks de ", "")}
            </button>
          ))}
        </div>

        <Boton variante="primario" medida="sm">
          <Plus className="h-3.5 w-3.5" />
          Nuevo producto
        </Boton>
      </div>

      <Tabla
        columnas={[
          "Producto",
          "Categoría",
          "Dureza",
          "Presentaciones",
          "Precio desde",
          "Stock",
          "Etiquetas",
          "Estado",
          "",
        ]}
      >
        {lista.map((p) => {
          const activo = !inactivos.includes(p.slug);
          const stock = stockTotal(p);

          return (
            <tr
              key={p.slug}
              className={cx("transition-colors hover:bg-crema-50", !activo && "opacity-55")}
            >
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-crema-50">
                    <Image
                      src={p.imagen}
                      alt=""
                      width={80}
                      height={80}
                      className="h-9 w-9 object-contain"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5">
                      <span className="font-semibold text-petroleo-900">{p.nombre}</span>
                      {p.destacado ? (
                        <Star className="h-3.5 w-3.5 fill-naranja-500 text-naranja-500" />
                      ) : null}
                    </span>
                    <span className="block text-xs text-grafito">/{p.slug}</span>
                  </span>
                </div>
              </td>
              <td className="px-5 py-3 text-grafito">
                {p.categoria.replace("dureza-", "").replace("-", " ")}
              </td>
              <td className="px-5 py-3 text-grafito">{nombreDureza[p.dureza]}</td>
              <td className="px-5 py-3 tabular-nums text-grafito">
                {p.presentaciones.length}
              </td>
              <td className="px-5 py-3 font-semibold tabular-nums text-petroleo-900">
                {precio(precioDesde(p))}
              </td>
              <td className="px-5 py-3">
                <span
                  className={cx(
                    "rounded-full px-2.5 py-1 text-xs font-bold tabular-nums",
                    stock === 0
                      ? "bg-coral-100 text-coral-500"
                      : stock <= 20
                        ? "bg-ambar-100 text-ambar-500"
                        : "bg-hoja-100 text-hoja-600",
                  )}
                >
                  {stock}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="flex flex-wrap gap-1">
                  {p.etiquetas.length === 0 ? (
                    <span className="text-xs text-grafito">—</span>
                  ) : (
                    p.etiquetas.map((e) => (
                      <Pastilla key={e} tono="contorno">
                        {nombreEtiqueta[e]}
                      </Pastilla>
                    ))
                  )}
                </div>
              </td>
              <td className="px-5 py-3">
                <button
                  type="button"
                  onClick={() => alternarActivo(p.slug)}
                  role="switch"
                  aria-checked={activo}
                  aria-label={`${activo ? "Desactivar" : "Activar"} ${p.nombre}`}
                  className={cx(
                    "relative h-6 w-11 rounded-full transition-colors",
                    activo ? "bg-hoja-500" : "bg-crema-300",
                  )}
                >
                  <span
                    className={cx(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                      activo ? "translate-x-[1.375rem]" : "translate-x-0.5",
                    )}
                  />
                </button>
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    aria-label={`Editar ${p.nombre}`}
                    className="grid h-8 w-8 place-items-center rounded-lg text-grafito transition-colors hover:bg-petroleo-100 hover:text-petroleo-800"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Eliminar ${p.nombre}`}
                    className="grid h-8 w-8 place-items-center rounded-lg text-grafito transition-colors hover:bg-coral-100 hover:text-coral-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </Tabla>

      <div className="flex items-center justify-between gap-3 border-t border-petroleo-700/10 px-5 py-3.5 text-xs text-grafito">
        <span>
          Mostrando {lista.length} de {todos.length} productos
        </span>
        {inactivos.length > 0 ? (
          <Etiqueta tono="suaveCoral">{inactivos.length} desactivados</Etiqueta>
        ) : null}
      </div>
    </Panel>
  );
}
