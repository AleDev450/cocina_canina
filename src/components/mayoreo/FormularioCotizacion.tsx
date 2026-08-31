"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, MessageCircle, Send } from "lucide-react";
import { cotizacionMayor } from "@/lib/whatsapp";
import { tiposNegocio, ANTICIPACION_MAYOR } from "@/data/mayoreo";
import { solicitarCotizacion } from "@/server/acciones/pedidos";
import {
  Aviso,
  BotonEnviar,
  ErrorCampo,
  ESTADO_INICIAL,
} from "@/components/ui/Formulario";
import { Boton, clasesBoton } from "@/components/ui/Boton";
import { AreaTexto, Campo, Select } from "@/components/ui/Campos";
import { EstadoVacio } from "@/components/ui/Elementos";

const MINIMO = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

export function FormularioCotizacion({ whatsapp }: { whatsapp?: string }) {
  const [estado, accion] = useActionState(solicitarCotizacion, ESTADO_INICIAL);

  // Se conservan para poder armar el mensaje de WhatsApp tras el envío.
  const [datos, setDatos] = useState({
    negocio: "",
    productos: "",
    cantidad: "",
    fecha: MINIMO,
  });

  const recordar = (campo: keyof typeof datos) => (valor: string) =>
    setDatos((d) => ({ ...d, [campo]: valor }));

  if (estado.ok) {
    return (
      <div className="rounded-blob border border-petroleo-700/10 bg-white p-8 md:p-12">
        <EstadoVacio
          imagen={{ src: "/images/dante/formulario.png", ancho: 945, alto: 1300 }}
          titulo="¡Solicitud recibida!"
          texto={`Gracias, ${datos.negocio || "vecino"}. Revisaremos disponibilidad y te enviamos la cotización formal en menos de 24 horas hábiles. Si quieres adelantarlo, escríbenos directo por WhatsApp.`}
          accion={
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={cotizacionMayor(datos, whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className={clasesBoton("whatsapp", "md")}
              >
                <MessageCircle className="h-4 w-4" />
                Enviar también por WhatsApp
              </a>
              <Boton href="/productos" variante="contorno" medida="md">
                Seguir viendo el catálogo
              </Boton>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <form
      action={accion}
      className="rounded-blob border border-petroleo-700/10 bg-white p-7 md:p-10"
    >
      <h2 className="font-display text-2xl font-semibold text-petroleo-900">
        Solicita tu cotización
      </h2>
      <p className="mt-2 text-sm text-grafito">{ANTICIPACION_MAYOR}</p>

      <div className="mt-6">
        <Aviso estado={estado} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Campo
            etiqueta="Nombre o razón social"
            name="negocio"
            required
            placeholder="Mascotas del Sur E.I.R.L."
            onChange={(e) => recordar("negocio")(e.target.value)}
          />
          <ErrorCampo estado={estado} campo="negocio" />
        </div>

        <Campo
          etiqueta="RUC"
          name="ruc"
          opcional
          inputMode="numeric"
          placeholder="20123456789"
        />

        <Select etiqueta="Tipo de negocio" name="tipoNegocio" defaultValue={tiposNegocio[0]}>
          {tiposNegocio.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>

        <div>
          <Campo
            etiqueta="Teléfono"
            name="telefono"
            required
            type="tel"
            placeholder="922 035 995"
          />
          <ErrorCampo estado={estado} campo="telefono" />
        </div>

        <div>
          <Campo
            etiqueta="Correo"
            name="correo"
            required
            type="email"
            placeholder="compras@tunegocio.pe"
          />
          <ErrorCampo estado={estado} campo="correo" />
        </div>

        <div className="sm:col-span-2">
          <Campo
            etiqueta="Productos de interés"
            name="productos"
            required
            placeholder="Orejas de cerdo, tráqueas de res…"
            onChange={(e) => recordar("productos")(e.target.value)}
          />
          <ErrorCampo estado={estado} campo="productos" />
        </div>

        <div>
          <Campo
            etiqueta="Cantidad aproximada"
            name="cantidad"
            required
            placeholder="5 docenas + 10 kg"
            onChange={(e) => recordar("cantidad")(e.target.value)}
          />
          <ErrorCampo estado={estado} campo="cantidad" />
        </div>

        <div>
          <Campo
            etiqueta="Fecha requerida"
            name="fecha"
            required
            type="date"
            min={MINIMO}
            defaultValue={MINIMO}
            onChange={(e) => recordar("fecha")(e.target.value)}
            ayuda="Mínimo 3 días desde hoy"
          />
          <ErrorCampo estado={estado} campo="fecha" />
        </div>

        <AreaTexto
          etiqueta="Mensaje"
          name="mensaje"
          opcional
          placeholder="Cuéntanos si necesitas etiquetado especial, frecuencia de reposición o algo más."
          contenedor="sm:col-span-2"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <BotonEnviar medida="lg" enviando="Enviando…">
          <Send className="h-4 w-4" />
          Solicitar cotización
        </BotonEnviar>
        <p className="flex items-center gap-1.5 text-xs text-grafito">
          <CheckCircle2 className="h-3.5 w-3.5 text-hoja-500" />
          Respondemos en menos de 24 horas hábiles
        </p>
      </div>
    </form>
  );
}
