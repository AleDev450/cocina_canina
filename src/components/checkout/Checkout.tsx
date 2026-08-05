"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  MapPin,
  MessageCircle,
  Package,
  Sparkles,
  Truck,
} from "lucide-react";
import { useTienda } from "@/context/Tienda";
import { metodosEntrega, metodosPago } from "@/data/sitio";
import { direccionesDemo, clienteDemo } from "@/data/cuenta";
import { puntosPorMonto } from "@/data/recompensas";
import { enlacePedido } from "@/lib/whatsapp";
import { cx, precio } from "@/lib/formato";
import { Boton, clasesBoton } from "@/components/ui/Boton";
import { AreaTexto, Campo, Casilla, Select } from "@/components/ui/Campos";
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

function numeroPedido() {
  return `LCC-${1043 + Math.floor(Math.random() * 40)}`;
}

export function Checkout() {
  const { carrito, subtotal, descuento, cupon, vaciar, sesion, hidratado } = useTienda();

  const [paso, setPaso] = useState(1);
  const [pedido, setPedido] = useState<string | null>(null);

  const [datos, setDatos] = useState({
    nombres: sesion.activa ? sesion.nombre : "",
    apellidos: "",
    correo: sesion.activa ? sesion.correo : "",
    celular: "",
    direccion: direccionesDemo[0].linea,
    distrito: DISTRITOS[0],
    referencia: "",
    entrega: "delivery",
    pago: "yape",
    notas: "",
  });

  const actualizar = (campo: keyof typeof datos, valor: string) =>
    setDatos((d) => ({ ...d, [campo]: valor }));

  const envio = useMemo(() => {
    if (datos.entrega === "recojo") return 0;
    if (cupon?.tipo === "envio-gratis") return 0;
    return metodosEntrega[0].costo;
  }, [datos.entrega, cupon]);

  const total = subtotal - descuento + envio;
  const puntos = puntosPorMonto(subtotal - descuento);

  // ------------------------------ Confirmación ------------------------------
  if (pedido) {
    const entrega = metodosEntrega.find((m) => m.id === datos.entrega);
    const pago = metodosPago.find((m) => m.id === datos.pago);

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
                {pedido}
              </span>
              <Copy className="h-4 w-4 text-grafito" aria-hidden="true" />
            </div>

            {/* Resumen */}
            <div className="mt-8 space-y-3 rounded-3xl bg-crema-50 p-6 text-left">
              <h2 className="font-display text-lg font-semibold text-petroleo-900">
                Resumen
              </h2>
              <ul className="space-y-2 border-b border-petroleo-700/10 pb-3">
                {carrito.map((i) => (
                  <li key={i.id} className="flex justify-between gap-3 text-sm">
                    <span className="min-w-0 text-grafito">
                      <span className="font-medium text-petroleo-900">{i.nombre}</span>
                      <span className="block text-xs">
                        {i.presentacion} × {i.cantidad}
                      </span>
                    </span>
                    <span className="shrink-0 font-medium tabular-nums">
                      {precio(i.precio * i.cantidad)}
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="space-y-1.5 text-sm">
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
                  <dt>{entrega?.nombre}</dt>
                  <dd>{envio === 0 ? "Gratis" : precio(envio)}</dd>
                </div>
                <div className="flex justify-between border-t border-petroleo-700/10 pt-2 font-display text-lg font-semibold text-petroleo-900">
                  <dt>Total</dt>
                  <dd>{precio(total)}</dd>
                </div>
              </dl>
              <p className="text-xs text-grafito">Pago con {pago?.nombre}</p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2.5 rounded-2xl bg-naranja-50 px-5 py-4">
              <Sparkles className="h-[1.125rem] w-[1.125rem] shrink-0 text-naranja-500" />
              <p className="text-sm text-naranja-800">
                Ganaste <strong className="font-bold">{puntos} puntos</strong> del Club
                Cocina Canina. Se acreditan 48 h después de la entrega.
              </p>
            </div>

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
                })}
                target="_blank"
                rel="noopener noreferrer"
                className={clasesBoton("whatsapp", "lg")}
              >
                <MessageCircle className="h-4 w-4" />
                Confirmar por WhatsApp
              </a>
              <Boton href="/cuenta/pedidos" variante="contorno" medida="lg">
                Seguir mi pedido
              </Boton>
            </div>

            <button
              type="button"
              onClick={vaciar}
              className="mt-6 text-xs font-semibold text-grafito transition-colors hover:text-naranja-600"
            >
              Vaciar carrito y volver a empezar
            </button>
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
    <div className="contenedor py-12">
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
        {/* Paso actual */}
        <div className="rounded-3xl border border-petroleo-700/10 bg-white p-6 md:p-8">
          {paso === 1 ? (
            <>
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
                        className="h-13 w-13 object-contain"
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
            </>
          ) : null}

          {paso === 2 ? (
            <>
              <h2 className="font-display text-2xl font-semibold text-petroleo-900">
                Datos del cliente
              </h2>
              {!sesion.activa ? (
                <p className="mt-2 text-sm text-grafito">
                  ¿Ya tienes cuenta?{" "}
                  <Link
                    href="/ingresar"
                    className="font-semibold text-naranja-600 hover:underline"
                  >
                    Inicia sesión
                  </Link>{" "}
                  y acumula puntos con esta compra.
                </p>
              ) : null}

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Campo
                  etiqueta="Nombres"
                  required
                  value={datos.nombres}
                  onChange={(e) => actualizar("nombres", e.target.value)}
                  placeholder="Andrea"
                />
                <Campo
                  etiqueta="Apellidos"
                  value={datos.apellidos}
                  onChange={(e) => actualizar("apellidos", e.target.value)}
                  placeholder="Salazar"
                />
                <Campo
                  etiqueta="Correo"
                  type="email"
                  value={datos.correo}
                  onChange={(e) => actualizar("correo", e.target.value)}
                  placeholder="andrea@ejemplo.pe"
                />
                <Campo
                  etiqueta="Celular"
                  required
                  type="tel"
                  value={datos.celular}
                  onChange={(e) => actualizar("celular", e.target.value)}
                  placeholder="987 654 321"
                  ayuda="Te escribiremos por aquí para confirmar"
                />
              </div>
            </>
          ) : null}

          {paso === 3 ? (
            <>
              <h2 className="font-display text-2xl font-semibold text-petroleo-900">
                Dirección de entrega
              </h2>

              {sesion.activa ? (
                <div className="mt-5 space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800">
                    Direcciones guardadas
                  </span>
                  {direccionesDemo.map((d) => (
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
                <Campo
                  etiqueta="Dirección"
                  required
                  contenedor="sm:col-span-2"
                  value={datos.direccion}
                  onChange={(e) => actualizar("direccion", e.target.value)}
                  placeholder="Av. Arequipa 2450, dpto. 502"
                />
                <Select
                  etiqueta="Distrito"
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
                  opcional
                  value={datos.referencia}
                  onChange={(e) => actualizar("referencia", e.target.value)}
                  placeholder="Edificio blanco, frente al parque"
                />
                <AreaTexto
                  etiqueta="Notas para el pedido"
                  opcional
                  contenedor="sm:col-span-2"
                  rows={3}
                  value={datos.notas}
                  onChange={(e) => actualizar("notas", e.target.value)}
                  placeholder="Horario preferido, indicaciones para el repartidor…"
                />
              </div>
            </>
          ) : null}

          {paso === 4 ? (
            <>
              <h2 className="font-display text-2xl font-semibold text-petroleo-900">
                Método de entrega
              </h2>
              <div className="mt-6 space-y-3">
                {metodosEntrega.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => actualizar("entrega", m.id)}
                    className={cx(
                      "flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-colors",
                      datos.entrega === m.id
                        ? "border-naranja-500 bg-naranja-50"
                        : "border-petroleo-700/15 hover:border-petroleo-700/40",
                    )}
                  >
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
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {paso === 5 ? (
            <>
              <h2 className="font-display text-2xl font-semibold text-petroleo-900">
                Método de pago
              </h2>
              <div className="mt-6 space-y-3">
                {metodosPago.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    disabled={!m.activo}
                    onClick={() => actualizar("pago", m.id)}
                    className={cx(
                      "flex w-full items-center justify-between gap-4 rounded-2xl border p-5 text-left transition-colors",
                      datos.pago === m.id
                        ? "border-naranja-500 bg-naranja-50"
                        : "border-petroleo-700/15 hover:border-petroleo-700/40",
                      !m.activo && "cursor-not-allowed opacity-50 hover:border-petroleo-700/15",
                    )}
                  >
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
                  </button>
                ))}
              </div>

              <Casilla
                className="mt-6"
                defaultChecked
                etiqueta={
                  <>
                    Acepto los{" "}
                    <Link href="/legal/terminos" className="font-semibold text-naranja-600 hover:underline">
                      términos y condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link href="/legal/privacidad" className="font-semibold text-naranja-600 hover:underline">
                      política de privacidad
                    </Link>
                    .
                  </>
                }
              />
            </>
          ) : null}

          {paso === 6 ? (
            <>
              <h2 className="font-display text-2xl font-semibold text-petroleo-900">
                Confirma tu pedido
              </h2>
              <dl className="mt-6 space-y-4 text-sm">
                {[
                  {
                    t: "Cliente",
                    v: `${datos.nombres} ${datos.apellidos}`.trim() || clienteDemo.nombres,
                    extra: datos.celular,
                  },
                  {
                    t: "Entrega",
                    v: metodosEntrega.find((m) => m.id === datos.entrega)?.nombre ?? "",
                    extra:
                      datos.entrega === "delivery"
                        ? `${datos.direccion}, ${datos.distrito}`
                        : "Coordinamos el horario de recojo",
                  },
                  {
                    t: "Pago",
                    v: metodosPago.find((m) => m.id === datos.pago)?.nombre ?? "",
                    extra: metodosPago.find((m) => m.id === datos.pago)?.detalle,
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
            </>
          ) : null}

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
                variante="primario"
                medida="lg"
                disabled={!puedeAvanzar}
                onClick={() => setPaso((p) => p + 1)}
              >
                Continuar
                <ArrowRight className="h-4 w-4" />
              </Boton>
            ) : (
              <Boton
                variante="primario"
                medida="lg"
                onClick={() => setPedido(numeroPedido())}
              >
                Confirmar pedido · {precio(total)}
              </Boton>
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

          <p className="mt-4 flex items-center gap-2 rounded-2xl bg-naranja-50 px-4 py-3 text-xs text-naranja-800">
            <Sparkles className="h-4 w-4 shrink-0 text-naranja-500" />
            Ganarás <strong className="font-bold">{puntos} puntos</strong>
          </p>
        </aside>
      </div>
    </div>
  );
}
