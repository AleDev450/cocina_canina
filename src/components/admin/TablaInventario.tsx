"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { Save, Search } from "lucide-react";
import { guardarInventario } from "@/server/acciones/catalogo";
import { cx, normalizar, precio } from "@/lib/formato";
import { Aviso, BotonEnviar, ESTADO_INICIAL } from "@/components/ui/Formulario";
import { Panel, Tabla } from "@/components/admin/Piezas";

export interface FilaInventario {
  id: string;
  etiqueta: string;
  tipo: string;
  precio: number;
  stock: number;
  productoSlug: string;
  productoNombre: string;
  productoImagen: string;
}

export function TablaInventario({ filas }: { filas: FilaInventario[] }) {
  const [estado, accion] = useActionState(guardarInventario, ESTADO_INICIAL);
  const [consulta, setConsulta] = useState("");
  const [soloBajos, setSoloBajos] = useState(false);

  const lista = useMemo(() => {
    const q = normalizar(consulta.trim());
    return filas.filter(
      (f) =>
        (!soloBajos || f.stock <= 8) &&
        (q.length < 2 || normalizar(`${f.productoNombre} ${f.etiqueta}`).includes(q)),
    );
  }, [filas, consulta, soloBajos]);

  return (
    <form action={accion}>
      <Panel
        titulo="Stock por presentación"
        descripcion="Edita las cantidades y guarda todo de una vez"
        acciones={
          <BotonEnviar medida="sm">
            <Save className="h-3.5 w-3.5" />
            Guardar stock
          </BotonEnviar>
        }
      >
        <div className="flex flex-wrap items-center gap-3 border-b border-petroleo-700/10 p-5">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-grafito" />
            <input
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder="Buscar producto o presentación…"
              aria-label="Buscar en el inventario"
              className="h-10 w-full rounded-full border border-petroleo-700/12 bg-crema-50 pl-11 pr-4 text-sm placeholder:text-grafito/60 focus:border-naranja-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setSoloBajos((v) => !v)}
            className={cx(
              "rounded-full px-4 py-2 text-xs font-semibold transition-colors",
              soloBajos
                ? "bg-coral-500 text-white"
                : "bg-crema-100 text-grafito hover:text-petroleo-800",
            )}
          >
            Solo stock bajo
          </button>
        </div>

        {estado.mensaje ? (
          <div className="px-5 pt-4">
            <Aviso estado={estado} />
          </div>
        ) : null}

        <Tabla columnas={["Producto", "Presentación", "Precio", "Stock", "Estado"]}>
          {lista.map((f) => (
            <tr key={f.id} className="transition-colors hover:bg-crema-50">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-crema-50">
                    <Image
                      src={f.productoImagen}
                      alt=""
                      width={70}
                      height={70}
                      className="h-8 w-8 object-contain"
                      unoptimized={f.productoImagen.startsWith("http")}
                    />
                  </span>
                  <Link
                    href={`/admin/productos/${f.productoSlug}`}
                    className="font-semibold text-petroleo-900 hover:text-naranja-600"
                  >
                    {f.productoNombre}
                  </Link>
                </div>
              </td>
              <td className="px-5 py-3 text-grafito">{f.etiqueta}</td>
              <td className="px-5 py-3 tabular-nums text-grafito">{precio(f.precio)}</td>
              <td className="px-5 py-3">
                <input
                  type="number"
                  name={`stock:${f.id}`}
                  defaultValue={f.stock}
                  min={0}
                  aria-label={`Stock de ${f.productoNombre} ${f.etiqueta}`}
                  className="h-9 w-20 rounded-lg border border-petroleo-700/15 bg-white px-2.5 text-sm tabular-nums focus:border-naranja-500 focus:outline-none"
                />
              </td>
              <td className="px-5 py-3">
                <span
                  className={cx(
                    "rounded-full px-2.5 py-1 text-xs font-bold",
                    f.stock === 0
                      ? "bg-coral-100 text-coral-500"
                      : f.stock <= 8
                        ? "bg-ambar-100 text-ambar-500"
                        : "bg-hoja-100 text-hoja-600",
                  )}
                >
                  {f.stock === 0 ? "Agotado" : f.stock <= 8 ? "Stock bajo" : "Disponible"}
                </span>
              </td>
            </tr>
          ))}
        </Tabla>

        <div className="flex items-center justify-between gap-3 border-t border-petroleo-700/10 px-5 py-4">
          <span className="text-xs text-grafito">
            {lista.length} de {filas.length} presentaciones
          </span>
          <BotonEnviar medida="sm">
            <Save className="h-3.5 w-3.5" />
            Guardar stock
          </BotonEnviar>
        </div>
      </Panel>
    </form>
  );
}
