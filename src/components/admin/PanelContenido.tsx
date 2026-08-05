"use client";

import { useActionState, useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Save } from "lucide-react";
import {
  alternarSeccion,
  guardarBloqueWhatsapp,
  guardarColores,
  guardarContacto,
  guardarHero,
  guardarNosotros,
  reordenarSecciones,
} from "@/server/acciones/contenido";
import type { SeccionInicio } from "@/server/contenido";
import type { hero as Hero, quienesSomos as Nosotros } from "@/data/sitio";
import { AreaTexto, Campo } from "@/components/ui/Campos";
import { Aviso, BotonEnviar, ErrorCampo, ESTADO_INICIAL } from "@/components/ui/Formulario";
import { Panel } from "@/components/admin/Piezas";
import { Interruptor } from "@/components/admin/Controles";

type BloqueHero = typeof Hero;
type BloqueNosotros = typeof Nosotros;

/* ---------------------------------- Hero ---------------------------------- */

export function FormularioHero({ hero }: { hero: BloqueHero }) {
  const [estado, accion] = useActionState(guardarHero, ESTADO_INICIAL);

  return (
    <Panel titulo="Hero principal" descripcion="Lo primero que se ve al entrar">
      <form action={accion} className="space-y-5 p-6">
        <Aviso estado={estado} />

        <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
          <div>
            <Campo etiqueta="Título" name="titulo" required defaultValue={hero.titulo} />
            <ErrorCampo estado={estado} campo="titulo" />
          </div>
          <Campo
            etiqueta="Palabra resaltada"
            name="tituloResaltado"
            required
            defaultValue={hero.tituloResaltado}
            ayuda="Se muestra en naranja"
          />
        </div>

        <div>
          <AreaTexto
            etiqueta="Subtítulo"
            name="subtitulo"
            rows={3}
            required
            defaultValue={hero.subtitulo}
          />
          <ErrorCampo estado={estado} campo="subtitulo" />
        </div>

        <Campo
          etiqueta="Texto del sello circular"
          name="sello"
          required
          defaultValue={hero.sello}
        />

        <div>
          <span className="mb-3 block text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800">
            Beneficios destacados
          </span>
          <div className="grid gap-3 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-3 rounded-2xl bg-crema-50 p-4">
                <Campo
                  etiqueta={`Beneficio ${i + 1}`}
                  name={`beneficio${i}`}
                  defaultValue={hero.beneficios[i]?.titulo ?? ""}
                />
                <Campo
                  etiqueta="Detalle"
                  name={`detalle${i}`}
                  defaultValue={hero.beneficios[i]?.detalle ?? ""}
                />
              </div>
            ))}
          </div>
        </div>

        <BotonEnviar medida="md">
          <Save className="h-4 w-4" />
          Guardar portada
        </BotonEnviar>
      </form>
    </Panel>
  );
}

/* ------------------------------ Quiénes somos ----------------------------- */

export function FormularioNosotros({ nosotros }: { nosotros: BloqueNosotros }) {
  const [estado, accion] = useActionState(guardarNosotros, ESTADO_INICIAL);

  return (
    <Panel titulo="Quiénes somos">
      <form action={accion} className="space-y-5 p-6">
        <Aviso estado={estado} />

        <div>
          <Campo
            etiqueta="Título"
            name="titulo"
            required
            defaultValue={nosotros.titulo}
          />
          <ErrorCampo estado={estado} campo="titulo" />
        </div>

        <div>
          <AreaTexto
            etiqueta="Texto introductorio"
            name="texto"
            rows={4}
            required
            defaultValue={nosotros.texto}
          />
          <ErrorCampo estado={estado} campo="texto" />
        </div>

        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-3 rounded-2xl bg-crema-50 p-4">
            <Campo
              etiqueta={`Valor ${i + 1}`}
              name={`valor${i}`}
              defaultValue={nosotros.valores[i]?.titulo ?? ""}
            />
            <AreaTexto
              etiqueta="Descripción"
              name={`texto${i}`}
              rows={2}
              defaultValue={nosotros.valores[i]?.texto ?? ""}
            />
          </div>
        ))}

        <BotonEnviar medida="md">
          <Save className="h-4 w-4" />
          Guardar sección
        </BotonEnviar>
      </form>
    </Panel>
  );
}

/* -------------------------------- WhatsApp -------------------------------- */

export function FormularioWhatsapp({
  bloque,
}: {
  bloque: { titulo: string; texto: string; boton: string };
}) {
  const [estado, accion] = useActionState(guardarBloqueWhatsapp, ESTADO_INICIAL);

  return (
    <Panel titulo="Bloque de pedido por WhatsApp">
      <form action={accion} className="space-y-5 p-6">
        <Aviso estado={estado} />
        <Campo etiqueta="Título" name="titulo" required defaultValue={bloque.titulo} />
        <AreaTexto etiqueta="Texto" name="texto" rows={2} required defaultValue={bloque.texto} />
        <Campo etiqueta="Texto del botón" name="boton" required defaultValue={bloque.boton} />
        <BotonEnviar medida="md">
          <Save className="h-4 w-4" />
          Guardar bloque
        </BotonEnviar>
      </form>
    </Panel>
  );
}

