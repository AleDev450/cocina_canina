import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Renueva el token de sesión en cada navegación y protege las zonas privadas.
 *
 * · `/admin`  → solo usuarios dados de alta en la tabla `staff` y activos.
 * · `/cuenta` → cualquier usuario autenticado.
 */
export async function middleware(peticion: NextRequest) {
  let respuesta = NextResponse.next({ request: peticion });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Sin configuración no hay sesión que refrescar; dejamos pasar para que la
  // página muestre el aviso de "falta configurar Supabase".
  if (!url || !clave) return respuesta;

  const supabase = createServerClient(url, clave, {
    cookies: {
      getAll() {
        return peticion.cookies.getAll();
      },
      setAll(nuevas) {
        nuevas.forEach(({ name, value }) => peticion.cookies.set(name, value));
        respuesta = NextResponse.next({ request: peticion });
        nuevas.forEach(({ name, value, options }) =>
          respuesta.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ruta = peticion.nextUrl.pathname;

  if (ruta.startsWith("/admin") && ruta !== "/admin/ingresar") {
    if (!user) {
      const destino = peticion.nextUrl.clone();
      destino.pathname = "/admin/ingresar";
      destino.searchParams.set("siguiente", ruta);
      return NextResponse.redirect(destino);
    }

    const { data: miembro } = await supabase
      .from("staff")
      .select("activo")
      .eq("id", user.id)
      .maybeSingle();

    if (!miembro?.activo) {
      const destino = peticion.nextUrl.clone();
      destino.pathname = "/admin/ingresar";
      destino.searchParams.set("error", "sin-permiso");
      return NextResponse.redirect(destino);
    }
  }

  if (ruta.startsWith("/cuenta") && !user) {
    const destino = peticion.nextUrl.clone();
    destino.pathname = "/ingresar";
    destino.searchParams.set("siguiente", ruta);
    return NextResponse.redirect(destino);
  }

  return respuesta;
}

export const config = {
  matcher: [
    /*
     * Todo salvo estáticos e imágenes: el token debe renovarse en las páginas,
     * no en cada asset.
     */
    "/((?!_next/static|_next/image|favicon.ico|marca|productos|mascota|empaques|.*\\.(?:png|jpg|jpeg|svg|webp|avif|ico)$).*)",
  ],
};
