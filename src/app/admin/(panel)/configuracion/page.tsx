import type { Metadata } from "next";
import { obtenerConfiguracion } from "@/server/contenido";
import { exigirGrupo } from "@/server/sesion";
import {
  FormularioEmpresa,
  FormularioEntrega,
  FormularioIntegraciones,
} from "@/components/admin/PanelConfiguracion";
import { CabeceraModulo } from "@/components/admin/Piezas";

export const metadata: Metadata = { title: "Configuración" };

export default async function AdminConfiguracion() {
  await exigirGrupo("Sistema");
  const config = await obtenerConfiguracion();

  return (
    <>
      <CabeceraModulo
        titulo="Configuración"
        texto="Datos de la empresa, métodos de entrega y pago, e integraciones."
      />

      <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
        <div className="space-y-6">
          <FormularioEmpresa empresa={config.empresa} />
          <FormularioEntrega entrega={config.entrega} />
        </div>

        <div>
          <FormularioIntegraciones
            integraciones={config.integraciones}
            metodosPago={config.pago.metodos}
          />
        </div>
      </div>
    </>
  );
}
