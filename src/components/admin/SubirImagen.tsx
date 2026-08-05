"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { ImageOff, Loader2, Upload, X } from "lucide-react";
import { subirImagen } from "@/server/acciones/catalogo";
import { cx } from "@/lib/formato";

/**
 * Sube una imagen al bucket `catalogo` y deja su URL en un input oculto para
 * que viaje con el formulario que la contiene.
 */
export function SubirImagen({
  nombre,
  valorInicial = "",
  etiqueta = "Imagen",
  carpeta = "productos",
  ayuda,
}: {
  nombre: string;
  valorInicial?: string;
  etiqueta?: string;
  carpeta?: string;
  ayuda?: string;
}) {
  const [url, setUrl] = useState(valorInicial);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, iniciar] = useTransition();
  const entrada = useRef<HTMLInputElement>(null);

  const alElegir = (archivo: File | undefined) => {
    if (!archivo) return;
    setError(null);

    const datos = new FormData();
    datos.set("archivo", archivo);
    datos.set("carpeta", carpeta);

    iniciar(async () => {
      const resultado = await subirImagen({}, datos);
      if (resultado.ok && resultado.url) setUrl(resultado.url);
      else setError(resultado.mensaje ?? "No se pudo subir la imagen.");
    });
  };

  return (
    <div className="space-y-2">
      <span className="block text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800">
        {etiqueta}
      </span>

      <input type="hidden" name={nombre} value={url} />

      <div className="flex items-center gap-4">
        <span className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border border-petroleo-700/12 bg-crema-50">
          {url ? (
            <Image
              src={url}
              alt=""
              width={200}
              height={200}
              className="h-full w-full object-contain p-2"
              unoptimized={url.startsWith("http")}
            />
          ) : (
            <ImageOff className="h-6 w-6 text-grafito/50" />
          )}
        </span>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => entrada.current?.click()}
              disabled={pendiente}
              className={cx(
                "inline-flex h-9 items-center gap-2 rounded-full border border-petroleo-700/15 px-4 text-xs font-semibold text-petroleo-800 transition-colors hover:border-petroleo-700/40 disabled:opacity-60",
              )}
            >
              {pendiente ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Subiendo…
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" />
                  {url ? "Cambiar imagen" : "Subir imagen"}
                </>
              )}
            </button>

            {url ? (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-grafito transition-colors hover:text-coral-500"
              >
                <X className="h-3.5 w-3.5" />
                Quitar
              </button>
            ) : null}
          </div>

          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/productos/mi-snack.png o una URL"
            aria-label={`Ruta de ${etiqueta.toLowerCase()}`}
            className="h-9 w-full rounded-lg border border-petroleo-700/12 bg-crema-50 px-3 text-xs text-tinta placeholder:text-grafito/50 focus:border-naranja-500 focus:outline-none"
          />

          {error ? (
            <p className="text-xs font-medium text-coral-500" role="alert">
              {error}
            </p>
          ) : ayuda ? (
            <p className="text-xs text-grafito">{ayuda}</p>
          ) : null}
        </div>
      </div>

      <input
        ref={entrada}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="sr-only"
        onChange={(e) => alElegir(e.target.files?.[0])}
      />
    </div>
  );
}
