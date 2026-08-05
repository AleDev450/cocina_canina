"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  MessageCircle,
  Package,
  Sparkles,
  Truck,
} from "lucide-react";
import { useTienda } from "@/context/Tienda";
import type { Direccion, ReglaPuntos } from "@/lib/tipos";
import type { Configuracion } from "@/server/contenido";
import { crearPedido } from "@/server/acciones/pedidos";
import { enlacePedido } from "@/lib/whatsapp";
import { cx, precio } from "@/lib/formato";
import { Boton, clasesBoton } from "@/components/ui/Boton";
import { AreaTexto, Campo, Casilla, Select } from "@/components/ui/Campos";
import {
  Aviso,
  BotonEnviar,
  ErrorCampo,
  ESTADO_INICIAL,
} from "@/components/ui/Formulario";
import { EstadoVacio, Pastilla } from "@/components/ui/Elementos";

const PASOS = [
  { id: 1, nombre: "Carrito" },
  { id: 2, nombre: "Tus datos" },
  { id: 3, nombre: "Dirección" },
  { id: 4, nombre: "Entrega" },
  { id: 5, nombre: "Pago" },
  { id: 6, nombre: "Confirmación" },
];

const DISTRITOS = [
  "Lince",
  "San Isidro",
  "Miraflores",
  "Surco",
  "San Borja",
  "Jesús María",
  "Magdalena",
  "Pueblo Libre",
  "Barranco",
  "La Molina",
  "Otro",
];

interface Props {
  config: Configuracion;
  regla: ReglaPuntos;
  direcciones: Direccion[];
  cliente: { nombres: string; apellidos: string; correo: string; celular: string } | null;
}

