import type { Metadata } from "next";
import { Download, Mail, Phone } from "lucide-react";
import { clienteDemo, pedidosDemo, mascotasDemo } from "@/data/cuenta";
import { CabeceraModulo, Metrica, Panel, Tabla } from "@/components/admin/Piezas";
import { Boton } from "@/components/ui/Boton";
import { AvatarMascota, Pastilla } from "@/components/ui/Elementos";
import { fechaCorta, precio } from "@/lib/formato";
import { Users } from "lucide-react";

export const metadata: Metadata = { title: "Clientes" };

/** Clientes de demostración (el primero es la cuenta con datos completos). */
const CLIENTES = [
  {
    nombre: `${clienteDemo.nombres} ${clienteDemo.apellidos}`,
    correo: clienteDemo.correo,
    celular: clienteDemo.celular,
    desde: clienteDemo.desde,
    pedidos: pedidosDemo.length,
    gastado: pedidosDemo.reduce((t, p) => t + p.total, 0),
    puntos: clienteDemo.puntos,
    mascotas: mascotasDemo.length,
  },
  {
    nombre: "Diego Paredes",
    correo: "diego@ejemplo.pe",
    celular: "955 123 456",
    desde: "2026-02-14",
    pedidos: 7,
    gastado: 612,
    puntos: 61,
    mascotas: 1,
  },
  {
    nombre: "Claudia Rivas",
    correo: "claudia@ejemplo.pe",
    celular: "944 789 012",
    desde: "2026-03-02",
    pedidos: 11,
    gastado: 1480,
    puntos: 148,
    mascotas: 2,
  },
  {
    nombre: "Renzo Camacho",
    correo: "renzo@ejemplo.pe",
    celular: "912 345 678",
    desde: "2026-04-19",
    pedidos: 3,
    gastado: 214,
    puntos: 21,
    mascotas: 1,
  },
  {
    nombre: "Valeria Ochoa",
    correo: "valeria@ejemplo.pe",
    celular: "987 111 222",
    desde: "2026-05-27",
    pedidos: 5,
    gastado: 398,
    puntos: 39,
    mascotas: 3,
  },
];

export default function AdminClientes() {
  const totalVentas = CLIENTES.reduce((t, c) => t + c.gastado, 0);
  const totalPedidos = CLIENTES.reduce((t, c) => t + c.pedidos, 0);

  return (
    <>
      <CabeceraModulo
        titulo="Clientes"
        texto="Quiénes compran, cuánto y con qué frecuencia."
        acciones={
          <Boton variante="contorno" medida="sm">
            <Download className="h-3.5 w-3.5" />
            Exportar
          </Boton>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica etiqueta="Clientes registrados" valor={String(CLIENTES.length)} icono={Users} />
        <Metrica etiqueta="Pedidos acumulados" valor={String(totalPedidos)} icono={Users} />
        <Metrica etiqueta="Ventas totales" valor={precio(totalVentas)} icono={Users} />
        <Metrica
          etiqueta="Ticket promedio"
          valor={precio(Math.round(totalVentas / totalPedidos))}
          icono={Users}
        />
      </div>

      <Panel titulo="Listado de clientes">
        <Tabla
          columnas={[
            "Cliente",
            "Contacto",
            "Registro",
            "Pedidos",
            "Total gastado",
            "Puntos",
            "Mascotas",
            "",
          ]}
        >
          {CLIENTES.map((c) => (
            <tr key={c.correo} className="transition-colors hover:bg-crema-50">
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
              <td className="px-5 py-3 text-right">
                <button
                  type="button"
                  className="text-xs font-semibold text-naranja-600 hover:underline"
                >
                  Ver ficha
                </button>
              </td>
            </tr>
          ))}
        </Tabla>
      </Panel>
    </>
  );
}
