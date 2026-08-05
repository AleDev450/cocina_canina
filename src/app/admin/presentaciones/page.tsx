import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { productos } from "@/data/productos";
import { CabeceraModulo, Panel, Tabla } from "@/components/admin/Piezas";
import { Boton } from "@/components/ui/Boton";
import { Pastilla } from "@/components/ui/Elementos";
import { precio } from "@/lib/formato";

export const metadata: Metadata = { title: "Presentaciones" };

const NOMBRE_TIPO: Record<string, string> = {
  gramos: "Por gramos",
  unidades: "Por unidades",
  kilogramos: "Por kilogramo",
  talla: "Por talla",
};

export default function AdminPresentaciones() {
  const todas = productos.flatMap((p) =>
    p.presentaciones.map((v) => ({ producto: p.nombre, slug: p.slug, ...v })),
  );

  const porTipo = Object.entries(
    todas.reduce<Record<string, number>>((acc, v) => {
      acc[v.tipo] = (acc[v.tipo] ?? 0) + 1;
      return acc;
    }, {}),
  );

  return (
    <>
      <CabeceraModulo
        titulo="Presentaciones"
        texto="Los formatos de venta de cada producto: gramos, unidades, kilogramos o talla."
        acciones={
          <Boton variante="primario" medida="sm">
            <Plus className="h-3.5 w-3.5" />
            Nueva presentación
          </Boton>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {porTipo.map(([tipo, total]) => (
          <div
            key={tipo}
            className="rounded-2xl border border-petroleo-700/10 bg-white p-4"
          >
            <p className="font-display text-2xl font-semibold text-petroleo-900">
              {total}
            </p>
            <p className="text-xs text-grafito">{NOMBRE_TIPO[tipo] ?? tipo}</p>
          </div>
        ))}
      </div>

      <Panel titulo={`${todas.length} presentaciones activas`}>
        <Tabla columnas={["Producto", "Presentación", "Tipo", "Precio", "Stock", ""]}>
          {todas.map((v) => (
            <tr key={`${v.slug}-${v.id}`} className="transition-colors hover:bg-crema-50">
              <td className="px-5 py-3 font-semibold text-petroleo-900">{v.producto}</td>
              <td className="px-5 py-3 text-grafito">{v.etiqueta}</td>
              <td className="px-5 py-3">
                <Pastilla tono="contorno">{NOMBRE_TIPO[v.tipo] ?? v.tipo}</Pastilla>
              </td>
              <td className="px-5 py-3 font-semibold tabular-nums text-petroleo-900">
                {precio(v.precio)}
              </td>
              <td className="px-5 py-3 tabular-nums text-grafito">{v.stock}</td>
              <td className="px-5 py-3 text-right">
                <button
                  type="button"
                  className="text-xs font-semibold text-naranja-600 hover:underline"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </Tabla>
      </Panel>
    </>
  );
}
