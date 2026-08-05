"use client";

import { useActionState, useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import {
  alternarUsuario,
  cambiarRol,
  invitarUsuario,
  quitarUsuario,
} from "@/server/acciones/staff";
import { fechaCorta } from "@/lib/formato";
import { Campo, CampoClave, Select } from "@/components/ui/Campos";
import {
  Aviso,
  BotonEnviar,
  ErrorCampo,
  ESTADO_INICIAL,
} from "@/components/ui/Formulario";
import { Panel, Tabla } from "@/components/admin/Piezas";
import { BotonAccion, Interruptor, SelectAccion } from "@/components/admin/Controles";
import { AvatarMascota } from "@/components/ui/Elementos";

export interface Miembro {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  activo: boolean;
  ultimo_acceso: string | null;
  creado_en: string;
}

const ROLES = [
  { id: "administrador", nombre: "Administrador" },
  { id: "produccion", nombre: "Producción" },
  { id: "reparto", nombre: "Reparto" },
  { id: "contenido", nombre: "Contenido" },
  { id: "atencion", nombre: "Atención al cliente" },
];

export function PanelUsuarios({
  miembros,
  yo,
  esAdministrador,
}: {
  miembros: Miembro[];
  yo: string;
  esAdministrador: boolean;
}) {
  const [estado, accion] = useActionState(invitarUsuario, ESTADO_INICIAL);
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr] xl:items-start">
      <Panel titulo={`${miembros.length} usuarios con acceso`}>
        <Tabla
          columnas={["Usuario", "Correo", "Rol", "Último acceso", "Activo", ""]}
        >
          {miembros.map((m) => (
            <tr key={m.id} className="transition-colors hover:bg-crema-50">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <AvatarMascota nombre={m.nombre} className="h-10 w-10" />
                  <span className="font-semibold text-petroleo-900">
                    {m.nombre}
                    {m.id === yo ? (
                      <span className="ml-1.5 text-xs font-normal text-grafito">
                        (tú)
                      </span>
                    ) : null}
                  </span>
                </div>
              </td>
              <td className="px-5 py-3 text-grafito">{m.correo}</td>
              <td className="px-5 py-3">
                {esAdministrador && m.id !== yo ? (
                  <SelectAccion
                    valor={m.rol}
                    opciones={ROLES}
                    etiqueta={`Rol de ${m.nombre}`}
                    alCambiar={(rol) => cambiarRol(m.id, rol)}
                  />
                ) : (
                  <span className="text-grafito">
                    {ROLES.find((r) => r.id === m.rol)?.nombre ?? m.rol}
                  </span>
                )}
              </td>
              <td className="px-5 py-3 text-grafito">
                {m.ultimo_acceso ? fechaCorta(m.ultimo_acceso.slice(0, 10)) : "Nunca"}
              </td>
              <td className="px-5 py-3">
                {esAdministrador && m.id !== yo ? (
                  <Interruptor
                    activo={m.activo}
                    etiqueta={`Activar o suspender a ${m.nombre}`}
                    alCambiar={(valor) => alternarUsuario(m.id, valor)}
                    tamano="sm"
                  />
                ) : (
                  <span className="text-xs text-grafito">
                    {m.activo ? "Activo" : "Suspendido"}
                  </span>
                )}
              </td>
              <td className="px-5 py-3 text-right">
                {esAdministrador && m.id !== yo ? (
                  <BotonAccion
                    etiqueta={`Quitar acceso a ${m.nombre}`}
                    confirmar={`¿Quitar a ${m.nombre} del panel? Su cuenta de usuario seguirá existiendo, pero perderá el acceso al CMS.`}
                    accion={() => quitarUsuario(m.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-grafito transition-colors hover:bg-coral-100 hover:text-coral-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </BotonAccion>
                ) : null}
              </td>
            </tr>
          ))}
        </Tabla>
      </Panel>

      {esAdministrador ? (
        <Panel titulo="Dar acceso a alguien del equipo">
          {abierto ? (
            <form action={accion} className="space-y-5 p-6">
              <Aviso estado={estado} />

              <div>
                <Campo
                  etiqueta="Nombre"
                  name="nombre"
                  required
                  placeholder="María Quispe"
                />
                <ErrorCampo estado={estado} campo="nombre" />
              </div>
              <div>
                <Campo
                  etiqueta="Correo"
                  name="correo"
                  type="email"
                  required
                  placeholder="maria@lacocinacanina.pe"
                />
                <ErrorCampo estado={estado} campo="correo" />
              </div>
              <div>
                <CampoClave
                  etiqueta="Contraseña inicial"
                  name="clave"
                  required
                  placeholder="Mínimo 8 caracteres"
                />
                <ErrorCampo estado={estado} campo="clave" />
              </div>
              <Select etiqueta="Rol" name="rol" defaultValue="atencion">
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </Select>

              <p className="text-xs text-grafito">
                La cuenta se crea confirmada: la persona podrá entrar de inmediato con
                ese correo y contraseña, y cambiarla después.
              </p>

              <div className="flex gap-2">
                <BotonEnviar medida="md" enviando="Creando…">
                  <UserPlus className="h-4 w-4" />
                  Crear usuario
                </BotonEnviar>
                <button
                  type="button"
                  onClick={() => setAbierto(false)}
                  className="text-sm font-semibold text-grafito hover:text-petroleo-800"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6">
              <p className="text-sm text-grafito">
                Crea la cuenta de un miembro del equipo y asígnale un rol. Cada rol ve
                solo los módulos que le corresponden.
              </p>
              <button
                type="button"
                onClick={() => setAbierto(true)}
                className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-naranja-500 px-5 text-sm font-semibold text-white shadow-suave transition-colors hover:bg-naranja-600"
              >
                <UserPlus className="h-4 w-4" />
                Invitar usuario
              </button>
            </div>
          )}
        </Panel>
      ) : (
        <Panel titulo="Permisos">
          <p className="p-6 text-sm text-grafito">
            Solo un administrador puede crear usuarios o cambiar roles.
          </p>
        </Panel>
      )}
    </div>
  );
}
