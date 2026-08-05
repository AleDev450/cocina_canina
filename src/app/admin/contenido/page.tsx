import type { Metadata } from "next";
import { GripVertical, Save } from "lucide-react";
import { hero, quienesSomos, sitio, pedidoWhatsapp } from "@/data/sitio";
import { CabeceraModulo, Panel } from "@/components/admin/Piezas";
import { Boton } from "@/components/ui/Boton";
import { AreaTexto, Campo, Casilla } from "@/components/ui/Campos";
import { Pastilla } from "@/components/ui/Elementos";

export const metadata: Metadata = { title: "Contenido de la web" };

const SECCIONES = [
  "Hero principal",
  "Quiénes somos",
  "Categorías de productos",
  "Productos destacados",
  "Alimentación BARF",
  "Club Cocina Canina",
  "Compra por mayor",
  "Pedido por WhatsApp",
  "Testimonios",
  "Preguntas frecuentes",
];

export default function AdminContenido() {
  return (
    <>
      <CabeceraModulo
        titulo="Contenido de la web"
        texto="Textos, botones y orden de las secciones del sitio público. Nada de esto requiere tocar código."
        acciones={
          <Boton variante="primario" medida="sm">
            <Save className="h-3.5 w-3.5" />
            Publicar cambios
          </Boton>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Panel titulo="Hero principal">
            <div className="space-y-5 p-6">
              <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
                <Campo etiqueta="Título" defaultValue={hero.titulo} />
                <Campo
                  etiqueta="Palabra resaltada"
                  defaultValue={hero.tituloResaltado}
                  ayuda="Se muestra en naranja"
                />
              </div>
              <AreaTexto etiqueta="Subtítulo" defaultValue={hero.subtitulo} rows={3} />
              <Campo etiqueta="Texto del sello circular" defaultValue={hero.sello} />

              <div>
                <span className="mb-3 block text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800">
                  Beneficios destacados
                </span>
                <div className="grid gap-3 sm:grid-cols-2">
                  {hero.beneficios.map((b, i) => (
                    <div key={b.titulo} className="rounded-2xl bg-crema-50 p-4">
                      <Campo etiqueta={`Beneficio ${i + 1}`} defaultValue={b.titulo} />
                      <Campo
                        etiqueta="Detalle"
                        defaultValue={b.detalle}
                        contenedor="mt-3"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <Panel titulo="Quiénes somos">
            <div className="space-y-5 p-6">
              <Campo etiqueta="Título" defaultValue={quienesSomos.titulo} />
              <AreaTexto etiqueta="Texto introductorio" defaultValue={quienesSomos.texto} />
              {quienesSomos.valores.map((v, i) => (
                <div key={v.titulo} className="rounded-2xl bg-crema-50 p-4">
                  <Campo etiqueta={`Valor ${i + 1}`} defaultValue={v.titulo} />
                  <AreaTexto
                    etiqueta="Descripción"
                    defaultValue={v.texto}
                    rows={2}
                    contenedor="mt-3"
                  />
                </div>
              ))}
            </div>
          </Panel>

          <Panel titulo="Bloque de pedido por WhatsApp">
            <div className="space-y-5 p-6">
              <Campo etiqueta="Título" defaultValue={pedidoWhatsapp.titulo} />
              <AreaTexto etiqueta="Texto" defaultValue={pedidoWhatsapp.texto} rows={2} />
              <Campo etiqueta="Texto del botón" defaultValue={pedidoWhatsapp.boton} />
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel
            titulo="Orden de secciones"
            descripcion="Arrastra para reordenar el inicio"
          >
            <ul className="divide-y divide-petroleo-700/8">
              {SECCIONES.map((s) => (
                <li key={s} className="flex items-center gap-3 px-5 py-3">
                  <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-grafito" />
                  <span className="flex-1 text-sm text-petroleo-900">{s}</span>
                  <Pastilla tono="suaveHoja">Visible</Pastilla>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel titulo="Información de contacto">
            <div className="space-y-5 p-6">
              <Campo etiqueta="Teléfono" defaultValue={sitio.telefono} />
              <Campo etiqueta="WhatsApp (con código de país)" defaultValue={sitio.whatsapp} />
              <Campo etiqueta="Correo" type="email" defaultValue={sitio.correo} />
              <Campo etiqueta="Ciudad" defaultValue={sitio.ciudad} />
              <Campo etiqueta="Horario de atención" defaultValue={sitio.horario} />
              <Campo etiqueta="Instagram" defaultValue={`@${sitio.instagram}`} />
              <Campo etiqueta="TikTok" defaultValue={`@${sitio.tiktok}`} />
            </div>
          </Panel>

          <Panel titulo="Colores secundarios">
            <div className="space-y-4 p-6">
              <p className="text-xs text-grafito">
                Los colores principales de marca (verde petróleo y naranja) están fijados
                por el manual. Aquí se ajustan solo los acentos de apoyo.
              </p>
              {[
                { nombre: "Acento hoja", valor: "#4F9A4A", clase: "bg-hoja-500" },
                { nombre: "Acento coral", valor: "#E8735A", clase: "bg-coral-500" },
                { nombre: "Acento ámbar", valor: "#D99A2B", clase: "bg-ambar-500" },
                { nombre: "Fondo crema", valor: "#FDFAF5", clase: "bg-crema-50" },
              ].map((c) => (
                <div key={c.nombre} className="flex items-center gap-3">
                  <span
                    className={`h-9 w-9 shrink-0 rounded-xl border border-petroleo-700/10 ${c.clase}`}
                  />
                  <span className="flex-1 text-sm text-petroleo-900">{c.nombre}</span>
                  <code className="rounded-lg bg-crema-100 px-2.5 py-1 text-xs text-grafito">
                    {c.valor}
                  </code>
                </div>
              ))}
            </div>
          </Panel>

          <Panel titulo="Políticas">
            <div className="space-y-3 p-6">
              {[
                "Términos y condiciones",
                "Política de privacidad",
                "Política de delivery",
                "Libro de reclamaciones",
              ].map((p) => (
                <Casilla key={p} defaultChecked etiqueta={`${p} — publicada`} />
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
