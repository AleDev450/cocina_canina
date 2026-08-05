"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { Save, Search } from "lucide-react";
import { guardarInventario } from "@/server/acciones/catalogo";
import { normalizar } from "@/lib/formato";
import { Aviso, BotonEnviar, ESTADO_INICIAL } from "@/components/ui/Formulario";
import { Panel, Tabla } from "@/components/admin/Piezas";
import { Pastilla } from "@/components/ui/Elementos";
import type { FilaInventario } from "@/components/admin/TablaInventario";

const NOMBRE_TIPO: Record<string, string> = {
  gramos: "Por gramos",
  unidades: "Por unidades",
  kilogramos: "Por kilogramo",
  talla: "Por talla",
};

export function TablaPresentaciones({ filas }: { filas: FilaInventario[] }) {
  const [estado, accion] = useActionState(guardarInventario, ESTADO_INICIAL);
  const [consulta, setConsulta] = useState("");

  const lista = useMemo(() => {
    const q = normalizar(consulta.trim());
    return filas.filter(
      (f) =>
        q.length < 2 || normalizar(`${f.productoNombre} ${f.etiqueta}`).includes(q),
    );
  }, [filas, consulta]);

  return (
    <form action={accion}>
      <Panel
        titulo={`${filas.length} presentaciones activas`}
        acciones={
          <BotonEnviar medida="sm">
            <Save className="h-3.5 w-3.5" />
            Guardar cambios
          </BotonEnviar>
        }
      >
        <div className="border-b border-petroleo-700/10 p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-grafito" />
            <input
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder="Buscar presentación…"
              aria-label="Buscar presentación"
              className="h-10 w-full rounded-full border border-petroleo-700/12 bg-crema-50 pl-11 pr-4 text-sm placeholder:text-grafito/60 focus:border-naranja-500 focus:outline-none"
            />
          </div>
        </div>

        {estado.mensaje ? (
          <div className="px-5 pt-4">
            <Aviso estado={estado} />
          </div>
        ) : null}

        <Tabla
          columnas={["Producto", "Presentación", "Tipo", "Precio (S/)", "Stock", ""]}
        >
          {lista.map((f) => (
            <tr key={f.id} className="transition-colors hover:bg-crema-50">
              <td className="px-5 py-3">
                <Link
                  href={`/admin/productos/${f.productoSlug}`}
                  className="font-semibold text-petroleo-900 hover:text-naranja-600"
                >
                  {f.productoNombre}
                </Link>
              </td>
              <td className="px-5 py-3 text-grafito">{f.etiqueta}</td>
              <td className="px-5 py-3">
                <Pastilla tono="contorno">{NOMBRE_TIPO[f.tipo] ?? f.tipo}</Pastilla>
              </td>
              <td className="px-5 py-3">
                <input
                  type="number"
                  name={`precio:${f.id}`}
                  defaultValue={f.precio}
                  min={0}
                  step="0.5"
                  aria-label={`Precio de ${f.productoNombre} ${f.etiqueta}`}
                  className="h-9 w-24 rounded-lg border border-petroleo-700/15 bg-white px-2.5 text-sm tabular-nums focus:border-naranja-500 focus:outline-none"
                />
              </td>
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
              <td className="px-5 py-3 text-right">
                <Link
                  href={`/admin/productos/${f.productoSlug}`}
                  className="text-xs font-semibold text-naranja-600 hover:underline"
                >
                  Ver producto
                </Link>
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
            Guardar cambios
          </BotonEnviar>
        </div>
      </Panel>
    </form>
  );
}
