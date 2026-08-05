import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { cuponesDemo } from "@/data/cuenta";
import { nombreTipoRecompensa } from "@/data/recompensas";
import { CabeceraModulo, Panel, Tabla } from "@/components/admin/Piezas";
import { Boton } from "@/components/ui/Boton";
import { Campo, Select } from "@/components/ui/Campos";
import { Pastilla } from "@/components/ui/Elementos";
import { fechaCorta } from "@/lib/formato";

export const metadata: Metadata = { title: "Cupones" };

export default function AdminCupones() {
  return (
    <>
      <CabeceraModulo
        titulo="Cupones"
        texto="Códigos de descuento que el cliente aplica en el carrito."
        acciones={
          <Boton variante="primario" medida="sm">
            <Plus className="h-3.5 w-3.5" />
            Nuevo cupón
          </Boton>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Panel titulo="Cupones creados">
          <Tabla columnas={["Código", "Descripción", "Tipo", "Valor", "Vence", "Estado"]}>
            {cuponesDemo.map((c) => (
              <tr key={c.codigo} className="transition-colors hover:bg-crema-50">
                <td className="px-5 py-3.5 font-display text-base font-bold text-petroleo-900">
                  {c.codigo}
                </td>
                <td className="px-5 py-3.5 text-grafito">{c.descripcion}</td>
                <td className="px-5 py-3.5">
                  <Pastilla tono="contorno">{nombreTipoRecompensa[c.tipo]}</Pastilla>
                </td>
                <td className="px-5 py-3.5 tabular-nums text-grafito">
                  {c.tipo === "descuento-porcentual" ? `${c.valor}%` : `S/ ${c.valor}`}
                </td>
                <td className="px-5 py-3.5 text-grafito">{fechaCorta(c.vence)}</td>
                <td className="px-5 py-3.5">
                  <Pastilla tono={c.usado ? "crema" : "suaveHoja"}>
                    {c.usado ? "Utilizado" : "Activo"}
                  </Pastilla>
                </td>
              </tr>
            ))}
          </Tabla>
        </Panel>

        <Panel titulo="Crear cupón">
          <div className="space-y-5 p-6">
            <Campo etiqueta="Código" placeholder="VERANO25" className="uppercase" />
            <Campo etiqueta="Descripción" placeholder="25% en snacks de dureza media" />
            <Select etiqueta="Tipo">
              <option>Descuento fijo</option>
              <option>Descuento porcentual</option>
              <option>Producto gratis</option>
              <option>Envío gratis</option>
              <option>Regalo sorpresa</option>
            </Select>
            <div className="grid gap-5 sm:grid-cols-2">
              <Campo etiqueta="Valor" type="number" min={0} placeholder="25" />
              <Campo etiqueta="Usos máximos" type="number" min={1} placeholder="100" />
              <Campo etiqueta="Compra mínima (S/)" type="number" min={0} placeholder="50" />
              <Campo etiqueta="Vence el" type="date" />
            </div>
            <Boton variante="primario" medida="md" className="w-full">
              Crear cupón
            </Boton>
          </div>
        </Panel>
      </div>
    </>
  );
}
