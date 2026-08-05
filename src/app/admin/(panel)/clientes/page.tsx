import type { Metadata } from "next";
import { Mail, Phone, Users } from "lucide-react";
import { obtenerClientes } from "@/server/clientes";
import { exigirGrupo } from "@/server/sesion";
import { CabeceraModulo, Metrica, Panel, Tabla } from "@/components/admin/Piezas";
import { AvatarMascota, Pastilla } from "@/components/ui/Elementos";
import { fechaCorta, precio } from "@/lib/formato";

export const metadata: Metadata = { title: "Clientes" };

export default async function AdminClientes() {
  await exigirGrupo("Clientes");
  const clientes = await obtenerClientes();

  const totalVentas = clientes.reduce((t, c) => t + c.gastado, 0);
  const totalPedidos = clientes.reduce((t, c) => t + c.pedidos, 0);

  return (
    <>
      <CabeceraModulo
        titulo="Clientes"
        texto="Quiénes compran, cuánto y con qué frecuencia."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica etiqueta="Clientes registrados" valor={String(clientes.length)} icono={Users} />
        <Metrica etiqueta="Pedidos acumulados" valor={String(totalPedidos)} icono={Users} />
        <Metrica etiqueta="Ventas totales" valor={precio(totalVentas)} icono={Users} />
        <Metrica
          etiqueta="Ticket promedio"
          valor={precio(totalPedidos ? Math.round(totalVentas / totalPedidos) : 0)}
          icono={Users}
        />
      </div>

      <Panel titulo="Listado de clientes">
        {clientes.length === 0 ? (
          <p className="p-8 text-center text-sm text-grafito">
            Todavía no hay clientes registrados. Aparecerán aquí en cuanto alguien cree
            su cuenta en la tienda.
          </p>
        ) : (
          <Tabla
            columnas={[
              "Cliente",
              "Contacto",
              "Registro",
              "Pedidos",
              "Total gastado",
              "Puntos",
              "Mascotas",
            ]}
          >
            {clientes.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-crema-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <AvatarMascota nombre={c.nombre} className="h-10 w-10" />
                    <span className="font-semibold text-petroleo-900">{c.nombre}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-1.5 text-xs text-grafito">
                    <Mail className="h-3 w-3" />
                    {c.correo}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-grafito">
                    <Phone className="h-3 w-3" />
                    {c.celular}
                  </span>
                </td>
                <td className="px-5 py-3 text-grafito">{fechaCorta(c.desde)}</td>
                <td className="px-5 py-3 tabular-nums text-grafito">{c.pedidos}</td>
                <td className="px-5 py-3 font-semibold tabular-nums text-petroleo-900">
                  {precio(c.gastado)}
                </td>
                <td className="px-5 py-3">
                  <Pastilla tono="suaveNaranja">{c.puntos} pts</Pastilla>
                </td>
                <td className="px-5 py-3 tabular-nums text-grafito">{c.mascotas}</td>
              </tr>
            ))}
          </Tabla>
        )}
      </Panel>
    </>
  );
}
