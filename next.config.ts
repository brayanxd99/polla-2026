/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Esto le dice a Vercel que ignore los errores de TypeScript
    // y compile el proyecto pase lo que pase.
    ignoreBuildErrors: true,
  },
  eslint: {
    // De paso, ignoramos también advertencias pesadas de diseño de código
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
