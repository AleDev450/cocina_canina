import type { Metadata } from "next";
import { obtenerStaff } from "@/server/clientes";
import { exigirMiembro } from "@/server/sesion";
import { PanelUsuarios } from "@/components/admin/PanelUsuarios";
import { CabeceraModulo } from "@/components/admin/Piezas";

export const metadata: Metadata = { title: "Usuarios administrativos" };

export default async function AdminUsuarios() {
  const miembro = await exigirMiembro();
  const miembros = await obtenerStaff();

  return (
    <>
      <CabeceraModulo
        titulo="Usuarios administrativos"
        texto="Quién puede entrar al CMS y con qué rol."
      />
      <PanelUsuarios
        miembros={miembros}
        yo={miembro.id}
        esAdministrador={miembro.rol === "administrador"}
      />
    </>
  );
}
