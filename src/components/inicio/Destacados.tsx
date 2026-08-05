import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { productosDestacados } from "@/data/productos";
import { TarjetaProducto } from "@/components/producto/TarjetaProducto";
import { CabeceraSeccion } from "@/components/ui/Elementos";

export function Destacados() {
  const lista = productosDestacados().slice(0, 8);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="contenedor">
        <CabeceraSeccion
          antetitulo="Los favoritos de la casa"
          titulo="Lo que más piden las colitas felices"
          texto="Una selección de los snacks que más se repiten en los pedidos, con su precio, presentaciones y nivel de dureza a la vista."
          accion={
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-naranja-600 transition-colors hover:text-naranja-700"
            >
              Ver catálogo completo
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {lista.map((p) => (
            <TarjetaProducto key={p.slug} producto={p} compacta />
          ))}
        </div>
      </div>
    </section>
  );
}
