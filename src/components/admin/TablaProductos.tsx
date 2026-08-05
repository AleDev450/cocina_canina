"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Pencil, Search, Star, Trash2 } from "lucide-react";
import type { Producto, Categoria } from "@/lib/tipos";
import {
  alternarProductoActivo,
  alternarProductoDestacado,
  eliminarProducto,
} from "@/server/acciones/catalogo";
import { nombreDureza, nombreEtiqueta } from "@/data/categorias";
import { cx, normalizar, precio } from "@/lib/formato";
import { Pastilla } from "@/components/ui/Elementos";
import { Panel, Tabla } from "@/components/admin/Piezas";
import { BotonAccion, Interruptor } from "@/components/admin/Controles";

type Fila = Producto & { id: string; activo: boolean };

export function TablaProductos({
  productos,
  categorias,
}: {
  productos: Fila[];
  categorias: Categoria[];
}) {
  const [consulta, setConsulta] = useState("");
  const [categoria, setCategoria] = useState("todas");

  const lista = useMemo(() => {
    const q = normalizar(consulta.trim());
    return productos.filter(
      (p) =>
        (categoria === "todas" || p.categoria === categoria) &&
        (q.length < 2 || normalizar(`${p.nombre} ${p.slug}`).includes(q)),
    );
  }, [productos, consulta, categoria]);

  return (
    <Panel>
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
          {[{ slug: "todas", nombre: "Todas" }, ...categorias].map((c) => (
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
      </div>

      <Tabla
        columnas={[
          "Producto",
          "Categoría",
          "Dureza",
          "Present.",
          "Desde",
          "Stock",
          "Etiquetas",
          "Destacado",
          "Activo",
          "",
        ]}
      >
        {lista.map((p) => {
          const stock = p.presentaciones.reduce((t, v) => t + v.stock, 0);
          const desde = p.presentaciones.length
            ? Math.min(...p.presentaciones.map((v) => v.precio))
            : 0;

          return (
            <tr
              key={p.id}
              className={cx(
                "transition-colors hover:bg-crema-50",
                !p.activo && "opacity-55",
              )}
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
                      unoptimized={p.imagen.startsWith("http")}
                    />
                  </span>
                  <span className="min-w-0">
                    <Link
                      href={`/admin/productos/${p.slug}`}
                      className="font-semibold text-petroleo-900 hover:text-naranja-600"
                    >
                      {p.nombre}
                    </Link>
                    <span className="block text-xs text-grafito">/{p.slug}</span>
                  </span>
                </div>
              </td>
              <td className="px-5 py-3 text-grafito">
                {categorias.find((c) => c.slug === p.categoria)?.nombre.replace(
                  "Snacks de ",
                  "",
                ) ?? p.categoria}
              </td>
              <td className="px-5 py-3 text-grafito">{nombreDureza[p.dureza]}</td>
              <td className="px-5 py-3 tabular-nums text-grafito">
                {p.presentaciones.length}
              </td>
              <td className="px-5 py-3 font-semibold tabular-nums text-petroleo-900">
                {precio(desde)}
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
                <BotonAccion
                  etiqueta={`${p.destacado ? "Quitar de" : "Marcar como"} destacado: ${p.nombre}`}
                  accion={() => alternarProductoDestacado(p.id, !p.destacado)}
                  className="grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-crema-100"
                >
                  <Star
                    className={cx(
                      "h-4 w-4",
                      p.destacado
                        ? "fill-naranja-500 text-naranja-500"
                        : "text-grafito/50",
                    )}
                  />
                </BotonAccion>
              </td>
              <td className="px-5 py-3">
                <Interruptor
                  activo={p.activo}
                  etiqueta={`Activar o desactivar ${p.nombre}`}
                  alCambiar={(valor) => alternarProductoActivo(p.id, valor)}
                />
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-1">
                  <Link
                    href={`/admin/productos/${p.slug}`}
                    aria-label={`Editar ${p.nombre}`}
                    className="grid h-8 w-8 place-items-center rounded-lg text-grafito transition-colors hover:bg-petroleo-100 hover:text-petroleo-800"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                  <BotonAccion
                    etiqueta={`Eliminar ${p.nombre}`}
                    confirmar={`¿Eliminar «${p.nombre}»? Se borrarán también sus presentaciones. Esta acción no se puede deshacer.`}
                    accion={() => eliminarProducto(p.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-grafito transition-colors hover:bg-coral-100 hover:text-coral-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </BotonAccion>
                </div>
              </td>
            </tr>
          );
        })}
      </Tabla>

      <div className="border-t border-petroleo-700/10 px-5 py-3.5 text-xs text-grafito">
        Mostrando {lista.length} de {productos.length} productos ·{" "}
        {productos.filter((p) => !p.activo).length} desactivados
      </div>
    </Panel>
  );
}
