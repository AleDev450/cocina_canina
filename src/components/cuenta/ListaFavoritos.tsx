"use client";

import { useTienda } from "@/context/Tienda";
import { obtenerProducto } from "@/data/productos";
import { TarjetaProducto } from "@/components/producto/TarjetaProducto";
import { Boton } from "@/components/ui/Boton";
import { EstadoVacio } from "@/components/ui/Elementos";

export function ListaFavoritos() {
  const { favoritos, hidratado } = useTienda();

  if (!hidratado) {
    return <div className="h-64 rounded-3xl bg-white/50" aria-busy="true" />;
  }

  const lista = favoritos
    .map((slug) => obtenerProducto(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

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
