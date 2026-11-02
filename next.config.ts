import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Gamle adresser fra den første version
    return [
      { source: "/events", destination: "/arrangementer", permanent: true },
      { source: "/about", destination: "/om-klubben", permanent: true },
    ];
  },
};

export default nextConfig;
