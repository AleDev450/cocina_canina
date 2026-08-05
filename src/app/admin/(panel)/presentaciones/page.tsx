import type { Metadata } from "next";
import { obtenerInventario } from "@/server/catalogo";
import { exigirGrupo } from "@/server/sesion";
import { TablaPresentaciones } from "@/components/admin/TablaPresentaciones";
import { CabeceraModulo } from "@/components/admin/Piezas";

export const metadata: Metadata = { title: "Presentaciones" };

const NOMBRE_TIPO: Record<string, string> = {
  gramos: "Por gramos",
  unidades: "Por unidades",
  kilogramos: "Por kilogramo",
  talla: "Por talla",
};

export default async function AdminPresentaciones() {
  await exigirGrupo("Catálogo");
  const filas = await obtenerInventario();

  const porTipo = Object.entries(
    filas.reduce<Record<string, number>>((acc, f) => {
      acc[f.tipo] = (acc[f.tipo] ?? 0) + 1;
      return acc;
    }, {}),
  );

  return (
    <>
      <CabeceraModulo
        titulo="Presentaciones"
        texto="Todos los formatos de venta del catálogo. Edita precios y stock aquí, o entra a un producto para agregar o quitar formatos."
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

      <TablaPresentaciones filas={filas} />
    </>
  );
}
