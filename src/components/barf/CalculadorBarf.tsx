"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { Calculator, Info } from "lucide-react";
import { racionDiaria, precioKgPara } from "@/data/barf";
import type { ProductoBarf } from "@/lib/tipos";
import { precio } from "@/lib/formato";
import { Boton } from "@/components/ui/Boton";
import { Campo, GrupoOpciones, Select } from "@/components/ui/Campos";
import { Antetitulo } from "@/components/ui/Elementos";

type Actividad = "baja" | "normal" | "alta";

const ACTIVIDADES: Array<{ id: Actividad; nombre: string; nota: string }> = [
  { id: "baja", nombre: "Tranquilo", nota: "Paseos cortos" },
  { id: "normal", nombre: "Normal", nota: "Paseo diario" },
  { id: "alta", nombre: "Muy activo", nota: "Corre y juega mucho" },
];

export function CalculadorBarf({ productosBarf }: { productosBarf: ProductoBarf[] }) {
  const [nombre, setNombre] = useState("");
  const [peso, setPeso] = useState("12");
  const [edad, setEdad] = useState("24");
  const [actividad, setActividad] = useState<Actividad>("normal");
  const [receta, setReceta] = useState(productosBarf[1]?.slug ?? productosBarf[0]?.slug ?? "");
  const [resultado, setResultado] = useState<ReturnType<typeof racionDiaria> | null>(null);

  const calcular = (e: FormEvent) => {
    e.preventDefault();
    const pesoNum = Number(peso);
    const edadNum = Number(edad);
    if (!pesoNum || pesoNum <= 0) return;
    setResultado(racionDiaria(pesoNum, edadNum, actividad));
  };

  const producto = productosBarf.find((p) => p.slug === receta) ?? productosBarf[0];
  const kilosMes = resultado?.kilosMes ?? 0;
  const precioKg = kilosMes > 0 ? precioKgPara(producto, Math.round(kilosMes)) : 0;

  return (
    <section id="calculador" className="bg-crema-50 py-16 md:py-24">
      <div className="contenedor">
        <div className="overflow-hidden rounded-blob border border-petroleo-700/10 bg-white">
          <div className="grid lg:grid-cols-[1.1fr_1fr]">
            {/* Formulario */}
            <form onSubmit={calcular} className="p-8 md:p-10">
              <Antetitulo>Calculador orientativo</Antetitulo>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-petroleo-900">
                ¿Cuánto BARF necesita tu perro?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-grafito">
                Cuéntanos un poco de tu mascota y te damos una referencia de cuántos
                kilos pedir al mes.
              </p>

              <div className="mt-7 space-y-5">
                <Campo
                  etiqueta="Nombre de tu mascota"
                  placeholder="Rocco"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Campo
                    etiqueta="Peso"
                    type="number"
                    min={1}
                    max={90}
                    step="0.5"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    ayuda="En kilogramos"
                  />
                  <Select
                    etiqueta="Edad"
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                  >
                    <option value="2">Menos de 4 meses</option>
                    <option value="5">De 4 a 6 meses</option>
                    <option value="9">De 7 a 11 meses</option>
                    <option value="24">Adulto (1 a 7 años)</option>
                    <option value="96">Adulto mayor (8+ años)</option>
                  </Select>
                </div>

                <div>
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800">
                    Nivel de actividad
                  </span>
                  <GrupoOpciones
                    opciones={ACTIVIDADES}
                    valor={actividad}
                    onCambio={setActividad}
                    columnas={3}
                  />
                </div>

                <Select
                  etiqueta="Receta preferida"
                  value={receta}
                  onChange={(e) => setReceta(e.target.value)}
                >
                  {productosBarf.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.nombre}
                    </option>
                  ))}
                </Select>
              </div>

              <Boton type="submit" variante="primario" medida="lg" className="mt-7 w-full">
                <Calculator className="h-4 w-4" />
                Calcular ración
              </Boton>
            </form>

            {/* Resultado */}
            <div className="relative bg-petroleo-800 p-8 text-white md:p-10">
              <div className="absolute inset-0 patron-huellas-claro" aria-hidden="true" />

              <div className="relative flex h-full flex-col">
                {resultado ? (
                  <>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-naranja-300">
                      Recomendación referencial
                    </span>
                    <p className="mt-4 font-display text-2xl font-medium">
                      {nombre.trim() ? `Para ${nombre.trim()}` : "Para tu mascota"}
                    </p>

                    <div className="mt-6 space-y-4">
                      <div className="rounded-2xl bg-white/10 p-5">
                        <span className="text-xs uppercase tracking-wider text-petroleo-100">
                          Ración diaria
                        </span>
                        <p className="font-display text-4xl font-semibold leading-none">
                          {resultado.gramosDia}
                          <span className="ml-1 text-lg font-normal">g</span>
                        </p>
                        <p className="mt-1.5 text-xs text-petroleo-100">
                          Equivale al {resultado.porcentaje.toFixed(1)}% de su peso
                          corporal, repartido en 2 comidas.
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white/10 p-5">
                        <span className="text-xs uppercase tracking-wider text-petroleo-100">
                          Compra sugerida al mes
                        </span>
                        <p className="font-display text-4xl font-semibold leading-none">
                          {resultado.kilosMes}
                          <span className="ml-1 text-lg font-normal">kg</span>
                        </p>
                        <p className="mt-1.5 text-sm text-naranja-300">
                          {producto.nombre} · aprox.{" "}
                          <strong className="font-semibold">
                            {precio(precioKg * resultado.kilosMes)}
                          </strong>{" "}
                          ({precio(precioKg)}/kg)
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-2.5 rounded-2xl border border-white/15 p-4">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-naranja-300" />
                      <p className="text-xs leading-relaxed text-petroleo-100">
                        Este cálculo es <strong>referencial</strong> y no reemplaza la
                        asesoría veterinaria. Ajusta la porción según la condición
                        corporal de tu mascota y consulta a tu veterinario antes de
                        cambiar su alimentación.
                      </p>
                    </div>

                    <Boton
                      href="#recetas"
                      variante="primario"
                      medida="md"
                      className="mt-6 w-full"
                    >
                      Elegir mi receta
                    </Boton>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <Image
                      src="/images/dante/formulario.png"
                      alt=""
                      width={945}
                      height={1300}
                      sizes="176px"
                      className="h-44 w-auto object-contain drop-shadow-[0_20px_24px_rgba(2,34,38,0.4)]"
                    />
                    <p className="mt-6 font-display text-xl font-semibold">
                      Completa los datos y te decimos cuánto pedir
                    </p>
                    <p className="mt-2 max-w-xs text-sm text-petroleo-100">
                      Usamos los porcentajes de peso vivo habituales en dietas BARF
                      según edad y nivel de actividad.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
