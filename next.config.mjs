/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Esto obliga a Vercel a ignorar cualquier error de tipos
    ignoreBuildErrors: true,
  }
};

export default nextConfig;