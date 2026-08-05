"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, MessageCircle, Send } from "lucide-react";
import { cotizacionMayor } from "@/lib/whatsapp";
import { tiposNegocio, ANTICIPACION_MAYOR } from "@/data/mayoreo";
import { Boton, clasesBoton } from "@/components/ui/Boton";
import { AreaTexto, Campo, Select } from "@/components/ui/Campos";
import { EstadoVacio } from "@/components/ui/Elementos";

const HOY = new Date();
const MINIMO = new Date(HOY.getTime() + 3 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);

export function FormularioCotizacion() {
  const [enviado, setEnviado] = useState(false);
  const [datos, setDatos] = useState({
    negocio: "",
    ruc: "",
    telefono: "",
    correo: "",
    tipo: tiposNegocio[0],
    productos: "",
    cantidad: "",
    fecha: MINIMO,
    mensaje: "",
  });

  const actualizar = (campo: keyof typeof datos) => (valor: string) =>
    setDatos((d) => ({ ...d, [campo]: valor }));

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="rounded-blob border border-petroleo-700/10 bg-white p-8 md:p-12">
        <EstadoVacio
          pose="saltando"
          titulo="¡Solicitud recibida!"
          texto={`Gracias, ${datos.negocio || "vecino"}. Revisaremos disponibilidad y te enviamos la cotización formal en menos de 24 horas hábiles. Si quieres adelantarlo, escríbenos directo por WhatsApp.`}
          accion={
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={cotizacionMayor({
                  negocio: datos.negocio,
                  productos: datos.productos,
                  cantidad: datos.cantidad,
                  fecha: datos.fecha,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className={clasesBoton("whatsapp", "md")}
              >
                <MessageCircle className="h-4 w-4" />
                Enviar también por WhatsApp
              </a>
              <Boton variante="contorno" medida="md" onClick={() => setEnviado(false)}>
                Hacer otra solicitud
              </Boton>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={enviar}
      className="rounded-blob border border-petroleo-700/10 bg-white p-7 md:p-10"
    >
      <h2 className="font-display text-2xl font-semibold text-petroleo-900">
        Solicita tu cotización
      </h2>
      <p className="mt-2 text-sm text-grafito">{ANTICIPACION_MAYOR}</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Campo
          etiqueta="Nombre o razón social"
          required
          placeholder="Mascotas del Sur E.I.R.L."
          value={datos.negocio}
          onChange={(e) => actualizar("negocio")(e.target.value)}
          contenedor="sm:col-span-2"
        />
        <Campo
          etiqueta="RUC"
          opcional
          inputMode="numeric"
          placeholder="20123456789"
          value={datos.ruc}
          onChange={(e) => actualizar("ruc")(e.target.value)}
        />
        <Select
          etiqueta="Tipo de negocio"
          value={datos.tipo}
          onChange={(e) => actualizar("tipo")(e.target.value)}
        >
          {tiposNegocio.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Campo
          etiqueta="Teléfono"
          required
          type="tel"
          placeholder="922 035 995"
          value={datos.telefono}
          onChange={(e) => actualizar("telefono")(e.target.value)}
        />
        <Campo
          etiqueta="Correo"
          required
          type="email"
          placeholder="compras@tunegocio.pe"
          value={datos.correo}
          onChange={(e) => actualizar("correo")(e.target.value)}
        />
        <Campo
          etiqueta="Productos de interés"
          required
          placeholder="Orejas de cerdo, tráqueas de res…"
          value={datos.productos}
          onChange={(e) => actualizar("productos")(e.target.value)}
          contenedor="sm:col-span-2"
        />
        <Campo
          etiqueta="Cantidad aproximada"
          required
          placeholder="5 docenas + 10 kg"
          value={datos.cantidad}
          onChange={(e) => actualizar("cantidad")(e.target.value)}
        />
        <Campo
          etiqueta="Fecha requerida"
          required
          type="date"
          min={MINIMO}
          value={datos.fecha}
          onChange={(e) => actualizar("fecha")(e.target.value)}
          ayuda="Mínimo 3 días desde hoy"
        />
        <AreaTexto
          etiqueta="Mensaje"
          opcional
          placeholder="Cuéntanos si necesitas etiquetado especial, frecuencia de reposición o algo más."
          value={datos.mensaje}
          onChange={(e) => actualizar("mensaje")(e.target.value)}
          contenedor="sm:col-span-2"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Boton type="submit" variante="primario" medida="lg">
          <Send className="h-4 w-4" />
          Solicitar cotización
        </Boton>
        <p className="flex items-center gap-1.5 text-xs text-grafito">
          <CheckCircle2 className="h-3.5 w-3.5 text-hoja-500" />
          Respondemos en menos de 24 horas hábiles
        </p>
      </div>
    </form>
  );
}
