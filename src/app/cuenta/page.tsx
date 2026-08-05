import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Dog, Gift, Package, Sparkles, Ticket } from "lucide-react";
import { exigirCliente } from "@/server/sesion";
import { misPedidos } from "@/server/pedidos";
import { misCupones, misMascotas } from "@/server/clientes";
import { obtenerRecompensas, obtenerRegla } from "@/server/recompensas";
import { TarjetaPedido } from "@/components/cuenta/Piezas";
import { AvatarMascota } from "@/components/ui/Elementos";
import { Boton } from "@/components/ui/Boton";
import { edadDesde, fechaCorta, precio } from "@/lib/formato";

export const metadata: Metadata = { title: "Mi cuenta" };

export default async function ResumenCuenta() {
  const cliente = await exigirCliente();

  const [pedidos, mascotas, cupones, recompensas, regla] = await Promise.all([
    misPedidos(),
    misMascotas(),
    misCupones(),
    obtenerRecompensas(),
    obtenerRegla(),
  ]);

  const puntos = cliente.puntos;
  const siguiente = [...recompensas]
    .sort((a, b) => a.puntos - b.puntos)
    .find((r) => r.puntos > puntos);
  const faltan = siguiente ? siguiente.puntos - puntos : 0;
  const progreso = siguiente ? Math.round((puntos / siguiente.puntos) * 100) : 100;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-petroleo-800 p-7 text-white md:p-9">
        <div className="absolute inset-0 patron-huellas-claro" aria-hidden="true" />
        <div
          className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-naranja-500/25 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-naranja-300">
              <Sparkles className="h-3.5 w-3.5" />
              Club Cocina Canina
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold">
              Hola, {cliente.nombres}
            </h2>
            <p className="mt-1 text-sm text-petroleo-100">
              Miembro desde {fechaCorta(cliente.creadoEn.slice(0, 10))}
            </p>

            <p className="mt-5 font-display text-5xl font-semibold leading-none">
              {puntos}
              <span className="ml-2 text-base font-normal text-petroleo-100">puntos</span>
            </p>

            {siguiente ? (
              <div className="mt-5 max-w-sm">
                <div className="h-2 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-naranja-400 to-naranja-500"
                    style={{ width: `${progreso}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-petroleo-100">
                  Te faltan <strong className="text-white">{faltan} puntos</strong> para{" "}
                  {siguiente.nombre.toLowerCase()} ·{" "}
                  {precio(faltan * regla.montoPorPunto)} en compras
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Boton href="/cuenta/recompensas" variante="primario" medida="sm">
                Ver mis recompensas
              </Boton>
              <Boton href="/productos" variante="contornoClaro" medida="sm">
                Hacer un pedido
              </Boton>
            </div>
          </div>

          <Image
            src="/mascota/saltando.png"
            alt=""
            width={733}
            height={1100}
            className="hidden h-40 w-auto object-contain drop-shadow-[0_20px_24px_rgba(2,34,38,0.4)] sm:block"
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            href: "/cuenta/pedidos",
            icono: Package,
            valor: pedidos.length,
            texto: "pedidos realizados",
          },
          {
            href: "/cuenta/mascotas",
            icono: Dog,
            valor: mascotas.length,
            texto: "mascotas registradas",
          },
          {
            href: "/cuenta/cupones",
            icono: Ticket,
            valor: cupones.length,
            texto: "cupones disponibles",
          },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="group flex items-center gap-4 rounded-3xl border border-petroleo-700/10 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-tarjeta"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-crema-100 text-petroleo-700 transition-colors group-hover:bg-naranja-50 group-hover:text-naranja-600">
              <a.icono className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-2xl font-semibold text-petroleo-900">
                {a.valor}
              </span>
              <span className="block text-xs text-grafito">{a.texto}</span>
            </span>
            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-grafito transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </section>

      {mascotas.length > 0 ? (
        <section className="rounded-3xl border border-petroleo-700/10 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-petroleo-900">
              Mis mascotas
            </h2>
            <Link
              href="/cuenta/mascotas"
              className="text-sm font-semibold text-naranja-600 hover:underline"
            >
              Gestionar
            </Link>
          </div>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {mascotas.map((m) => (
              <li key={m.id} className="flex items-center gap-3 rounded-2xl bg-crema-50 p-4">
                <AvatarMascota
                  nombre={m.nombre}
                  foto={m.foto || undefined}
                  className="h-14 w-14"
                />
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold text-petroleo-900">
                    {m.nombre}
                  </p>
                  <p className="truncate text-xs text-grafito">
                    {[m.raza, m.nacimiento ? edadDesde(m.nacimiento) : null, m.pesoKg ? `${m.pesoKg} kg` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {pedidos.length > 0 ? (
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-petroleo-900">
              Pedido más reciente
            </h2>
            <Link
              href="/cuenta/pedidos"
              className="text-sm font-semibold text-naranja-600 hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <TarjetaPedido pedido={pedidos[0]} />
        </section>
      ) : (
        <section className="rounded-3xl border border-petroleo-700/10 bg-white p-8 text-center">
          <p className="text-sm text-grafito">
            Todavía no hiciste ningún pedido. Cuando compres, aparecerá aquí con su
            estado de entrega.
          </p>
          <Boton href="/productos" variante="primario" medida="md" className="mt-5">
            Ver el catálogo
          </Boton>
        </section>
      )}

      {cupones.length > 0 ? (
        <section className="rounded-3xl border border-petroleo-700/10 bg-white p-6">
          <div className="flex items-center gap-2.5">
            <Gift className="h-5 w-5 text-naranja-500" />
            <h2 className="font-display text-xl font-semibold text-petroleo-900">
              Cupones activos
            </h2>
          </div>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {cupones.map((c) => (
              <li
                key={c.codigo}
                className="rounded-2xl border border-dashed border-naranja-500/40 bg-naranja-50 p-4"
              >
                <p className="font-display text-lg font-bold text-naranja-700">
                  {c.codigo}
                </p>
                <p className="text-sm text-petroleo-900">{c.descripcion}</p>
                {c.vence ? (
                  <p className="mt-1 text-xs text-grafito">
                    Vence el {fechaCorta(c.vence)}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
