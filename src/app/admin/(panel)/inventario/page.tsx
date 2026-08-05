import type { Metadata } from "next";
import { AlertTriangle, PackageCheck } from "lucide-react";
import { obtenerInventario } from "@/server/catalogo";
import { exigirGrupo } from "@/server/sesion";
import { TablaInventario } from "@/components/admin/TablaInventario";
import { CabeceraModulo, Metrica } from "@/components/admin/Piezas";
import { precio } from "@/lib/formato";

export const metadata: Metadata = { title: "Inventario" };

export default async function AdminInventario() {
  await exigirGrupo("Catálogo");
  const filas = await obtenerInventario();

  const agotados = filas.filter((f) => f.stock === 0).length;
  const bajos = filas.filter((f) => f.stock > 0 && f.stock <= 8).length;
  const valorizado = filas.reduce((t, f) => t + f.precio * f.stock, 0);
  const productos = new Set(filas.map((f) => f.productoSlug)).size;

  return (
    <>
      <CabeceraModulo
        titulo="Inventario"
        texto="Stock disponible por producto y presentación. Al confirmar un pedido, el stock se descuenta solo."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica etiqueta="Productos" valor={String(productos)} icono={PackageCheck} />
        <Metrica etiqueta="Con stock bajo" valor={String(bajos)} icono={AlertTriangle} />
        <Metrica etiqueta="Agotados" valor={String(agotados)} icono={AlertTriangle} />
        <Metrica
          etiqueta="Inventario valorizado"
          valor={precio(valorizado)}
          icono={PackageCheck}
        />
      </div>

      <TablaInventario filas={filas} />
    </>
  );
}
