import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Next's dev server only trusts requests whose Origin/Referer hostname
   * matches "localhost" or the hostname it was started with. When the site
   * is opened through a LAN IP, a VS Code port-forward, or a tunnel domain,
   * that hostname differs and the dev server blocks HMR/asset requests —
   * the classic "blank screen" symptom. List any such origins here (bare
   * hostname only, no scheme/port) so they're trusted in development.
   */
  allowedDevOrigins: [
    // VS Code's forwarded-port preview domains
    "*.githubpreview.dev",
    "*.app.github.dev",
    // VS Code / Microsoft dev tunnels
    "*.devtunnels.ms",
    // Common local network hostnames
    "*.local",
  ],
};

export default nextConfig;
