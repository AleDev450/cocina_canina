import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Todas las fotos viven en /public por ahora. Cuando el catálogo pase a
    // Supabase Storage basta con añadir aquí el host del bucket.
    remotePatterns: [],
  },
};

export default nextConfig;
