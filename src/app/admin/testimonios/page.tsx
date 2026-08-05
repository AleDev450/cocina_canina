import type { Metadata } from "next";
import { Check, Plus, Trash2, Upload } from "lucide-react";
import { testimonios } from "@/data/contenido";
import { CabeceraModulo, Panel, Tabla } from "@/components/admin/Piezas";
import { Boton } from "@/components/ui/Boton";
import { AvatarMascota, Estrellas, Pastilla } from "@/components/ui/Elementos";

export const metadata: Metadata = { title: "Testimonios" };

export default function AdminTestimonios() {
  return (
    <>
      <CabeceraModulo
        titulo="Testimonios"
        texto="Reseñas de clientes con la foto de su mascota. Solo se publican las aprobadas."
        acciones={
          <Boton variante="primario" medida="sm">
            <Plus className="h-3.5 w-3.5" />
            Nuevo testimonio
          </Boton>
        }
      />

      <Panel titulo={`${testimonios.length} testimonios`}>
        <Tabla
          columnas={["Mascota", "Dueño", "Producto", "Calificación", "Comentario", "Estado", ""]}
        >
          {testimonios.map((t) => (
            <tr key={t.id} className="transition-colors hover:bg-crema-50">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <AvatarMascota nombre={t.mascota} foto={t.foto} className="h-10 w-10" />
                  <div>
                    <span className="block font-semibold text-petroleo-900">
                      {t.mascota}
                    </span>
                    {!t.foto ? (
                      <span className="text-[0.68rem] text-ambar-500">Falta foto</span>
                    ) : null}
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 text-grafito">{t.dueno}</td>
              <td className="px-5 py-3 text-grafito">{t.producto}</td>
              <td className="px-5 py-3">
                <Estrellas valor={t.calificacion} />
              </td>
              <td className="max-w-sm px-5 py-3">
                <p className="line-clamp-2 text-xs text-grafito">{t.comentario}</p>
              </td>
              <td className="px-5 py-3">
                <Pastilla tono="suaveHoja">
                  <Check className="h-3 w-3" />
                  Publicado
                </Pastilla>
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    aria-label={`Subir foto de ${t.mascota}`}
                    className="grid h-8 w-8 place-items-center rounded-lg text-grafito transition-colors hover:bg-crema-100 hover:text-petroleo-800"
                  >
                    <Upload className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Eliminar testimonio de ${t.mascota}`}
                    className="grid h-8 w-8 place-items-center rounded-lg text-grafito transition-colors hover:bg-coral-100 hover:text-coral-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Tabla>
      </Panel>
    </>
  );
}
