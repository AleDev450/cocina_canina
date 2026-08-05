import type { Metadata } from "next";
import { FormularioRegistro } from "@/components/auth/Formularios";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description:
    "Regístrate gratis en el Club Cocina Canina, acumula puntos y guarda el perfil de tus mascotas.",
};

export default function PaginaRegistro() {
  return <FormularioRegistro />;
}
