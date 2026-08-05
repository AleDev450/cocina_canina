import type { Metadata } from "next";
import { FormularioIngreso } from "@/components/auth/Formularios";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description:
    "Entra a tu cuenta del Club Cocina Canina para ver tus puntos, pedidos y mascotas registradas.",
};

export default function PaginaIngresar() {
  return <FormularioIngreso />;
}
