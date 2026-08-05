import type { Metadata } from "next";
import { Dog } from "lucide-react";
import { mascotasDemo, clienteDemo } from "@/data/cuenta";
import { obtenerProducto } from "@/data/productos";
import { CabeceraModulo, Panel, Tabla } from "@/components/admin/Piezas";
import { AvatarMascota, Pastilla } from "@/components/ui/Elementos";
import { edadDesde } from "@/lib/formato";

export const metadata: Metadata = { title: "Mascotas" };

const OTRAS = [
  { id: "x1", nombre: "Luna", dueno: "Diego Paredes", raza: "Border collie", peso: 16, alergias: [] },
  { id: "x2", nombre: "Simón", dueno: "Claudia Rivas", raza: "Beagle", peso: 12, alergias: ["Res"] },
  { id: "x3", nombre: "Kira", dueno: "Renzo Camacho", raza: "Labradora", peso: 28, alergias: [] },
  { id: "x4", nombre: "Nube", dueno: "Valeria Ochoa", raza: "Shih tzu", peso: 6, alergias: ["Pollo"] },
];

export default function AdminMascotas() {
  return (
    <>
      <CabeceraModulo
        titulo="Mascotas"
        texto="El perfil de cada mascota alimenta las recomendaciones de producto y las campañas de cumpleaños."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { etiqueta: "Mascotas registradas", valor: mascotasDemo.length + OTRAS.length },
          { etiqueta: "Con alergias declaradas", valor: 3 },
          { etiqueta: "Promedio por cliente", valor: "1.6" },
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
        <Tabla
          columnas={["Mascota", "Dueño", "Raza", "Edad", "Peso", "Alergias", "Favoritos"]}
        >
          {mascotasDemo.map((m) => (
            <tr key={m.id} className="transition-colors hover:bg-crema-50">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <AvatarMascota nombre={m.nombre} foto={m.foto} className="h-10 w-10" />
                  <span className="font-semibold text-petroleo-900">{m.nombre}</span>
                </div>
              </td>
              <td className="px-5 py-3 text-grafito">
                {clienteDemo.nombres} {clienteDemo.apellidos}
              </td>
              <td className="px-5 py-3 text-grafito">{m.raza}</td>
              <td className="px-5 py-3 text-grafito">{edadDesde(m.nacimiento)}</td>
              <td className="px-5 py-3 tabular-nums text-grafito">{m.pesoKg} kg</td>
              <td className="px-5 py-3">
                {m.alergias.length === 0 ? (
                  <span className="text-xs text-grafito">—</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {m.alergias.map((a) => (
                      <Pastilla key={a} tono="suaveCoral">
                        {a}
                      </Pastilla>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-5 py-3 text-xs text-grafito">
                {m.favoritos
                  .map((s) => obtenerProducto(s)?.nombre)
                  .filter(Boolean)
                  .join(", ")}
              </td>
            </tr>
          ))}

          {OTRAS.map((m) => (
            <tr key={m.id} className="transition-colors hover:bg-crema-50">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <AvatarMascota nombre={m.nombre} className="h-10 w-10" />
                  <span className="font-semibold text-petroleo-900">{m.nombre}</span>
                </div>
              </td>
              <td className="px-5 py-3 text-grafito">{m.dueno}</td>
              <td className="px-5 py-3 text-grafito">{m.raza}</td>
              <td className="px-5 py-3 text-grafito">—</td>
              <td className="px-5 py-3 tabular-nums text-grafito">{m.peso} kg</td>
              <td className="px-5 py-3">
                {m.alergias.length === 0 ? (
                  <span className="text-xs text-grafito">—</span>
                ) : (
                  m.alergias.map((a) => (
                    <Pastilla key={a} tono="suaveCoral">
                      {a}
                    </Pastilla>
                  ))
                )}
              </td>
              <td className="px-5 py-3 text-xs text-grafito">—</td>
            </tr>
          ))}
        </Tabla>
      </Panel>
    </>
  );
}
