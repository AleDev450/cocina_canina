import type { Metadata } from "next";
import Link from "next/link";
import {
  obtenerBloqueWhatsapp,
  obtenerConfiguracion,
  obtenerHero,
  obtenerNosotros,
  obtenerSecciones,
} from "@/server/contenido";
import { exigirGrupo } from "@/server/sesion";
import {
  FormularioColores,
  FormularioContacto,
  FormularioHero,
  FormularioNosotros,
  FormularioWhatsapp,
  PanelSecciones,
} from "@/components/admin/PanelContenido";
import { CabeceraModulo, Panel } from "@/components/admin/Piezas";

export const metadata: Metadata = { title: "Contenido de la web" };

const POLITICAS = [
  { nombre: "Términos y condiciones", href: "/legal/terminos" },
  { nombre: "Política de privacidad", href: "/legal/privacidad" },
  { nombre: "Política de delivery", href: "/legal/delivery" },
  { nombre: "Libro de reclamaciones", href: "/legal/reclamaciones" },
];

export default async function AdminContenido() {
  await exigirGrupo("Contenido");

  const [hero, nosotros, whatsapp, secciones, config] = await Promise.all([
    obtenerHero(),
    obtenerNosotros(),
    obtenerBloqueWhatsapp(),
    obtenerSecciones(),
    obtenerConfiguracion(),
  ]);

  return (
    <>
      <CabeceraModulo
        titulo="Contenido de la web"
        texto="Textos, botones y orden de las secciones del sitio público. Cada bloque se guarda por separado."
      />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr] xl:items-start">
        <div className="space-y-6">
          <FormularioHero hero={hero} />
          <FormularioNosotros nosotros={nosotros} />
          <FormularioWhatsapp bloque={whatsapp} />
        </div>

        <div className="space-y-6">
          <PanelSecciones secciones={secciones} />
          <FormularioContacto contacto={config.contacto} />
          <FormularioColores colores={config.colores} />

          <Panel titulo="Políticas publicadas">
            <ul className="divide-y divide-petroleo-700/8">
              {POLITICAS.map((p) => (
                <li key={p.href} className="flex items-center justify-between gap-3 px-5 py-3">
                  <span className="text-sm text-petroleo-900">{p.nombre}</span>
                  <Link
                    href={p.href}
                    target="_blank"
                    className="text-xs font-semibold text-naranja-600 hover:underline"
                  >
                    Ver
                  </Link>
                </li>
              ))}
            </ul>
            <p className="border-t border-petroleo-700/10 px-5 py-4 text-xs text-grafito">
              Los textos legales viven en <code>src/data/legales.ts</code>. Se editan
              desde el código porque requieren revisión legal antes de publicarse.
            </p>
          </Panel>
        </div>
      </div>
    </>
  );
}
