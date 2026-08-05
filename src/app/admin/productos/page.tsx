import type { Metadata } from "next";
import { Download, Upload } from "lucide-react";
import { TablaProductos } from "@/components/admin/TablaProductos";
import { CabeceraModulo, Panel } from "@/components/admin/Piezas";
import { Boton } from "@/components/ui/Boton";

export const metadata: Metadata = { title: "Productos" };

const CAMPOS = [
  "Nombre, slug y descripción",
  "Galería de imágenes",
  "Beneficios e ingredientes",
  "Minerales y nutrientes",
  "Nivel de dureza",
  "Presentaciones y precios",
  "Precio por volumen",
  "Control de stock por presentación",
  "Etiquetas (más vendido, nuevo, recomendado, stock limitado)",
  "Productos relacionados",
  "Destacado en el inicio",
  "Tamaño de perro (pequeño, mediano, grande)",
  "Etapa de vida (cachorro, adulto, adulto mayor)",
  "Disponible para venta por mayor",
];

export default function AdminProductos() {
  return (
    <>
      <CabeceraModulo
        titulo="Productos"
        texto="Crea, edita, activa o desactiva cualquier producto del catálogo."
        acciones={
          <>
            <Boton variante="contorno" medida="sm">
              <Upload className="h-3.5 w-3.5" />
              Importar
            </Boton>
            <Boton variante="contorno" medida="sm">
              <Download className="h-3.5 w-3.5" />
              Exportar
            </Boton>
          </>
        }
      />

      <TablaProductos />

      <Panel
        titulo="Campos editables por producto"
        descripcion="Todo esto se administra sin tocar código"
        className="mt-6"
      >
        <ul className="grid gap-2 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {CAMPOS.map((c) => (
            <li
              key={c}
              className="rounded-xl bg-crema-50 px-3.5 py-2.5 text-sm text-petroleo-800"
            >
              {c}
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
