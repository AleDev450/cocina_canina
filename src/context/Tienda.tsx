"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ItemCarrito } from "@/lib/tipos";
import { validarCupon } from "@/server/acciones/recompensas";
import { reglaPuntos as REGLA_POR_DEFECTO } from "@/data/recompensas";

/**
 * Estado de tienda del prototipo: carrito, favoritos, cupón y sesión de
 * demostración. Persiste en localStorage para que la navegación entre páginas
 * se sienta real durante la revisión del diseño.
 *
 * Cuando entre Supabase: el carrito puede quedarse en cliente, mientras que
 * favoritos y sesión pasan a `favoritos` y `auth.users`.
 */

export interface CuponAplicado {
  codigo: string;
  descripcion: string;
  tipo: string;
  valor: number;
}

interface Sesion {
  activa: boolean;
  nombre: string;
  correo: string;
}

interface Tienda {
  hidratado: boolean;

  carrito: ItemCarrito[];
  agregar: (item: ItemCarrito) => void;
  cambiarCantidad: (id: string, cantidad: number) => void;
  quitar: (id: string) => void;
  vaciar: () => void;
  cantidadTotal: number;
  subtotal: number;
  puntosDelCarrito: number;

  favoritos: string[];
  alternarFavorito: (slug: string) => void;
  esFavorito: (slug: string) => boolean;

  cupon: CuponAplicado | null;
  aplicarCupon: (codigo: string) => Promise<{ ok: boolean; mensaje: string }>;
  quitarCupon: () => void;
  descuento: number;

  carritoAbierto: boolean;
  abrirCarrito: () => void;
  cerrarCarrito: () => void;

  buscadorAbierto: boolean;
  setBuscadorAbierto: (v: boolean) => void;

  sesion: Sesion;
  iniciarSesion: (nombre?: string, correo?: string) => void;
  cerrarSesion: () => void;

  ultimoAgregado: string | null;
}

const ContextoTienda = createContext<Tienda | null>(null);

const CLAVE = "lcc:tienda:v1";

interface Guardado {
  carrito: ItemCarrito[];
  favoritos: string[];
  sesion: Sesion;
  cupon: CuponAplicado | null;
}

const SESION_VACIA: Sesion = { activa: false, nombre: "", correo: "" };

