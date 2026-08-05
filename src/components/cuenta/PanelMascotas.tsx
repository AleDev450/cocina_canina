"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { AlertCircle, Loader2, Plus, Trash2, Upload, Weight, X } from "lucide-react";
import type { Mascota } from "@/lib/tipos";
import {
  eliminarMascota,
  guardarMascota,
  subirFotoMascota,
} from "@/server/acciones/clientes";
import { AreaTexto, Campo, Select } from "@/components/ui/Campos";
import {
  Aviso,
  BotonEnviar,
  ErrorCampo,
  ESTADO_INICIAL,
} from "@/components/ui/Formulario";
import { Boton } from "@/components/ui/Boton";
import { AvatarMascota, Pastilla } from "@/components/ui/Elementos";
import { edadDesde, fechaCorta } from "@/lib/formato";
import { BotonAccion } from "@/components/admin/Controles";

function SubirFoto({ valorInicial }: { valorInicial: string }) {
  const [url, setUrl] = useState(valorInicial);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, iniciar] = useTransition();
  const entrada = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <span className="block text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800">
        Foto
      </span>
      <input type="hidden" name="foto" value={url} />

      <div className="flex items-center gap-4">
        <AvatarMascota nombre="?" foto={url || undefined} className="h-16 w-16" />
        <div>
          <button
            type="button"
            onClick={() => entrada.current?.click()}
            disabled={pendiente}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-petroleo-700/15 px-4 text-xs font-semibold text-petroleo-800 transition-colors hover:border-petroleo-700/40 disabled:opacity-60"
          >
            {pendiente ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Subiendo…
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5" />
                {url ? "Cambiar foto" : "Subir foto"}
              </>
            )}
          </button>
          {error ? (
            <p className="mt-1 text-xs text-coral-500" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <input
        ref={entrada}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(e) => {
          const archivo = e.target.files?.[0];
          if (!archivo) return;
          setError(null);
          const datos = new FormData();
          datos.set("archivo", archivo);
          iniciar(async () => {
            const r = await subirFotoMascota({}, datos);
            if (r.ok && r.url) setUrl(r.url);
            else setError(r.mensaje ?? "No se pudo subir la foto.");
          });
        }}
      />
    </div>
  );
}

