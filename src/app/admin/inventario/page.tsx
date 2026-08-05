import type { Metadata } from "next";
import Image from "next/image";
import { AlertTriangle, PackageCheck } from "lucide-react";
import { productos, stockTotal } from "@/data/productos";
import { CabeceraModulo, Metrica, Panel, Tabla } from "@/components/admin/Piezas";
import { cx, precio } from "@/lib/formato";

export const metadata: Metadata = { title: "Inventario" };

export default function AdminInventario() {
  const conStock = productos.map((p) => ({ p, stock: stockTotal(p) }));
  const agotados = conStock.filter((x) => x.stock === 0).length;
  const bajos = conStock.filter((x) => x.stock > 0 && x.stock <= 20).length;
  const valorizado = conStock.reduce(
    (t, { p }) =>
      t + p.presentaciones.reduce((s, v) => s + v.precio * v.stock, 0),
    0,
  );

  return (
    <>
      <CabeceraModulo
        titulo="Inventario"
        texto="Stock disponible por producto y presentación."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica etiqueta="Productos activos" valor={String(productos.length)} icono={PackageCheck} />
        <Metrica etiqueta="Con stock bajo" valor={String(bajos)} icono={AlertTriangle} />
        <Metrica etiqueta="Agotados" valor={String(agotados)} icono={AlertTriangle} />
        <Metrica
          etiqueta="Inventario valorizado"
          valor={precio(valorizado)}
          icono={PackageCheck}
        />
      </div>

      <Panel titulo="Stock por presentación">
        <Tabla columnas={["Producto", "Presentación", "Precio", "Stock", "Estado"]}>
          {productos.flatMap((p) =>
            p.presentaciones.map((v, i) => (
              <tr key={`${p.slug}-${v.id}`} className="transition-colors hover:bg-crema-50">
                <td className="px-5 py-3">
                  {i === 0 ? (
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-crema-50">
                        <Image
                          src={p.imagen}
                          alt=""
                          width={70}
                          height={70}
                          className="h-8 w-8 object-contain"
                        />
                      </span>
                      <span className="font-semibold text-petroleo-900">{p.nombre}</span>
                    </div>
                  ) : (
                    <span className="pl-13 text-xs text-grafito">↳</span>
                  )}
                </td>
                <td className="px-5 py-3 text-grafito">{v.etiqueta}</td>
                <td className="px-5 py-3 tabular-nums text-grafito">{precio(v.precio)}</td>
                <td className="px-5 py-3">
                  <input
                    type="number"
                    defaultValue={v.stock}
                    min={0}
                    aria-label={`Stock de ${p.nombre} ${v.etiqueta}`}
                    className="h-9 w-20 rounded-lg border border-petroleo-700/15 bg-white px-2.5 text-sm tabular-nums focus:border-naranja-500 focus:outline-none"
                  />
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cx(
                      "rounded-full px-2.5 py-1 text-xs font-bold",
                      v.stock === 0
                        ? "bg-coral-100 text-coral-500"
                        : v.stock <= 8
                          ? "bg-ambar-100 text-ambar-500"
                          : "bg-hoja-100 text-hoja-600",
                    )}
                  >
                    {v.stock === 0 ? "Agotado" : v.stock <= 8 ? "Stock bajo" : "Disponible"}
                  </span>
                </td>
              </tr>
            )),
          )}
        </Tabla>
      </Panel>
    </>
  );
}
