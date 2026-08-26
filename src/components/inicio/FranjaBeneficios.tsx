import { hero as heroPorDefecto } from "@/data/sitio";
import { iconosPorNombre, type NombreIcono } from "@/components/ui/Iconos";

/**
 * Los cuatro sellos de la marca, justo bajo el hero.
 *
 * Los rótulos salen del CMS (bloque "hero"), así que el equipo puede
 * reescribirlos sin tocar código. Los íconos son el set propio del proyecto:
 * mismo trazo, mismo peso visual, nada de emojis ni mezcla de estilos.
 */
export function FranjaBeneficios({
  beneficios = heroPorDefecto.beneficios,
}: {
  beneficios?: typeof heroPorDefecto.beneficios;
}) {
  if (!beneficios.length) return null;

  return (
    <section className="relative -mt-6 bg-crema-50 pb-4 md:-mt-8">
      <div className="contenedor">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[22px] bg-crema-200 shadow-suave lg:grid-cols-4">
          {beneficios.map((b) => {
            const Icono = iconosPorNombre[b.icono as NombreIcono];
            return (
              <li
                key={b.titulo}
                className="flex flex-col items-center gap-2.5 bg-white px-4 py-6 text-center md:py-7"
              >
                <Icono className="h-10 w-10 text-petroleo-700 md:h-11 md:w-11" />
                <span className="text-[0.82rem] font-bold leading-snug text-petroleo-900 md:text-sm">
                  {b.titulo}
                </span>
                <span className="text-xs leading-snug text-grafito">{b.detalle}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
