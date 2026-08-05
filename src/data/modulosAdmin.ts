import {
  BarChart3,
  Boxes,
  Dog,
  FileText,
  Gift,
  HelpCircle,
  Images,
  KeyRound,
  LayoutDashboard,
  Layers,
  MessageSquareQuote,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Star,
  Ticket,
  Truck,
  Users,
} from "lucide-react";

/**
 * Módulos del CMS. Vive fuera del componente de navegación (que es cliente)
 * para poder importarse también desde componentes de servidor.
 */
export const MODULOS = [
  {
    grupo: "Operación",
    enlaces: [
      { href: "/admin", nombre: "Dashboard", icono: LayoutDashboard },
      { href: "/admin/pedidos", nombre: "Pedidos", icono: ShoppingCart },
      { href: "/admin/mayoreo", nombre: "Ventas por mayor", icono: Truck },
    ],
  },
  {
    grupo: "Catálogo",
    enlaces: [
      { href: "/admin/productos", nombre: "Productos", icono: Package },
      { href: "/admin/categorias", nombre: "Categorías", icono: Layers },
      { href: "/admin/presentaciones", nombre: "Presentaciones", icono: Boxes },
      { href: "/admin/inventario", nombre: "Inventario", icono: BarChart3 },
    ],
  },
  {
    grupo: "Clientes",
    enlaces: [
      { href: "/admin/clientes", nombre: "Clientes", icono: Users },
      { href: "/admin/mascotas", nombre: "Mascotas", icono: Dog },
      { href: "/admin/recompensas", nombre: "Programa de recompensas", icono: Gift },
      { href: "/admin/cupones", nombre: "Cupones", icono: Ticket },
    ],
  },
  {
    grupo: "Contenido",
    enlaces: [
      { href: "/admin/contenido", nombre: "Contenido de la web", icono: FileText },
      { href: "/admin/banners", nombre: "Banners", icono: Images },
      { href: "/admin/faq", nombre: "Preguntas frecuentes", icono: HelpCircle },
      { href: "/admin/testimonios", nombre: "Testimonios", icono: MessageSquareQuote },
    ],
  },
  {
    grupo: "Sistema",
    enlaces: [
      { href: "/admin/reportes", nombre: "Reportes", icono: Star },
      { href: "/admin/configuracion", nombre: "Configuración", icono: Settings },
      { href: "/admin/usuarios", nombre: "Usuarios administrativos", icono: ShieldCheck },
      { href: "/admin/roles", nombre: "Roles y permisos", icono: KeyRound },
    ],
  },
];
