import type { Metadata } from "next";
import { Save } from "lucide-react";
import { metodosEntrega, metodosPago, sitio } from "@/data/sitio";
import { CabeceraModulo, Panel } from "@/components/admin/Piezas";
import { Boton } from "@/components/ui/Boton";
import { Campo, Casilla, Select } from "@/components/ui/Campos";
import { Pastilla } from "@/components/ui/Elementos";

export const metadata: Metadata = { title: "Configuración" };

export default function AdminConfiguracion() {
  return (
    <>
      <CabeceraModulo
        titulo="Configuración"
        texto="Datos de la empresa, métodos de entrega y pago, e integraciones."
        acciones={
          <Boton variante="primario" medida="sm">
            <Save className="h-3.5 w-3.5" />
            Guardar
          </Boton>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel titulo="Datos de la empresa">
          <div className="space-y-5 p-6">
            <Campo etiqueta="Nombre comercial" defaultValue={sitio.nombre} />
            <Campo etiqueta="RUC" placeholder="20123456789" />
            <Campo etiqueta="Razón social" placeholder="La Cocina Canina S.A.C." />
            <Campo etiqueta="Dirección fiscal" placeholder="Av. …, Lima" />
            <Select etiqueta="Moneda" defaultValue="PEN">
              <option value="PEN">Sol peruano (S/)</option>
              <option value="USD">Dólar (US$)</option>
            </Select>
            <Select etiqueta="Zona horaria" defaultValue="lima">
              <option value="lima">América/Lima (GMT−5)</option>
            </Select>
          </div>
        </Panel>

        <Panel titulo="Métodos de entrega">
          <div className="space-y-4 p-6">
            {metodosEntrega.map((m) => (
              <div
                key={m.id}
                className="flex items-start justify-between gap-4 rounded-2xl bg-crema-50 p-4"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-petroleo-900">{m.nombre}</p>
                  <p className="text-xs text-grafito">{m.detalle}</p>
                </div>
                <div className="shrink-0 text-right">
                  <input
                    type="number"
                    defaultValue={m.costo}
                    min={0}
                    aria-label={`Costo de ${m.nombre}`}
                    className="h-9 w-24 rounded-lg border border-petroleo-700/15 bg-white px-2.5 text-sm tabular-nums focus:border-naranja-500 focus:outline-none"
                  />
                  <p className="mt-1 text-[0.65rem] text-grafito">Costo base (S/)</p>
                </div>
              </div>
            ))}

            <Casilla
              defaultChecked
              etiqueta="Envío gratis a partir de S/ 150 en Lima Metropolitana"
            />
            <Casilla defaultChecked etiqueta="Confirmar el costo exacto por WhatsApp" />
          </div>
        </Panel>

        <Panel titulo="Métodos de pago">
          <div className="space-y-3 p-6">
            {metodosPago.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-4 rounded-2xl bg-crema-50 p-4"
              >
                <div>
                  <p className="font-semibold text-petroleo-900">{m.nombre}</p>
                  <p className="text-xs text-grafito">{m.detalle}</p>
                </div>
                <Pastilla tono={m.activo ? "suaveHoja" : "suaveAmbar"}>
                  {m.activo ? "Activo" : "Próximamente"}
                </Pastilla>
              </div>
            ))}
            <p className="pt-1 text-xs text-grafito">
              La arquitectura ya contempla una pasarela de pagos: al integrarla solo hay
              que activar el método y conectar las credenciales.
            </p>
          </div>
        </Panel>

        <Panel titulo="Integraciones">
          <div className="space-y-5 p-6">
            <Campo
              etiqueta="Número de WhatsApp (con código de país)"
              defaultValue={sitio.whatsapp}
              ayuda="Se usa en todos los botones de pedido"
            />
            <Campo etiqueta="Instagram" defaultValue={`@${sitio.instagram}`} />
            <Campo etiqueta="TikTok" defaultValue={`@${sitio.tiktok}`} />
            <Campo etiqueta="ID de Google Analytics" placeholder="G-XXXXXXXXXX" />
            <Campo etiqueta="Pixel de Meta" placeholder="000000000000000" />

            <div className="space-y-3 border-t border-petroleo-700/10 pt-5">
              <Casilla defaultChecked etiqueta="Mostrar botón flotante de WhatsApp" />
              <Casilla defaultChecked etiqueta="Permitir pedidos sin registro" />
              <Casilla defaultChecked etiqueta="Mostrar productos agotados en el catálogo" />
              <Casilla etiqueta="Modo mantenimiento" />
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
