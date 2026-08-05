import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { CabeceraModulo, Panel, Tabla } from "@/components/admin/Piezas";
import { Boton } from "@/components/ui/Boton";
import { AvatarMascota, Pastilla } from "@/components/ui/Elementos";
import { fechaCorta } from "@/lib/formato";

export const metadata: Metadata = { title: "Usuarios administrativos" };

const USUARIOS = [
  {
    nombre: "Equipo Cocina Canina",
    correo: "hola@lacocinacanina.pe",
    rol: "Administrador",
    ultimo: "2026-08-04",
    activo: true,
  },
  {
    nombre: "María Quispe",
    correo: "maria@lacocinacanina.pe",
    rol: "Producción",
    ultimo: "2026-08-03",
    activo: true,
  },
  {
    nombre: "Luis Ramírez",
    correo: "luis@lacocinacanina.pe",
    rol: "Reparto",
    ultimo: "2026-08-04",
    activo: true,
  },
  {
    nombre: "Sofía Núñez",
    correo: "sofia@lacocinacanina.pe",
    rol: "Contenido",
    ultimo: "2026-07-21",
    activo: false,
  },
];

export default function AdminUsuarios() {
  return (
    <>
      <CabeceraModulo
        titulo="Usuarios administrativos"
        texto="Quién puede entrar al CMS y con qué rol."
        acciones={
          <Boton variante="primario" medida="sm">
            <Plus className="h-3.5 w-3.5" />
            Invitar usuario
          </Boton>
        }
      />

      <Panel titulo={`${USUARIOS.length} usuarios`}>
        <Tabla columnas={["Usuario", "Correo", "Rol", "Último acceso", "Estado", ""]}>
          {USUARIOS.map((u) => (
            <tr key={u.correo} className="transition-colors hover:bg-crema-50">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <AvatarMascota nombre={u.nombre} className="h-10 w-10" />
                  <span className="font-semibold text-petroleo-900">{u.nombre}</span>
                </div>
              </td>
              <td className="px-5 py-3 text-grafito">{u.correo}</td>
              <td className="px-5 py-3">
                <Pastilla tono="contorno">{u.rol}</Pastilla>
              </td>
              <td className="px-5 py-3 text-grafito">{fechaCorta(u.ultimo)}</td>
              <td className="px-5 py-3">
                <Pastilla tono={u.activo ? "suaveHoja" : "crema"}>
                  {u.activo ? "Activo" : "Suspendido"}
                </Pastilla>
              </td>
              <td className="px-5 py-3 text-right">
                <button
                  type="button"
                  className="text-xs font-semibold text-naranja-600 hover:underline"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </Tabla>
      </Panel>
    </>
  );
}
