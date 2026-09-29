import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: let other devices on the local network (e.g. testing from a PC or phone
  // via http://<laptop-ip>:3001) load the dev server's assets. Next blocks
  // non-localhost origins by default, which leaves the page un-hydrated there.
  // Update the IP if your laptop's address changes (`ipconfig getifaddr en0`).
  allowedDevOrigins: ["10.64.4.98"],
};

export default nextConfig;
