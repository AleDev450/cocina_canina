"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import type { Categoria, Producto } from "@/lib/tipos";
import { guardarProducto } from "@/server/acciones/catalogo";
import { nombreEdad, nombreEtiqueta, nombreTamano } from "@/data/categorias";
import { AreaTexto, Campo, Casilla, Select } from "@/components/ui/Campos";
import {
  Aviso,
  BotonEnviar,
  ErrorCampo,
  ESTADO_INICIAL,
} from "@/components/ui/Formulario";
import { Panel } from "@/components/admin/Piezas";
import { SubirImagen } from "@/components/admin/SubirImagen";

type Editable = Producto & { id: string; activo: boolean };

const TAMANOS = ["pequeno", "mediano", "grande"] as const;
const EDADES = ["cachorro", "adulto", "senior"] as const;
const ETIQUETAS = ["mas-vendido", "nuevo", "recomendado", "stock-limitado"] as const;

export function EditorProducto({
  producto,
  categorias,
}: {
  producto?: Editable;
  categorias: Categoria[];
}) {
  const [estado, accion] = useActionState(guardarProducto, ESTADO_INICIAL);
  const nuevo = !producto;

  return (
    <form action={accion} className="space-y-6">
      {producto ? <input type="hidden" name="id" value={producto.id} /> : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/productos"
          className="inline-flex items-center gap-2 text-sm font-semibold text-grafito transition-colors hover:text-petroleo-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a productos
        </Link>

        <BotonEnviar medida="md">
          <Save className="h-4 w-4" />
          {nuevo ? "Crear producto" : "Guardar cambios"}
        </BotonEnviar>
      </div>

      <Aviso estado={estado} />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr] xl:items-start">
        <div className="space-y-6">
          <Panel titulo="Información principal">
            <div className="space-y-5 p-6">
              <div>
                <Campo
                  etiqueta="Nombre"
                  name="nombre"
                  required
                  defaultValue={producto?.nombre}
                  placeholder="Tráquea de res"
                />
                <ErrorCampo estado={estado} campo="nombre" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Campo
                  etiqueta="Slug"
                  name="slug"
                  opcional
                  defaultValue={producto?.slug}
                  placeholder="traquea-de-res"
                  ayuda="Se genera del nombre si lo dejas vacío"
                />
                <div>
                  <Select
                    etiqueta="Categoría"
                    name="categoria"
                    required
                    defaultValue={producto?.categoria}
                  >
                    {categorias.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.nombre}
                      </option>
                    ))}
                  </Select>
                  <ErrorCampo estado={estado} campo="categoria" />
                </div>
                <Select
                  etiqueta="Nivel de dureza"
                  name="dureza"
                  defaultValue={producto?.dureza ?? "media"}
                >
                  <option value="suave">Dureza suave</option>
                  <option value="media">Dureza media</option>
                  <option value="larga-duracion">Larga duración</option>
                </Select>
                <Campo
                  etiqueta="Proteínas"
                  name="proteinas"
                  defaultValue={producto?.proteinas.join(", ")}
                  placeholder="res, cerdo"
                  ayuda="Separadas por comas"
                />
              </div>

              <Campo
                etiqueta="Beneficio principal"
                name="beneficioPrincipal"
                defaultValue={producto?.beneficioPrincipal}
                placeholder="Glucosamina y condroitina naturales"
                ayuda="La frase corta que aparece en la tarjeta"
              />

              <AreaTexto
                etiqueta="Descripción"
                name="descripcion"
                rows={4}
                defaultValue={producto?.descripcion}
              />
            </div>
          </Panel>

          <Panel titulo="Ficha nutricional">
            <div className="space-y-5 p-6">
              <AreaTexto
                etiqueta="Beneficios"
                name="beneficios"
                rows={4}
                defaultValue={producto?.beneficios.join("\n")}
                ayuda="Uno por línea"
              />
              <AreaTexto
                etiqueta="Ingredientes"
                name="ingredientes"
                rows={3}
                defaultValue={producto?.ingredientes.join("\n")}
                ayuda="Uno por línea"
              />
              <AreaTexto
                etiqueta="Minerales y nutrientes"
                name="minerales"
                rows={3}
                defaultValue={producto?.minerales}
              />
            </div>
          </Panel>

          <Panel titulo="Conservación y advertencias">
            <div className="space-y-5 p-6">
              <AreaTexto
                etiqueta="Indicaciones de conservación"
                name="conservacion"
                rows={2}
                defaultValue={producto?.conservacion}
              />
              <AreaTexto
                etiqueta="Advertencia"
                name="advertencia"
                rows={3}
                defaultValue={producto?.advertencia}
                ayuda="Se muestra destacada en la ficha del producto"
              />
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel titulo="Publicación">
            <div className="space-y-4 p-6">
              <Casilla
                name="activo"
                defaultChecked={producto?.activo ?? true}
                etiqueta="Visible en la tienda"
              />
              <Casilla
                name="destacado"
                defaultChecked={producto?.destacado ?? false}
                etiqueta="Destacar en el inicio"
              />
              <Casilla
                name="disponibleMayor"
                defaultChecked={producto?.disponiblePorMayor ?? false}
                etiqueta="Disponible para venta por mayor"
              />

              <div className="grid grid-cols-2 gap-4 pt-2">
                <Campo
                  etiqueta="Orden"
                  name="orden"
                  type="number"
                  defaultValue={producto?.orden ?? 0}
                  ayuda="Mayor = más reciente"
                />
                <Campo
                  etiqueta="Ventas"
                  name="ventas"
                  type="number"
                  min={0}
                  defaultValue={producto?.ventas ?? 0}
                  ayuda="Para «más vendidos»"
                />
              </div>
            </div>
          </Panel>

          <Panel titulo="Imágenes">
            <div className="space-y-5 p-6">
              <SubirImagen
                nombre="imagen"
                etiqueta="Imagen principal"
                valorInicial={producto?.imagen ?? ""}
                ayuda="PNG sin fondo, hasta 5 MB"
              />
              <AreaTexto
                etiqueta="Galería"
                name="galeria"
                rows={3}
                defaultValue={producto?.galeria.join("\n")}
                ayuda="Una URL o ruta por línea. Si la dejas vacía se usa la principal."
              />
            </div>
          </Panel>

          <Panel titulo="Recomendación">
            <div className="space-y-5 p-6">
              <fieldset>
                <legend className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800">
                  Tamaño del perro
                </legend>
                <div className="space-y-2">
                  {TAMANOS.map((t) => (
                    <Casilla
                      key={t}
                      name="tamanos"
                      value={t}
                      defaultChecked={producto?.tamanos.includes(t) ?? true}
                      etiqueta={nombreTamano[t]}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800">
                  Etapa de vida
                </legend>
                <div className="space-y-2">
                  {EDADES.map((e) => (
                    <Casilla
                      key={e}
                      name="edades"
                      value={e}
                      defaultChecked={producto?.edades.includes(e) ?? true}
                      etiqueta={nombreEdad[e]}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800">
                  Etiquetas
                </legend>
                <div className="space-y-2">
                  {ETIQUETAS.map((e) => (
                    <Casilla
                      key={e}
                      name="etiquetas"
                      value={e}
                      defaultChecked={producto?.etiquetas.includes(e) ?? false}
                      etiqueta={nombreEtiqueta[e]}
                    />
                  ))}
                </div>
              </fieldset>
            </div>
          </Panel>
        </div>
      </div>

      <div className="flex justify-end">
        <BotonEnviar medida="lg">
          <Save className="h-4 w-4" />
          {nuevo ? "Crear producto" : "Guardar cambios"}
        </BotonEnviar>
      </div>
    </form>
  );
}
