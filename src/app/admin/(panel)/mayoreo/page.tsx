import type { Metadata } from "next";
import { Truck } from "lucide-react";
import { obtenerCotizaciones } from "@/server/pedidos";
import { obtenerLotesMayorAdmin } from "@/server/catalogo";
import { exigirGrupo } from "@/server/sesion";
import { PanelMayoreo } from "@/components/admin/PanelMayoreo";
import { CabeceraModulo, Metrica } from "@/components/admin/Piezas";
import { precio } from "@/lib/formato";

export const metadata: Metadata = { title: "Ventas por mayor" };

export default async function AdminMayoreo() {
  await exigirGrupo("Operación");

  const [cotizaciones, lotes] = await Promise.all([
    obtenerCotizaciones(),
    obtenerLotesMayorAdmin(),
  ]);

  const mesActual = new Date().toISOString().slice(0, 7);
  const delMes = cotizaciones.filter((c) => c.creadoEn.slice(0, 7) === mesActual);
  const montoCotizado = cotizaciones.reduce((t, c) => t + (c.monto ?? 0), 0);

  return (
    <>
      <CabeceraModulo
        titulo="Ventas por mayor"
        texto="Solicitudes de cotización y lista de precios a granel."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metrica
          etiqueta="Solicitudes del mes"
          valor={String(delMes.length)}
          icono={Truck}
        />
        <Metrica etiqueta="Monto cotizado" valor={precio(montoCotizado)} icono={Truck} />
        <Metrica etiqueta="Lotes activos" valor={String(lotes.length)} icono={Truck} />
      </div>

      <PanelMayoreo cotizaciones={cotizaciones} lotes={lotes} />
    </>
  );
}
