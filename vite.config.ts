import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "icon-192.png",
        "icon-512.png",
        "videos/dead-hang.mp4", // <-- Agrega tus videos aquí para asegurar el precaché
        "videos/pec-stretch.mp4",
        "videos/scapular-pulls.mp4",
        "videos/wall-angels.mp4",
        "videos/glute-bridge.mp4",
      ],
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,mp4}"], // <-- Agrega ,mp4 aquí al final
      },
      manifest: {
        name: "PosturaFit • Rutina Nocturna",
        short_name: "PosturaFit",
        description:
          "Guía nocturna de descompresión espinal y postura en barra",
        theme_color: "#0B111E",
        background_color: "#0B111E",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "/screenshot-mobile.png",
            sizes: "309x814",
            type: "image/png",
            form_factor: "narrow",
            label: "Vista móvil PosturaFit",
          },
          {
            src: "/screenshot-desktop.png",
            sizes: "978x1078",
            type: "image/png",
            form_factor: "wide",
            label: "Vista escritorio PosturaFit",
          },
        ],
      },
    }),
  ],
});