export function PanelMascotas({ mascotas }: { mascotas: Mascota[] }) {
  const [estado, accion] = useActionState(guardarMascota, ESTADO_INICIAL);
  const [editando, setEditando] = useState<Mascota | null>(null);
  const [creando, setCreando] = useState(false);

  const abierto = creando || editando !== null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-petroleo-900">
            Mis mascotas
          </h2>
          <p className="mt-1.5 text-sm text-grafito">
            Guarda el perfil de cada una para recibir recomendaciones más precisas.
          </p>
        </div>
        {!abierto ? (
          <Boton
            variante="primario"
            medida="md"
            onClick={() => {
              setEditando(null);
              setCreando(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Agregar mascota
          </Boton>
        ) : null}
      </div>

      {abierto ? (
        <form
          action={accion}
          key={editando?.id ?? "nueva"}
          className="mt-6 space-y-5 rounded-3xl border border-petroleo-700/10 bg-white p-6"
        >
          {editando ? <input type="hidden" name="id" value={editando.id} /> : null}

          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-petroleo-900">
              {editando ? `Editar a ${editando.nombre}` : "Nueva mascota"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditando(null);
                setCreando(false);
              }}
              aria-label="Cancelar"
              className="grid h-8 w-8 place-items-center rounded-full text-grafito hover:bg-crema-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Aviso estado={estado} />

          <SubirFoto valorInicial={editando?.foto ?? ""} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Campo
                etiqueta="Nombre"
                name="nombre"
                required
                defaultValue={editando?.nombre}
                placeholder="Rocco"
              />
              <ErrorCampo estado={estado} campo="nombre" />
            </div>
            <Select
              etiqueta="Especie"
              name="especie"
              defaultValue={editando?.especie ?? "Perro"}
            >
              <option>Perro</option>
              <option>Gato</option>
              <option>Otro</option>
            </Select>
            <Campo etiqueta="Raza" name="raza" opcional defaultValue={editando?.raza} />
            <div>
              <Campo
                etiqueta="Peso"
                name="peso"
                opcional
                type="number"
                min={0}
                step="0.5"
                defaultValue={editando?.pesoKg || ""}
                ayuda="En kilogramos"
              />
              <ErrorCampo estado={estado} campo="peso" />
            </div>
            <Campo
              etiqueta="Fecha de nacimiento"
              name="nacimiento"
              opcional
              type="date"
              contenedor="sm:col-span-2"
              defaultValue={editando?.nacimiento || ""}
            />
            <AreaTexto
              etiqueta="Alergias"
              name="alergias"
              rows={2}
              contenedor="sm:col-span-2"
              defaultValue={editando?.alergias.join(", ")}
              ayuda="Separadas por comas"
            />
            <AreaTexto
              etiqueta="Preferencias"
              name="preferencias"
              rows={2}
              contenedor="sm:col-span-2"
              defaultValue={editando?.preferencias.join(", ")}
              ayuda="Separadas por comas"
            />
          </div>

          <BotonEnviar medida="md">
            {editando ? "Guardar cambios" : "Registrar mascota"}
          </BotonEnviar>
        </form>
      ) : null}

      {mascotas.length === 0 && !abierto ? (
        <p className="mt-6 rounded-3xl border border-petroleo-700/10 bg-white p-10 text-center text-sm text-grafito">
          Todavía no registraste ninguna mascota. Agrega la primera para que podamos
          recomendarte mejor.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {mascotas.map((m) => (
            <article
              key={m.id}
              className="overflow-hidden rounded-3xl border border-petroleo-700/10 bg-white"
            >
              <div className="flex items-center gap-4 bg-crema-50 p-6">
                <AvatarMascota
                  nombre={m.nombre}
                  foto={m.foto || undefined}
                  className="h-20 w-20"
                />
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-semibold text-petroleo-900">
                    {m.nombre}
                  </h3>
                  <p className="text-sm text-grafito">
                    {[m.especie, m.raza].filter(Boolean).join(" · ")}
                  </p>
                  {m.nacimiento ? (
                    <p className="text-xs text-grafito">
                      Nació el {fechaCorta(m.nacimiento)}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-crema-50 p-4">
                    <span className="text-[0.68rem] font-bold uppercase tracking-wide text-grafito">
                      Edad
                    </span>
                    <p className="font-display text-lg font-semibold text-petroleo-900">
                      {m.nacimiento ? edadDesde(m.nacimiento) : "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-crema-50 p-4">
                    <span className="flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-wide text-grafito">
                      <Weight className="h-3 w-3" />
                      Peso
                    </span>
                    <p className="font-display text-lg font-semibold text-petroleo-900">
                      {m.pesoKg ? `${m.pesoKg} kg` : "—"}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Alergias
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.alergias.length === 0 ? (
                      <Pastilla tono="suaveHoja">Ninguna registrada</Pastilla>
                    ) : (
                      m.alergias.map((a) => (
                        <Pastilla key={a} tono="suaveCoral">
                          {a}
                        </Pastilla>
                      ))
                    )}
                  </div>
                </div>

                {m.preferencias.length > 0 ? (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800">
                      Preferencias
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.preferencias.map((p) => (
                        <Pastilla key={p} tono="contorno">
                          {p}
                        </Pastilla>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <Boton
                    variante="contorno"
                    medida="sm"
                    className="flex-1"
                    onClick={() => {
                      setCreando(false);
                      setEditando(m);
                    }}
                  >
                    Editar perfil
                  </Boton>
                  <BotonAccion
                    etiqueta={`Eliminar a ${m.nombre}`}
                    confirmar={`¿Eliminar el perfil de ${m.nombre}?`}
                    accion={() => eliminarMascota(m.id)}
                    className="grid h-9 w-9 place-items-center rounded-full text-grafito transition-colors hover:bg-coral-100 hover:text-coral-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </BotonAccion>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
