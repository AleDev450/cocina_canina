import type { Metadata } from "next";
import { obtenerPermisos } from "@/server/clientes";
import { exigirMiembro } from "@/server/sesion";
import { MatrizPermisos, TarjetasRoles } from "@/components/admin/MatrizPermisos";
import { CabeceraModulo } from "@/components/admin/Piezas";

export const metadata: Metadata = { title: "Roles y permisos" };

export default async function AdminRoles() {
  const miembro = await exigirMiembro();
  const permisos = await obtenerPermisos();

  return (
    <>
      <CabeceraModulo
        titulo="Roles y permisos"
        texto="Define qué módulos del CMS ve cada rol. La misma tabla alimenta las políticas de Row Level Security, así que un rol sin permiso tampoco puede escribir en la base de datos."
      />

      <TarjetasRoles permisos={permisos} />

      <MatrizPermisos
        permisos={permisos}
        editable={miembro.rol === "administrador"}
      />
    </>
  );
}
