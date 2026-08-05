import type { Metadata } from "next";
import { Check, Minus, Plus, ShieldCheck } from "lucide-react";
import { CabeceraModulo, Panel } from "@/components/admin/Piezas";
import { MODULOS } from "@/data/modulosAdmin";
import { Boton } from "@/components/ui/Boton";
import { cx } from "@/lib/formato";

export const metadata: Metadata = { title: "Roles y permisos" };

const ROLES = [
  {
    nombre: "Administrador",
    descripcion: "Acceso total, incluida la configuración y los usuarios.",
    grupos: ["Operación", "Catálogo", "Clientes", "Contenido", "Sistema"],
  },
  {
    nombre: "Producción",
    descripcion: "Prepara los pedidos y mantiene el inventario al día.",
    grupos: ["Operación", "Catálogo"],
  },
  {
    nombre: "Reparto",
    descripcion: "Solo ve los pedidos y actualiza su estado de entrega.",
    grupos: ["Operación"],
  },
  {
    nombre: "Contenido",
    descripcion: "Edita textos, banners, preguntas frecuentes y testimonios.",
    grupos: ["Contenido"],
  },
  {
    nombre: "Atención al cliente",
    descripcion: "Consulta pedidos, clientes y puntos; no edita el catálogo.",
    grupos: ["Operación", "Clientes"],
  },
];

export default function AdminRoles() {
  return (
    <>
      <CabeceraModulo
        titulo="Roles y permisos"
        texto="Define qué módulos del CMS puede ver cada rol. Se aplica también en las políticas de Row Level Security de la base de datos."
        acciones={
          <Boton variante="primario" medida="sm">
            <Plus className="h-3.5 w-3.5" />
            Nuevo rol
          </Boton>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ROLES.map((r) => (
          <article
            key={r.nombre}
            className="rounded-3xl border border-petroleo-700/10 bg-white p-6"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-petroleo-100 text-petroleo-700">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-petroleo-900">
              {r.nombre}
            </h2>
            <p className="mt-1.5 text-sm text-grafito">{r.descripcion}</p>
            <p className="mt-4 text-xs text-grafito">
              {r.grupos.length} de {MODULOS.length} grupos de módulos
            </p>
          </article>
        ))}
      </div>

      <Panel titulo="Matriz de permisos" descripcion="Grupos de módulos por rol">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="border-b border-petroleo-700/10 bg-crema-50">
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-[0.68rem] font-bold uppercase tracking-[0.08em] text-grafito"
                >
                  Grupo de módulos
                </th>
                {ROLES.map((r) => (
                  <th
                    key={r.nombre}
                    scope="col"
                    className="px-4 py-3 text-center text-[0.68rem] font-bold uppercase tracking-[0.08em] text-grafito"
                  >
                    {r.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-petroleo-700/8">
              {MODULOS.map((g) => (
                <tr key={g.grupo} className="transition-colors hover:bg-crema-50">
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-petroleo-900">{g.grupo}</span>
                    <span className="block text-xs text-grafito">
                      {g.enlaces.map((e) => e.nombre).join(" · ")}
                    </span>
                  </td>
                  {ROLES.map((r) => {
                    const permitido = r.grupos.includes(g.grupo);
                    return (
                      <td key={r.nombre} className="px-4 py-3.5 text-center">
                        <span
                          className={cx(
                            "inline-grid h-7 w-7 place-items-center rounded-full",
                            permitido
                              ? "bg-hoja-100 text-hoja-600"
                              : "bg-crema-100 text-grafito",
                          )}
                        >
                          {permitido ? (
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          ) : (
                            <Minus className="h-3.5 w-3.5" />
                          )}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
