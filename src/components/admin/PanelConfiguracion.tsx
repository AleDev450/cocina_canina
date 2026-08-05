"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import type { Configuracion } from "@/server/contenido";
import {
  guardarEmpresa,
  guardarEntrega,
  guardarIntegraciones,
} from "@/server/acciones/contenido";
import { Campo, Casilla } from "@/components/ui/Campos";
import { Aviso, BotonEnviar, ErrorCampo, ESTADO_INICIAL } from "@/components/ui/Formulario";
import { Panel } from "@/components/admin/Piezas";
import { Pastilla } from "@/components/ui/Elementos";

export function FormularioEmpresa({ empresa }: { empresa: Configuracion["empresa"] }) {
  const [estado, accion] = useActionState(guardarEmpresa, ESTADO_INICIAL);

  return (
    <Panel titulo="Datos de la empresa">
      <form action={accion} className="space-y-5 p-6">
        <Aviso estado={estado} />
        <div>
          <Campo
            etiqueta="Nombre comercial"
            name="nombre"
            required
            defaultValue={empresa.nombre}
          />
          <ErrorCampo estado={estado} campo="nombre" />
        </div>
        <Campo etiqueta="RUC" name="ruc" defaultValue={empresa.ruc} placeholder="20123456789" />
        <Campo
          etiqueta="Razón social"
          name="razonSocial"
          defaultValue={empresa.razonSocial}
          placeholder="La Cocina Canina S.A.C."
        />
        <Campo
          etiqueta="Dirección fiscal"
          name="direccion"
          defaultValue={empresa.direccion}
        />
        <BotonEnviar medida="md">
          <Save className="h-4 w-4" />
          Guardar
        </BotonEnviar>
      </form>
    </Panel>
  );
}

export function FormularioEntrega({
  entrega,
}: {
  entrega: Configuracion["entrega"];
}) {
  const [estado, accion] = useActionState(guardarEntrega, ESTADO_INICIAL);

  const delivery = entrega.metodos.find((m) => m.id === "delivery");
  const recojo = entrega.metodos.find((m) => m.id === "recojo");

  return (
    <Panel titulo="Métodos de entrega">
      <form action={accion} className="space-y-5 p-6">
        <Aviso estado={estado} />
        <Campo
          etiqueta="Costo de delivery (S/)"
          name="costoDelivery"
          type="number"
          min={0}
          step="0.5"
          defaultValue={delivery?.costo ?? 12}
          ayuda="Se aplica cuando el cliente elige delivery"
        />
        <Campo
          etiqueta="Costo de recojo (S/)"
          name="costoRecojo"
          type="number"
          min={0}
          defaultValue={recojo?.costo ?? 0}
        />
        <Campo
          etiqueta="Envío gratis a partir de (S/)"
          name="envioGratisDesde"
          type="number"
          min={0}
          defaultValue={entrega.envioGratisDesde}
          ayuda="0 para desactivar el beneficio"
        />
        <BotonEnviar medida="md">
          <Save className="h-4 w-4" />
          Guardar
        </BotonEnviar>
      </form>
    </Panel>
  );
}

export function FormularioIntegraciones({
  integraciones,
  metodosPago,
}: {
  integraciones: Configuracion["integraciones"];
  metodosPago: Configuracion["pago"]["metodos"];
}) {
  const [estado, accion] = useActionState(guardarIntegraciones, ESTADO_INICIAL);

  return (
    <>
      <Panel titulo="Métodos de pago" className="mb-6">
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

      <Panel titulo="Integraciones y comportamiento">
        <form action={accion} className="space-y-5 p-6">
          <Aviso estado={estado} />

          <div>
            <Campo
              etiqueta="Número de WhatsApp (con código de país)"
              name="whatsapp"
              required
              defaultValue={integraciones.whatsapp}
              ayuda="Se usa en todos los botones de pedido"
            />
            <ErrorCampo estado={estado} campo="whatsapp" />
          </div>
          <Campo
            etiqueta="Instagram"
            name="instagram"
            defaultValue={`@${integraciones.instagram}`}
          />
          <Campo etiqueta="TikTok" name="tiktok" defaultValue={`@${integraciones.tiktok}`} />
          <Campo
            etiqueta="ID de Google Analytics"
            name="analytics"
            defaultValue={integraciones.analytics}
            placeholder="G-XXXXXXXXXX"
          />
          <Campo
            etiqueta="Pixel de Meta"
            name="metaPixel"
            defaultValue={integraciones.metaPixel}
            placeholder="000000000000000"
          />

          <div className="space-y-3 border-t border-petroleo-700/10 pt-5">
            <Casilla
              name="botonFlotante"
              defaultChecked={integraciones.botonFlotante}
              etiqueta="Mostrar botón flotante de WhatsApp"
            />
            <Casilla
              name="pedidoSinRegistro"
              defaultChecked={integraciones.pedidoSinRegistro}
              etiqueta="Permitir pedidos sin registro"
            />
            <Casilla
              name="mostrarAgotados"
              defaultChecked={integraciones.mostrarAgotados}
              etiqueta="Mostrar productos agotados en el catálogo"
            />
            <Casilla
              name="mantenimiento"
              defaultChecked={integraciones.mantenimiento}
              etiqueta="Modo mantenimiento"
            />
          </div>

          <BotonEnviar medida="md">
            <Save className="h-4 w-4" />
            Guardar
          </BotonEnviar>
        </form>
      </Panel>
    </>
  );
}
