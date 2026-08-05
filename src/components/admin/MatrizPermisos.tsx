"use client";

import { useActionState } from "react";
import { Save, ShieldCheck } from "lucide-react";
import { guardarPermisos } from "@/server/acciones/staff";
import { MODULOS } from "@/data/modulosAdmin";
import { Aviso, BotonEnviar, ESTADO_INICIAL } from "@/components/ui/Formulario";
import { Panel } from "@/components/admin/Piezas";
import { cx } from "@/lib/formato";

const ROLES = [
  { id: "administrador", nombre: "Administrador" },
  { id: "produccion", nombre: "Producción" },
  { id: "reparto", nombre: "Reparto" },
  { id: "contenido", nombre: "Contenido" },
  { id: "atencion", nombre: "Atención" },
];

export function MatrizPermisos({
  permisos,
  editable,
}: {
  permisos: Array<{ rol: string; grupo: string; permitido: boolean }>;
  editable: boolean;
}) {
  const [estado, accion] = useActionState(guardarPermisos, ESTADO_INICIAL);

  const tiene = (rol: string, grupo: string) =>
    rol === "administrador" ||
    permisos.some((p) => p.rol === rol && p.grupo === grupo && p.permitido);

  return (
    <form action={accion}>
      <Panel
        titulo="Matriz de permisos"
        descripcion="Qué grupos de módulos ve cada rol. Se aplica también en las políticas de la base de datos."
        acciones={
          editable ? (
            <BotonEnviar medida="sm">
              <Save className="h-3.5 w-3.5" />
              Guardar permisos
            </BotonEnviar>
          ) : null
        }
      >
        {estado.mensaje ? (
          <div className="px-6 pt-5">
            <Aviso estado={estado} />
          </div>
        ) : null}

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
                    key={r.id}
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
                    const fijo = r.id === "administrador";
                    return (
                      <td key={r.id} className="px-4 py-3.5 text-center">
                        <label
                          className={cx(
                            "inline-flex cursor-pointer items-center justify-center",
                            (!editable || fijo) && "cursor-not-allowed",
                          )}
                        >
                          <input
                            type="checkbox"
                            name="permiso"
                            value={`${r.id}|${g.grupo}`}
                            defaultChecked={tiene(r.id, g.grupo)}
                            disabled={!editable || fijo}
                            aria-label={`${r.nombre} puede ver ${g.grupo}`}
                            className="h-5 w-5 cursor-pointer rounded-md border-petroleo-700/25 accent-naranja-500 disabled:cursor-not-allowed disabled:opacity-60"
                          />
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="border-t border-petroleo-700/10 px-6 py-4 text-xs text-grafito">
          El administrador siempre conserva acceso completo, por eso sus casillas están
          fijas.
        </p>
      </Panel>
    </form>
  );
}

export function TarjetasRoles({
  permisos,
}: {
  permisos: Array<{ rol: string; grupo: string; permitido: boolean }>;
}) {
  const DESCRIPCION: Record<string, string> = {
    administrador: "Acceso total, incluida la configuración y los usuarios.",
    produccion: "Prepara los pedidos y mantiene el inventario al día.",
    reparto: "Ve los pedidos y actualiza su estado de entrega.",
    contenido: "Edita textos, banners, preguntas frecuentes y testimonios.",
    atencion: "Consulta pedidos, clientes y puntos; no edita el catálogo.",
  };

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {ROLES.map((r) => {
        const total =
          r.id === "administrador"
            ? MODULOS.length
            : permisos.filter((p) => p.rol === r.id && p.permitido).length;

        return (
          <article
            key={r.id}
            className="rounded-3xl border border-petroleo-700/10 bg-white p-6"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-petroleo-100 text-petroleo-700">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-petroleo-900">
              {r.nombre}
            </h2>
            <p className="mt-1.5 text-sm text-grafito">{DESCRIPCION[r.id]}</p>
            <p className="mt-4 text-xs text-grafito">
              {total} de {MODULOS.length} grupos de módulos
            </p>
          </article>
        );
      })}
    </div>
  );
}
