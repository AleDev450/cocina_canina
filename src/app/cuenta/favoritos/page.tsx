import type { Metadata } from "next";
import { ListaFavoritos } from "@/components/cuenta/ListaFavoritos";

export const metadata: Metadata = { title: "Favoritos" };

export default function PaginaFavoritos() {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-petroleo-900">
        Mis favoritos
      </h2>
      <p className="mt-1.5 text-sm text-grafito">
        Los snacks que guardaste con el corazón desde el catálogo.
      </p>
      <div className="mt-6">
        <ListaFavoritos />
      </div>
    </div>
  );
}
