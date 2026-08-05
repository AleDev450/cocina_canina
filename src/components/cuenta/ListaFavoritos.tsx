"use client";

import { useTienda } from "@/context/Tienda";
import type { Producto } from "@/lib/tipos";
import { TarjetaProducto } from "@/components/producto/TarjetaProducto";
import { Boton } from "@/components/ui/Boton";
import { EstadoVacio } from "@/components/ui/Elementos";

export function ListaFavoritos({ productos }: { productos: Producto[] }) {
  const { favoritos, hidratado } = useTienda();

  if (!hidratado) {
    return <div className="h-64 rounded-3xl bg-white/50" aria-busy="true" />;
  }

  const lista = productos.filter((p) => favoritos.includes(p.slug));

  if (lista.length === 0) {
    return (
      <div className="rounded-3xl border border-petroleo-700/10 bg-white">
        <EstadoVacio
          pose="mirada"
          titulo="Aún no guardaste favoritos"
          texto="Toca el corazón de cualquier producto del catálogo y lo verás aparecer acá."
          accion={
            <Boton href="/productos" variante="primario" medida="md">
              Explorar el catálogo
            </Boton>
          }
        />
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {lista.map((p) => (
        <TarjetaProducto key={p.slug} producto={p} compacta />
      ))}
    </div>
  );
}
