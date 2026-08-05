import type { Metadata } from "next";
import Image from "next/image";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { CabeceraModulo, Panel } from "@/components/admin/Piezas";
import { Boton } from "@/components/ui/Boton";
import { Pastilla } from "@/components/ui/Elementos";

export const metadata: Metadata = { title: "Banners" };

const BANNERS = [
  {
    id: "b1",
    nombre: "Hero principal",
    ubicacion: "Inicio · portada",
    imagen: "/mascota/saltando.png",
    titulo: "Lo mejor para tu mejor amigo",
    boton: "Ver productos",
    activo: true,
    desde: "01/01/2026",
    hasta: "31/12/2026",
  },
  {
    id: "b2",
    nombre: "Campaña BARF",
    ubicacion: "Inicio · sección BARF",
    imagen: "/productos/barf.png",
    titulo: "Alimentación natural diseñada para ellos",
    boton: "Ver planes BARF",
    activo: true,
    desde: "01/07/2026",
    hasta: "31/08/2026",
  },
  {
    id: "b3",
    nombre: "Compra por mayor",
    ubicacion: "Inicio · bloque mayorista",
    imagen: "/empaques/snacks-bolsa-res.png",
    titulo: "Precios especiales para tiendas",
    boton: "Solicitar cotización",
    activo: true,
    desde: "01/01/2026",
    hasta: "31/12/2026",
  },
  {
    id: "b4",
    nombre: "Fiestas Patrias",
    ubicacion: "Inicio · barra superior",
    imagen: "/productos/cuerno-de-res.png",
    titulo: "20% en snacks de larga duración",
    boton: "Aprovechar",
    activo: false,
    desde: "20/07/2026",
    hasta: "31/07/2026",
  },
];

export default function AdminBanners() {
  return (
    <>
      <CabeceraModulo
        titulo="Banners"
        texto="Imágenes, títulos y botones de las piezas destacadas del sitio, con fechas de vigencia."
        acciones={
          <Boton variante="primario" medida="sm">
            <Plus className="h-3.5 w-3.5" />
            Nuevo banner
          </Boton>
        }
      />

      <div className="grid gap-5 md:grid-cols-2">
        {BANNERS.map((b) => (
          <Panel key={b.id}>
            <div className="relative h-40 bg-petroleo-800 patron-huellas-claro">
              <Image
                src={b.imagen}
                alt=""
                width={400}
                height={400}
                className="absolute right-6 top-1/2 h-32 w-auto -translate-y-1/2 object-contain drop-shadow-[0_16px_18px_rgba(2,34,38,0.4)]"
              />
              <div className="absolute inset-y-0 left-0 flex w-1/2 flex-col justify-center gap-2 p-6">
                <p className="font-display text-lg font-semibold leading-tight text-white">
                  {b.titulo}
                </p>
                <span className="w-fit rounded-full bg-naranja-500 px-3 py-1 text-[0.68rem] font-bold text-white">
                  {b.boton}
                </span>
              </div>
              <span className="absolute left-4 top-4">
                <Pastilla tono={b.activo ? "hoja" : "crema"}>
                  {b.activo ? "Activo" : "Inactivo"}
                </Pastilla>
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 p-5">
              <div className="min-w-0">
                <h3 className="font-semibold text-petroleo-900">{b.nombre}</h3>
                <p className="text-xs text-grafito">{b.ubicacion}</p>
                <p className="mt-1 text-xs text-grafito">
                  Vigencia: {b.desde} — {b.hasta}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  aria-label={`Subir imagen de ${b.nombre}`}
                  className="grid h-9 w-9 place-items-center rounded-lg text-grafito transition-colors hover:bg-crema-100 hover:text-petroleo-800"
                >
                  <Upload className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Editar ${b.nombre}`}
                  className="grid h-9 w-9 place-items-center rounded-lg text-grafito transition-colors hover:bg-petroleo-100 hover:text-petroleo-800"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Eliminar ${b.nombre}`}
                  className="grid h-9 w-9 place-items-center rounded-lg text-grafito transition-colors hover:bg-coral-100 hover:text-coral-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
