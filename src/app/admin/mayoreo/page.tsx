import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { lotesMayor, tiposNegocio } from "@/data/mayoreo";
import { CabeceraModulo, Metrica, Panel, Tabla } from "@/components/admin/Piezas";
import { Boton } from "@/components/ui/Boton";
import { Pastilla } from "@/components/ui/Elementos";
import { fechaCorta, precio } from "@/lib/formato";
import { Truck } from "lucide-react";

export const metadata: Metadata = { title: "Ventas por mayor" };

const SOLICITUDES = [
  {
    id: "COT-208",
    negocio: "Mascotas del Sur E.I.R.L.",
    tipo: tiposNegocio[0],
    productos: "Orejas de cerdo, tráqueas de res",
    cantidad: "10 docenas + 10 kg",
    fecha: "2026-08-09",
    estado: "Pendiente",
    monto: 1430,
  },
  {
    id: "COT-207",
    negocio: "Veterinaria Patitas",
    tipo: tiposNegocio[1],
    productos: "Bofe de res 80 g",
    cantidad: "104 unidades",
    fecha: "2026-08-07",
    estado: "Cotizado",
    monto: 884,
  },
  {
    id: "COT-206",
    negocio: "Distribuidora Andina",
    tipo: tiposNegocio[2],
    productos: "Patitas de pollo, pejerrey",
    cantidad: "10 kg + 50 bolsas",
    fecha: "2026-08-03",
    estado: "Aprobado",
    monto: 1550,
  },
];

export default function AdminMayoreo() {
  return (
    <>
      <CabeceraModulo
        titulo="Ventas por mayor"
        texto="Solicitudes de cotización y lista de precios a granel."
        acciones={
          <Boton variante="primario" medida="sm">
            <Plus className="h-3.5 w-3.5" />
            Nuevo lote
          </Boton>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metrica etiqueta="Solicitudes del mes" valor="3" icono={Truck} variacion={20} />
        <Metrica etiqueta="Monto cotizado" valor={precio(3864)} icono={Truck} />
        <Metrica etiqueta="Lotes activos" valor={String(lotesMayor.length)} icono={Truck} />
      </div>

      <Panel titulo="Solicitudes de cotización" className="mb-6">
        <Tabla
          columnas={[
            "N.º",
            "Negocio",
            "Tipo",
            "Productos",
            "Cantidad",
            "Fecha requerida",
            "Estado",
            "Monto",
          ]}
        >
          {SOLICITUDES.map((s) => (
            <tr key={s.id} className="transition-colors hover:bg-crema-50">
              <td className="px-5 py-3.5 font-semibold text-petroleo-900">{s.id}</td>
              <td className="px-5 py-3.5 text-petroleo-900">{s.negocio}</td>
              <td className="px-5 py-3.5 text-grafito">{s.tipo}</td>
              <td className="px-5 py-3.5 text-grafito">{s.productos}</td>
              <td className="px-5 py-3.5 text-grafito">{s.cantidad}</td>
              <td className="px-5 py-3.5 text-grafito">{fechaCorta(s.fecha)}</td>
              <td className="px-5 py-3.5">
                <Pastilla
                  tono={
                    s.estado === "Aprobado"
                      ? "suaveHoja"
                      : s.estado === "Cotizado"
                        ? "suavePetroleo"
                        : "suaveAmbar"
                  }
                >
                  {s.estado}
                </Pastilla>
              </td>
              <td className="px-5 py-3.5 font-semibold tabular-nums text-petroleo-900">
                {precio(s.monto)}
              </td>
            </tr>
          ))}
        </Tabla>
      </Panel>

      <Panel
        titulo="Lista de precios por mayor"
        descripcion="Presentaciones y precios que se muestran en la web"
      >
        <Tabla columnas={["Lote", "Unidad", "Mínimo", "Presentaciones", ""]}>
          {lotesMayor.map((l) => (
            <tr key={l.slug} className="transition-colors hover:bg-crema-50">
              <td className="px-5 py-3.5 font-semibold text-petroleo-900">{l.nombre}</td>
              <td className="px-5 py-3.5 text-grafito">{l.unidad}</td>
              <td className="px-5 py-3.5 text-grafito">{l.minimo}</td>
              <td className="px-5 py-3.5">
                <div className="flex flex-wrap gap-1.5">
                  {l.presentaciones.map((p) => (
                    <Pastilla key={p.etiqueta} tono="contorno">
                      {p.etiqueta}: {precio(p.precio)}
                    </Pastilla>
                  ))}
                </div>
              </td>
              <td className="px-5 py-3.5 text-right">
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