export function Checkout({ config, regla, direcciones, cliente }: Props) {
  const { carrito, subtotal, descuento, cupon, vaciar, hidratado } = useTienda();
  const [estado, accion] = useActionState(crearPedido, {
    ...ESTADO_INICIAL,
  } as Awaited<ReturnType<typeof crearPedido>>);

  const [paso, setPaso] = useState(1);
  const predeterminada = direcciones.find((d) => d.predeterminada) ?? direcciones[0];

  const [datos, setDatos] = useState({
    nombres: cliente?.nombres ?? "",
    apellidos: cliente?.apellidos ?? "",
    correo: cliente?.correo ?? "",
    celular: cliente?.celular ?? "",
    direccion: predeterminada?.linea ?? "",
    distrito: predeterminada?.distrito ?? DISTRITOS[0],
    referencia: predeterminada?.referencia ?? "",
    entrega: "delivery",
    pago: config.pago.metodos.find((m) => m.activo)?.id ?? "yape",
  });

  const actualizar = (campo: keyof typeof datos, valor: string) =>
    setDatos((d) => ({ ...d, [campo]: valor }));

  // Al confirmarse el pedido, el carrito ya cumplió su función.
  const numero = estado.numero;
  useEffect(() => {
    if (numero) vaciar();
  }, [numero, vaciar]);

  const costoDelivery =
    config.entrega.metodos.find((m) => m.id === "delivery")?.costo ?? 12;

  const envio = useMemo(() => {
    if (datos.entrega === "recojo") return 0;
    if (cupon?.tipo === "envio-gratis") return 0;
    if (
      config.entrega.envioGratisDesde > 0 &&
      subtotal - descuento >= config.entrega.envioGratisDesde
    ) {
      return 0;
    }
    return costoDelivery;
  }, [datos.entrega, cupon, subtotal, descuento, config.entrega.envioGratisDesde, costoDelivery]);

  const total = subtotal - descuento + envio;
  const puntos =
    subtotal - descuento < regla.compraMinima
      ? 0
      : Math.floor((subtotal - descuento) / regla.montoPorPunto) *
        regla.puntosOtorgados *
        regla.multiplicador;

  /* ---------------------------- Confirmación ---------------------------- */

  if (numero) {
    const entrega = config.entrega.metodos.find((m) => m.id === datos.entrega);
    const pago = config.pago.metodos.find((m) => m.id === datos.pago);

    return (
      <div className="contenedor max-w-3xl py-14">
        <div className="relative overflow-hidden rounded-blob border border-petroleo-700/10 bg-white p-8 text-center md:p-12">
          <div className="absolute inset-0 patron-huellas opacity-60" aria-hidden="true" />

          <div className="relative">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-hoja-500 text-white">
              <Check className="h-8 w-8" strokeWidth={3} />
            </span>

            <h1 className="mt-6 font-display text-3xl font-semibold text-petroleo-900 md:text-4xl">
              ¡Gracias, {datos.nombres || "amigo"}!
            </h1>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-grafito">
              Recibimos tu pedido. Te escribiremos por WhatsApp para confirmar la
              disponibilidad, el costo exacto del envío y el horario de entrega.
            </p>

            <div className="mx-auto mt-7 inline-flex items-center gap-3 rounded-full border border-dashed border-petroleo-700/30 px-5 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-grafito">
                Pedido
              </span>
              <span className="font-display text-xl font-semibold text-petroleo-900">
                {numero}
              </span>
            </div>

            <div className="mt-8 space-y-2 rounded-3xl bg-crema-50 p-6 text-left text-sm">
              <p className="text-grafito">
                <strong className="text-petroleo-900">Entrega:</strong>{" "}
                {entrega?.nombre}
                {datos.entrega === "delivery"
                  ? ` · ${datos.direccion}, ${datos.distrito}`
                  : ""}
              </p>
              <p className="text-grafito">
                <strong className="text-petroleo-900">Pago:</strong> {pago?.nombre}
              </p>
              <p className="text-grafito">
                <strong className="text-petroleo-900">Total:</strong> {precio(total)}
              </p>
            </div>

            {cliente ? (
              <div className="mt-6 flex items-center justify-center gap-2.5 rounded-2xl bg-naranja-50 px-5 py-4">
                <Sparkles className="h-[1.125rem] w-[1.125rem] shrink-0 text-naranja-500" />
                <p className="text-sm text-naranja-800">
                  Ganaste <strong className="font-bold">{puntos} puntos</strong> del Club
                  Cocina Canina. Se acreditan cuando el pedido figure como entregado.
                </p>
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={enlacePedido({
                  cliente: `${datos.nombres} ${datos.apellidos}`.trim(),
                  items: carrito,
                  total,
                  direccion:
                    datos.entrega === "delivery"
                      ? `${datos.direccion}, ${datos.distrito}`
                      : undefined,
                  entrega: entrega?.nombre,
                  numero: config.contacto.whatsapp,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className={clasesBoton("whatsapp", "lg")}
              >
                <MessageCircle className="h-4 w-4" />
                Confirmar por WhatsApp
              </a>
              <Boton
                href={cliente ? "/cuenta/pedidos" : "/productos"}
                variante="contorno"
                medida="lg"
              >
                {cliente ? "Seguir mi pedido" : "Seguir comprando"}
              </Boton>
            </div>
          </div>

          <Image
            src="/mascota/saltando.png"
            alt=""
            width={733}
            height={1100}
            className="pointer-events-none absolute -bottom-2 -right-4 hidden h-44 w-auto object-contain opacity-90 lg:block"
          />
        </div>
      </div>
    );
  }

  if (!hidratado) return <div className="contenedor py-24" aria-busy="true" />;

  if (carrito.length === 0) {
    return (
      <div className="contenedor py-16">
        <div className="rounded-blob border border-petroleo-700/10 bg-white">
          <EstadoVacio
            pose="sentado"
            titulo="No hay nada que pagar todavía"
            texto="Agrega algunos snacks al carrito y vuelve para completar tu pedido."
            accion={
              <Boton href="/productos" variante="primario" medida="md">
                Ver productos
              </Boton>
            }
          />
        </div>
      </div>
    );
  }

  const puedeAvanzar =
    paso !== 2 || (datos.nombres.trim() !== "" && datos.celular.trim() !== "");

  return (
    <form action={accion} className="contenedor py-12">
      {/* El carrito viaja al servidor como JSON; los precios se revalidan allí. */}
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(
          carrito.map((i) => ({
            slug: i.slug,
            nombre: i.nombre,
            presentacion: i.presentacion,
            precio: i.precio,
            cantidad: i.cantidad,
            tipo: i.tipo,
            kilos: i.kilos,
            frecuencia: i.frecuencia,
          })),
        )}
      />
      {cupon ? <input type="hidden" name="cupon" value={cupon.codigo} /> : null}

      {/* Pasos */}
      <ol className="sin-scrollbar mb-10 flex gap-1 overflow-x-auto pb-2">
        {PASOS.map((p) => {
          const completo = p.id < paso;
          const activo = p.id === paso;
          return (
            <li key={p.id} className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => p.id < paso && setPaso(p.id)}
                disabled={p.id > paso}
                className={cx(
                  "flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors",
                  activo
                    ? "bg-naranja-500 text-white"
                    : completo
                      ? "bg-petroleo-100 text-petroleo-800 hover:bg-petroleo-200"
                      : "text-grafito",
                )}
              >
                <span
                  className={cx(
                    "grid h-5 w-5 place-items-center rounded-full text-[0.65rem]",
                    activo
                      ? "bg-white/25"
                      : completo
                        ? "bg-hoja-500 text-white"
                        : "bg-crema-200",
                  )}
                >
                  {completo ? <Check className="h-3 w-3" strokeWidth={3} /> : p.id}
                </span>
                {p.nombre}
              </button>
              {p.id < PASOS.length ? (
                <span className="h-px w-3 bg-petroleo-700/15" aria-hidden="true" />
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="grid gap-8 lg:grid-cols-[1fr_21rem] lg:items-start">
        <div className="rounded-3xl border border-petroleo-700/10 bg-white p-6 md:p-8">
          <Aviso estado={estado} />

          {/* Los campos siempre están en el DOM para que viajen en el envío; se
              ocultan los que no corresponden al paso actual. */}
          <div className={cx(paso !== 1 && "hidden")}>
            <h2 className="font-display text-2xl font-semibold text-petroleo-900">
              Revisa tu pedido
            </h2>
            <ul className="mt-6 divide-y divide-petroleo-700/10">
              {carrito.map((i) => (
                <li key={i.id} className="flex items-center gap-4 py-4">
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-crema-50">
                    <Image
                      src={i.imagen}
                      alt=""
                      width={120}
                      height={120}
                      className="h-[3.25rem] w-[3.25rem] object-contain"
                      unoptimized={i.imagen.startsWith("http")}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-petroleo-900">
                      {i.nombre}
                    </span>
                    <span className="block text-xs text-grafito">
                      {i.presentacion} × {i.cantidad}
                    </span>
                  </span>
                  <span className="shrink-0 font-display text-lg font-semibold">
                    {precio(i.precio * i.cantidad)}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/carrito"
              className="mt-4 inline-flex text-sm font-semibold text-naranja-600 hover:text-naranja-700"
            >
              Modificar el carrito
            </Link>
          </div>

          <div className={cx(paso !== 2 && "hidden")}>
            <h2 className="font-display text-2xl font-semibold text-petroleo-900">
              Datos del cliente
            </h2>
            {!cliente ? (
              <p className="mt-2 text-sm text-grafito">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/ingresar?siguiente=/checkout"
                  className="font-semibold text-naranja-600 hover:underline"
                >
                  Inicia sesión
                </Link>{" "}
                y acumula puntos con esta compra.
              </p>
            ) : null}

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Campo
                  etiqueta="Nombres"
                  name="nombres"
                  required
                  value={datos.nombres}
                  onChange={(e) => actualizar("nombres", e.target.value)}
                  placeholder="Andrea"
                />
                <ErrorCampo estado={estado} campo="nombres" />
              </div>
              <Campo
                etiqueta="Apellidos"
                name="apellidos"
                value={datos.apellidos}
                onChange={(e) => actualizar("apellidos", e.target.value)}
                placeholder="Salazar"
              />
              <Campo
                etiqueta="Correo"
                name="correo"
                type="email"
                value={datos.correo}
                onChange={(e) => actualizar("correo", e.target.value)}
                placeholder="andrea@ejemplo.pe"
              />
              <div>
                <Campo
                  etiqueta="Celular"
                  name="celular"
                  required
                  type="tel"
                  value={datos.celular}
                  onChange={(e) => actualizar("celular", e.target.value)}
                  placeholder="987 654 321"
                  ayuda="Te escribiremos por aquí para confirmar"
                />
                <ErrorCampo estado={estado} campo="celular" />
              </div>
            </div>
          </div>

          <div className={cx(paso !== 3 && "hidden")}>
            <h2 className="font-display text-2xl font-semibold text-petroleo-900">
              Dirección de entrega
            </h2>

            {direcciones.length > 0 ? (
              <div className="mt-5 space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800">
                  Direcciones guardadas
                </span>
                {direcciones.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      actualizar("direccion", d.linea);
                      actualizar("distrito", d.distrito);
                      actualizar("referencia", d.referencia);
                    }}
                    className={cx(
                      "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                      datos.direccion === d.linea
                        ? "border-naranja-500 bg-naranja-50"
                        : "border-petroleo-700/15 hover:border-petroleo-700/40",
                    )}
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-naranja-500" />
                    <span>
                      <span className="block text-sm font-semibold text-petroleo-900">
                        {d.alias} · {d.distrito}
                      </span>
                      <span className="block text-xs text-grafito">{d.linea}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Campo
                  etiqueta="Dirección"
                  name="direccion"
                  value={datos.direccion}
                  onChange={(e) => actualizar("direccion", e.target.value)}
                  placeholder="Av. Arequipa 2450, dpto. 502"
                />
                <ErrorCampo estado={estado} campo="direccion" />
              </div>
              <Select
                etiqueta="Distrito"
                name="distrito"
                value={datos.distrito}
                onChange={(e) => actualizar("distrito", e.target.value)}
              >
                {DISTRITOS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
              <Campo
                etiqueta="Referencia"
                name="referencia"
                opcional
                value={datos.referencia}
                onChange={(e) => actualizar("referencia", e.target.value)}
                placeholder="Edificio blanco, frente al parque"
              />
              <AreaTexto
                etiqueta="Notas para el pedido"
                name="notas"
                opcional
                contenedor="sm:col-span-2"
                rows={3}
                placeholder="Horario preferido, indicaciones para el repartidor…"
              />
            </div>
          </div>

          <div className={cx(paso !== 4 && "hidden")}>
            <h2 className="font-display text-2xl font-semibold text-petroleo-900">
              Método de entrega
            </h2>
            <div className="mt-6 space-y-3">
              {config.entrega.metodos.map((m) => (
                <label
                  key={m.id}
                  className={cx(
                    "flex w-full cursor-pointer items-start gap-4 rounded-2xl border p-5 text-left transition-colors",
                    datos.entrega === m.id
                      ? "border-naranja-500 bg-naranja-50"
                      : "border-petroleo-700/15 hover:border-petroleo-700/40",
                  )}
                >
                  <input
                    type="radio"
                    name="entrega"
                    value={m.id}
                    checked={datos.entrega === m.id}
                    onChange={() => actualizar("entrega", m.id)}
                    className="sr-only"
                  />
                  <span
                    className={cx(
                      "grid h-11 w-11 shrink-0 place-items-center rounded-2xl",
                      datos.entrega === m.id
                        ? "bg-naranja-500 text-white"
                        : "bg-crema-100 text-petroleo-700",
                    )}
                  >
                    {m.id === "delivery" ? (
                      <Truck className="h-5 w-5" />
                    ) : (
                      <Package className="h-5 w-5" />
                    )}
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-display text-lg font-semibold text-petroleo-900">
                        {m.nombre}
                      </span>
                      <span className="shrink-0 text-sm font-bold text-petroleo-900">
                        {m.costo === 0 ? "Gratis" : precio(m.costo)}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-grafito">{m.detalle}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className={cx(paso !== 5 && "hidden")}>
            <h2 className="font-display text-2xl font-semibold text-petroleo-900">
              Método de pago
            </h2>
            <div className="mt-6 space-y-3">
              {config.pago.metodos.map((m) => (
                <label
                  key={m.id}
                  className={cx(
                    "flex w-full items-center justify-between gap-4 rounded-2xl border p-5 text-left transition-colors",
                    datos.pago === m.id
                      ? "border-naranja-500 bg-naranja-50"
                      : "border-petroleo-700/15",
                    m.activo
                      ? "cursor-pointer hover:border-petroleo-700/40"
                      : "cursor-not-allowed opacity-50",
                  )}
                >
                  <input
                    type="radio"
                    name="metodoPago"
                    value={m.nombre}
                    checked={datos.pago === m.id}
                    disabled={!m.activo}
                    onChange={() => actualizar("pago", m.id)}
                    className="sr-only"
                  />
                  <span>
                    <span className="block font-display text-lg font-semibold text-petroleo-900">
                      {m.nombre}
                    </span>
                    <span className="block text-sm text-grafito">{m.detalle}</span>
                  </span>
                  {!m.activo ? (
                    <Pastilla tono="suaveAmbar">Próximamente</Pastilla>
                  ) : datos.pago === m.id ? (
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-naranja-500 text-white">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                  ) : null}
                </label>
              ))}
            </div>

            <Casilla
              className="mt-6"
              defaultChecked
              required
              etiqueta={
                <>
                  Acepto los{" "}
                  <Link
                    href="/legal/terminos"
                    className="font-semibold text-naranja-600 hover:underline"
                  >
                    términos y condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link
                    href="/legal/privacidad"
                    className="font-semibold text-naranja-600 hover:underline"
                  >
                    política de privacidad
                  </Link>
                  .
                </>
              }
            />
          </div>

          <div className={cx(paso !== 6 && "hidden")}>
            <h2 className="font-display text-2xl font-semibold text-petroleo-900">
              Confirma tu pedido
            </h2>
            <dl className="mt-6 space-y-4 text-sm">
              {[
                {
                  t: "Cliente",
                  v: `${datos.nombres} ${datos.apellidos}`.trim(),
                  extra: datos.celular,
                },
                {
                  t: "Entrega",
                  v: config.entrega.metodos.find((m) => m.id === datos.entrega)?.nombre ?? "",
                  extra:
                    datos.entrega === "delivery"
                      ? `${datos.direccion}, ${datos.distrito}`
                      : "Coordinamos el horario de recojo",
                },
                {
                  t: "Pago",
                  v: config.pago.metodos.find((m) => m.id === datos.pago)?.nombre ?? "",
                  extra: config.pago.metodos.find((m) => m.id === datos.pago)?.detalle,
                },
              ].map((f) => (
                <div
                  key={f.t}
                  className="flex items-start justify-between gap-4 rounded-2xl bg-crema-50 p-4"
                >
                  <dt className="text-xs font-bold uppercase tracking-wider text-grafito">
                    {f.t}
                  </dt>
                  <dd className="text-right">
                    <span className="block font-semibold text-petroleo-900">{f.v}</span>
                    {f.extra ? (
                      <span className="block text-xs text-grafito">{f.extra}</span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Navegación */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-petroleo-700/10 pt-6">
            <button
              type="button"
              onClick={() => setPaso((p) => Math.max(1, p - 1))}
              disabled={paso === 1}
              className="inline-flex items-center gap-2 text-sm font-semibold text-grafito transition-colors hover:text-petroleo-800 disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Atrás
            </button>

            {paso < 6 ? (
              <Boton
                type="button"
                variante="primario"
                medida="lg"
                disabled={!puedeAvanzar}
                onClick={() => setPaso((p) => p + 1)}
              >
                Continuar
                <ArrowRight className="h-4 w-4" />
              </Boton>
            ) : (
              <BotonEnviar medida="lg" enviando="Registrando pedido…">
                Confirmar pedido · {precio(total)}
              </BotonEnviar>
            )}
          </div>
        </div>

        {/* Resumen lateral */}
        <aside className="rounded-3xl border border-petroleo-700/10 bg-crema-50 p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-lg font-semibold text-petroleo-900">
            Tu pedido
          </h2>
          <ul className="mt-4 space-y-2 border-b border-petroleo-700/10 pb-4 text-sm">
            {carrito.map((i) => (
              <li key={i.id} className="flex justify-between gap-3">
                <span className="min-w-0 truncate text-grafito">
                  {i.cantidad} × {i.nombre}
                </span>
                <span className="shrink-0 font-medium tabular-nums">
                  {precio(i.precio * i.cantidad)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-grafito">
              <dt>Subtotal</dt>
              <dd>{precio(subtotal)}</dd>
            </div>
            {descuento > 0 ? (
              <div className="flex justify-between text-hoja-600">
                <dt>Descuento</dt>
                <dd>−{precio(descuento)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between text-grafito">
              <dt>Envío</dt>
              <dd>{envio === 0 ? "Gratis" : precio(envio)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-petroleo-700/10 pt-3">
              <dt className="font-display text-base font-semibold text-petroleo-900">
                Total
              </dt>
              <dd className="font-display text-2xl font-semibold text-petroleo-900">
                {precio(total)}
              </dd>
            </div>
          </dl>

          {cliente ? (
            <p className="mt-4 flex items-center gap-2 rounded-2xl bg-naranja-50 px-4 py-3 text-xs text-naranja-800">
              <Sparkles className="h-4 w-4 shrink-0 text-naranja-500" />
              Ganarás <strong className="font-bold">{puntos} puntos</strong>
            </p>
          ) : (
            <p className="mt-4 rounded-2xl bg-crema-100 px-4 py-3 text-xs text-grafito">
              <Link
                href="/registro"
                className="font-semibold text-naranja-600 hover:underline"
              >
                Crea tu cuenta
              </Link>{" "}
              para acumular puntos con esta compra.
            </p>
          )}
        </aside>
      </div>
    </form>
  );
}