/* ------------------------------- Secciones -------------------------------- */

export function PanelSecciones({ secciones }: { secciones: SeccionInicio[] }) {
  const [orden, setOrden] = useState(secciones);
  const [, iniciar] = useTransition();

  const mover = (indice: number, direccion: -1 | 1) => {
    const destino = indice + direccion;
    if (destino < 0 || destino >= orden.length) return;

    const copia = [...orden];
    [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
    setOrden(copia);
    iniciar(async () => {
      try {
        await reordenarSecciones(copia.map((s) => s.id));
      } catch {
        setOrden(orden);
      }
    });
  };

  return (
    <Panel titulo="Orden de secciones" descripcion="Así se muestran en el inicio">
      <ul className="divide-y divide-petroleo-700/8">
        {orden.map((s, i) => (
          <li key={s.id} className="flex items-center gap-3 px-5 py-3">
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => mover(i, -1)}
                disabled={i === 0}
                aria-label={`Subir ${s.nombre}`}
                className="grid h-5 w-5 place-items-center rounded text-grafito hover:bg-crema-100 hover:text-petroleo-800 disabled:opacity-30"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => mover(i, 1)}
                disabled={i === orden.length - 1}
                aria-label={`Bajar ${s.nombre}`}
                className="grid h-5 w-5 place-items-center rounded text-grafito hover:bg-crema-100 hover:text-petroleo-800 disabled:opacity-30"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <span className="flex-1 text-sm text-petroleo-900">{s.nombre}</span>
            <Interruptor
              activo={s.visible}
              etiqueta={`Mostrar u ocultar ${s.nombre}`}
              alCambiar={(valor) => alternarSeccion(s.id, valor)}
              tamano="sm"
            />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* -------------------------------- Contacto -------------------------------- */

export function FormularioContacto({
  contacto,
}: {
  contacto: {
    nombre: string;
    descripcion: string;
    telefono: string;
    whatsapp: string;
    instagram: string;
    tiktok: string;
    correo: string;
    ciudad: string;
    horario: string;
  };
}) {
  const [estado, accion] = useActionState(guardarContacto, ESTADO_INICIAL);

  return (
    <Panel titulo="Información de contacto">
      <form action={accion} className="space-y-5 p-6">
        <Aviso estado={estado} />
        <Campo etiqueta="Nombre de la marca" name="nombre" required defaultValue={contacto.nombre} />
        <AreaTexto
          etiqueta="Descripción breve"
          name="descripcion"
          rows={2}
          defaultValue={contacto.descripcion}
        />
        <Campo etiqueta="Teléfono" name="telefono" required defaultValue={contacto.telefono} />
        <Campo
          etiqueta="WhatsApp (con código de país)"
          name="whatsapp"
          required
          defaultValue={contacto.whatsapp}
          ayuda="Ej. 51922035995"
        />
        <Campo etiqueta="Correo" name="correo" type="email" defaultValue={contacto.correo} />
        <Campo etiqueta="Ciudad" name="ciudad" defaultValue={contacto.ciudad} />
        <Campo etiqueta="Horario de atención" name="horario" defaultValue={contacto.horario} />
        <Campo etiqueta="Instagram" name="instagram" defaultValue={`@${contacto.instagram}`} />
        <Campo etiqueta="TikTok" name="tiktok" defaultValue={`@${contacto.tiktok}`} />

        <BotonEnviar medida="md">
          <Save className="h-4 w-4" />
          Guardar contacto
        </BotonEnviar>
      </form>
    </Panel>
  );
}

/* --------------------------------- Colores -------------------------------- */

export function FormularioColores({
  colores,
}: {
  colores: { hoja: string; coral: string; ambar: string; crema: string };
}) {
  const [estado, accion] = useActionState(guardarColores, ESTADO_INICIAL);

  const campos = [
    { name: "hoja", nombre: "Acento hoja", valor: colores.hoja },
    { name: "coral", nombre: "Acento coral", valor: colores.coral },
    { name: "ambar", nombre: "Acento ámbar", valor: colores.ambar },
    { name: "crema", nombre: "Fondo crema", valor: colores.crema },
  ];

  return (
    <Panel titulo="Colores secundarios">
      <form action={accion} className="space-y-4 p-6">
        <p className="text-xs text-grafito">
          El verde petróleo y el naranja son fijos por manual de marca. Aquí solo se
          ajustan los acentos de apoyo.
        </p>

        <Aviso estado={estado} />

        {campos.map((c) => (
          <div key={c.name} className="flex items-center gap-3">
            <span
              className="h-9 w-9 shrink-0 rounded-xl border border-petroleo-700/10"
              style={{ backgroundColor: c.valor }}
            />
            <span className="flex-1 text-sm text-petroleo-900">{c.nombre}</span>
            <input
              name={c.name}
              defaultValue={c.valor}
              aria-label={c.nombre}
              className="h-9 w-28 rounded-lg border border-petroleo-700/15 bg-white px-2.5 text-xs uppercase focus:border-naranja-500 focus:outline-none"
            />
          </div>
        ))}

        <BotonEnviar medida="md">
          <Save className="h-4 w-4" />
          Guardar colores
        </BotonEnviar>
      </form>
    </Panel>
  );
}
