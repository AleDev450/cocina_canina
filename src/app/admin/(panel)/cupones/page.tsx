import type { Metadata } from "next";
import { obtenerCupones } from "@/server/clientes";
import { exigirGrupo } from "@/server/sesion";
import { PanelCupones } from "@/components/admin/PanelCupones";
import { CabeceraModulo } from "@/components/admin/Piezas";

export const metadata: Metadata = { title: "Cupones" };

export default async function AdminCupones() {
  await exigirGrupo("Clientes");
  const cupones = await obtenerCupones();

  return (
    <>
      <CabeceraModulo
        titulo="Cupones"
        texto="Códigos de descuento que el cliente aplica en el carrito. El descuento se recalcula en el servidor al confirmar el pedido."
      />
      <PanelCupones cupones={cupones} />
    </>
  );
}