export function ProveedorTienda({
  children,
  regla = REGLA_POR_DEFECTO,
}: {
  children: ReactNode;
  regla?: { montoPorPunto: number; puntosOtorgados: number; multiplicador: number; compraMinima: number };
}) {
  const [hidratado, setHidratado] = useState(false);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [sesion, setSesion] = useState<Sesion>(SESION_VACIA);
  const [cupon, setCupon] = useState<CuponAplicado | null>(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [ultimoAgregado, setUltimoAgregado] = useState<string | null>(null);

  // Rehidratar
  useEffect(() => {
    try {
      const crudo = window.localStorage.getItem(CLAVE);
      if (crudo) {
        const datos = JSON.parse(crudo) as Partial<Guardado>;
        if (Array.isArray(datos.carrito)) setCarrito(datos.carrito);
        if (Array.isArray(datos.favoritos)) setFavoritos(datos.favoritos);
        if (datos.sesion) setSesion(datos.sesion);
        if (datos.cupon) setCupon(datos.cupon);
      }
    } catch {
      // localStorage bloqueado: el prototipo sigue funcionando en memoria.
    }
    setHidratado(true);
  }, []);

  // Persistir
  useEffect(() => {
    if (!hidratado) return;
    try {
      const datos: Guardado = {
        carrito,
        favoritos,
        sesion,
        cupon,
      };
      window.localStorage.setItem(CLAVE, JSON.stringify(datos));
    } catch {
      /* sin persistencia */
    }
  }, [carrito, favoritos, sesion, cupon, hidratado]);

  // Bloquear el scroll del fondo mientras hay un panel abierto
  useEffect(() => {
    const bloquear = carritoAbierto || buscadorAbierto;
    document.body.style.overflow = bloquear ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [carritoAbierto, buscadorAbierto]);

  const agregar = useCallback((item: ItemCarrito) => {
    setCarrito((actual) => {
      const existente = actual.find((i) => i.id === item.id);
      if (existente) {
        return actual.map((i) =>
          i.id === item.id ? { ...i, cantidad: i.cantidad + item.cantidad } : i,
        );
      }
      return [...actual, item];
    });
    setUltimoAgregado(item.id);
    setCarritoAbierto(true);
  }, []);

  const cambiarCantidad = useCallback((id: string, cantidad: number) => {
    setCarrito((actual) =>
      cantidad <= 0
        ? actual.filter((i) => i.id !== id)
        : actual.map((i) => (i.id === id ? { ...i, cantidad } : i)),
    );
  }, []);

  const quitar = useCallback((id: string) => {
    setCarrito((actual) => actual.filter((i) => i.id !== id));
  }, []);

  const vaciar = useCallback(() => {
    setCarrito([]);
    setCupon(null);
  }, []);

  const alternarFavorito = useCallback((slug: string) => {
    setFavoritos((actual) =>
      actual.includes(slug) ? actual.filter((s) => s !== slug) : [...actual, slug],
    );
  }, []);

  const subtotal = useMemo(
    () => carrito.reduce((t, i) => t + i.precio * i.cantidad, 0),
    [carrito],
  );

  const cantidadTotal = useMemo(
    () => carrito.reduce((t, i) => t + i.cantidad, 0),
    [carrito],
  );

  const descuento = useMemo(() => {
    if (!cupon) return 0;
    if (cupon.tipo === "descuento-porcentual") {
      return Math.round(subtotal * (cupon.valor / 100) * 100) / 100;
    }
    if (cupon.tipo === "descuento-fijo") return Math.min(cupon.valor, subtotal);
    return 0; // envío gratis se descuenta del envío, no del subtotal
  }, [cupon, subtotal]);

  const aplicarCupon = useCallback(
    async (codigo: string) => {
      const resultado = await validarCupon(codigo, subtotal);
      if (resultado.ok && resultado.cupon) setCupon(resultado.cupon);
      return { ok: resultado.ok, mensaje: resultado.mensaje };
    },
    [subtotal],
  );

  const valor = useMemo<Tienda>(
    () => ({
      hidratado,
      carrito,
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
      cantidadTotal,
      subtotal,
      puntosDelCarrito:
        subtotal < regla.compraMinima
          ? 0
          : Math.floor(subtotal / regla.montoPorPunto) *
            regla.puntosOtorgados *
            regla.multiplicador,
      favoritos,
      alternarFavorito,
      esFavorito: (slug: string) => favoritos.includes(slug),
      cupon,
      aplicarCupon,
      quitarCupon: () => setCupon(null),
      descuento,
      carritoAbierto,
      abrirCarrito: () => setCarritoAbierto(true),
      cerrarCarrito: () => setCarritoAbierto(false),
      buscadorAbierto,
      setBuscadorAbierto,
      sesion,
      iniciarSesion: (nombre, correo) =>
        setSesion({
          activa: true,
          nombre: nombre?.trim() ?? "",
          correo: correo?.trim() ?? "",
        }),
      cerrarSesion: () => setSesion(SESION_VACIA),
      ultimoAgregado,
    }),
    [
      hidratado,
      carrito,
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
      cantidadTotal,
      subtotal,
      favoritos,
      alternarFavorito,
      cupon,
      aplicarCupon,
      descuento,
      carritoAbierto,
      buscadorAbierto,
      sesion,
      ultimoAgregado,
      regla,
    ],
  );

  return <ContextoTienda.Provider value={valor}>{children}</ContextoTienda.Provider>;
}

export function useTienda(): Tienda {
  const contexto = useContext(ContextoTienda);
  if (!contexto) {
    throw new Error("useTienda debe usarse dentro de <ProveedorTienda>");
  }
  return contexto;
}
