import type { Metadata } from "next";
import { obtenerProductos } from "@/server/catalogo";
import { ListaFavoritos } from "@/components/cuenta/ListaFavoritos";

export const metadata: Metadata = { title: "Favoritos" };

export default async function PaginaFavoritos() {
  const productos = await obtenerProductos();

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-petroleo-900">
        Mis favoritos
      </h2>
      <p className="mt-1.5 text-sm text-grafito">
        Los snacks que guardaste con el corazón desde el catálogo.
      </p>
      <div className="mt-6">
        <ListaFavoritos productos={productos} />
      </div>
    </div>
  );
}
