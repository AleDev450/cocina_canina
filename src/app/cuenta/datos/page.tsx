import type { Metadata } from "next";
import { exigirCliente } from "@/server/sesion";
import { FormularioDatos } from "@/components/cuenta/FormularioDatos";

export const metadata: Metadata = { title: "Mis datos" };

export default async function PaginaDatos() {
  const cliente = await exigirCliente();
  return <FormularioDatos cliente={cliente} />;
}
