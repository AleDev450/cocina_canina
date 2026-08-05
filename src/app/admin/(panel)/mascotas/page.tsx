import type { Metadata } from "next";
import { Dog } from "lucide-react";
import { obtenerMascotas } from "@/server/clientes";
import { exigirGrupo } from "@/server/sesion";
import { CabeceraModulo, Panel, Tabla } from "@/components/admin/Piezas";
import { AvatarMascota, Pastilla } from "@/components/ui/Elementos";
import { edadDesde } from "@/lib/formato";

export const metadata: Metadata = { title: "Mascotas" };

export default async function AdminMascotas() {
  await exigirGrupo("Clientes");
  const mascotas = await obtenerMascotas();

  const conAlergias = mascotas.filter((m) => m.alergias.length > 0).length;
  const duenos = new Set(mascotas.map((m) => m.dueno)).size;

  return (
    <>
      <CabeceraModulo
        titulo="Mascotas"
        texto="El perfil de cada mascota alimenta las recomendaciones de producto y las campañas de cumpleaños."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { etiqueta: "Mascotas registradas", valor: mascotas.length },
          { etiqueta: "Con alergias declaradas", valor: conAlergias },
          {
            etiqueta: "Promedio por cliente",
            valor: duenos ? (mascotas.length / duenos).toFixed(1) : "0",
          },
        ].map((m) => (
          <div
            key={m.etiqueta}
            className="flex items-center gap-4 rounded-3xl border border-petroleo-700/10 bg-white p-5"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-crema-100 text-petroleo-700">
              <Dog className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl font-semibold text-petroleo-900">
                {m.valor}
              </p>
              <p className="text-xs text-grafito">{m.etiqueta}</p>
            </div>
          </div>
        ))}
      </div>

      <Panel titulo="Todas las mascotas">
        {mascotas.length === 0 ? (
          <p className="p-8 text-center text-sm text-grafito">
            Todavía no hay mascotas registradas.
          </p>
        ) : (
          <Tabla
            columnas={[
              "Mascota",
              "Dueño",
              "Especie",
              "Raza",
              "Edad",
              "Peso",
              "Alergias",
              "Preferencias",
            ]}
          >
            {mascotas.map((m) => (
              <tr key={m.id} className="transition-colors hover:bg-crema-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <AvatarMascota
                      nombre={m.nombre}
                      foto={m.foto || undefined}
                      className="h-10 w-10"
                    />
                    <span className="font-semibold text-petroleo-900">{m.nombre}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-grafito">{m.dueno}</td>
                <td className="px-5 py-3 text-grafito">{m.especie}</td>
                <td className="px-5 py-3 text-grafito">{m.raza || "—"}</td>
                <td className="px-5 py-3 text-grafito">
                  {m.nacimiento ? edadDesde(m.nacimiento) : "—"}
                </td>
                <td className="px-5 py-3 tabular-nums text-grafito">
                  {m.pesoKg ? `${m.pesoKg} kg` : "—"}
                </td>
                <td className="px-5 py-3">
                  {m.alergias.length === 0 ? (
                    <span className="text-xs text-grafito">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {m.alergias.map((a: string) => (
                        <Pastilla key={a} tono="suaveCoral">
                          {a}
                        </Pastilla>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-5 py-3 text-xs text-grafito">
                  {m.preferencias.join(", ") || "—"}
                </td>
              </tr>
            ))}
          </Tabla>
        )}
      </Panel>
    </>
  );
}
