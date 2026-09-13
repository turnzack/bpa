// vite.config.ts
import { defineConfig } from "file:///E:/v0reponses/v0-interface-versel/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.43/node_modules/vite/dist/node/index.js";
import react from "file:///E:/v0reponses/v0-interface-versel/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.21_@types+node@20.19.43_/node_modules/@vitejs/plugin-react/dist/index.js";
import { resolve } from "path";
import fs from "fs";
var __vite_injected_original_dirname = "e:\\v0reponses\\v0-interface-versel";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 3005,
    strictPort: true,
    watch: {
      ignored: [
        "**/v0-moteur-electron/**",
        "**\\\\v0-moteur-electron\\\\**",
        "**/v0saveprojets/**",
        "**\\\\v0saveprojets\\\\**",
        "**/v0-moteur-mobile/**",
        "**\\\\v0-moteur-mobile\\\\**"
      ]
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__vite_injected_original_dirname, "index.html"),
        adminDesign: resolve(__vite_injected_original_dirname, "admin-design.html")
      }
    }
  }
});
try {
  const badAppDir = "e:\\v0reponses\\v0-moteur-electron\\v0saveprojets\\Chat_Comms\\app";
  const goodSrcAppDir = "e:\\v0reponses\\v0-moteur-electron\\v0saveprojets\\Chat_Comms\\src\\app";
  const nextCacheDir = "e:\\v0reponses\\v0-moteur-electron\\v0saveprojets\\Chat_Comms\\.next";
  if (fs.existsSync(badAppDir)) {
    console.log("[AUTO-FIX] Dossier app/ d\xE9tect\xE9, fusion...");
    if (!fs.existsSync(goodSrcAppDir)) fs.mkdirSync(goodSrcAppDir, { recursive: true });
    fs.cpSync(badAppDir, goodSrcAppDir, { recursive: true });
    fs.rmSync(badAppDir, { recursive: true, force: true });
    console.log("[AUTO-FIX] Dossier app/ supprim\xE9.");
  }
  if (fs.existsSync(nextCacheDir)) {
    fs.rmSync(nextCacheDir, { recursive: true, force: true });
    console.log("[AUTO-FIX] Cache .next supprim\xE9 pour forcer le re-rendu Next.js !");
  }
} catch (e) {
  console.log("[AUTO-FIX] Erreur:", e);
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJlOlxcXFx2MHJlcG9uc2VzXFxcXHYwLWludGVyZmFjZS12ZXJzZWxcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcImU6XFxcXHYwcmVwb25zZXNcXFxcdjAtaW50ZXJmYWNlLXZlcnNlbFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vZTovdjByZXBvbnNlcy92MC1pbnRlcmZhY2UtdmVyc2VsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDA1LFxuICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgd2F0Y2g6IHtcbiAgICAgIGlnbm9yZWQ6IFtcbiAgICAgICAgJyoqL3YwLW1vdGV1ci1lbGVjdHJvbi8qKicsICcqKlxcXFxcXFxcdjAtbW90ZXVyLWVsZWN0cm9uXFxcXFxcXFwqKicsXG4gICAgICAgICcqKi92MHNhdmVwcm9qZXRzLyoqJywgJyoqXFxcXFxcXFx2MHNhdmVwcm9qZXRzXFxcXFxcXFwqKicsXG4gICAgICAgICcqKi92MC1tb3RldXItbW9iaWxlLyoqJywgJyoqXFxcXFxcXFx2MC1tb3RldXItbW9iaWxlXFxcXFxcXFwqKidcbiAgICAgIF1cbiAgICB9XG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgbWFpbjogcmVzb2x2ZShfX2Rpcm5hbWUsICdpbmRleC5odG1sJyksXG4gICAgICAgIGFkbWluRGVzaWduOiByZXNvbHZlKF9fZGlybmFtZSwgJ2FkbWluLWRlc2lnbi5odG1sJyksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KVxuXG4vLyA9PT0gU0NSSVBUIERFIENPUlJFQ1RJT04gQVVUT01BVElRVUUgUE9VUiBDSEFUX0NPTU1TID09PVxuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbnRyeSB7XG4gIGNvbnN0IGJhZEFwcERpciA9ICdlOlxcXFx2MHJlcG9uc2VzXFxcXHYwLW1vdGV1ci1lbGVjdHJvblxcXFx2MHNhdmVwcm9qZXRzXFxcXENoYXRfQ29tbXNcXFxcYXBwJ1xuICBjb25zdCBnb29kU3JjQXBwRGlyID0gJ2U6XFxcXHYwcmVwb25zZXNcXFxcdjAtbW90ZXVyLWVsZWN0cm9uXFxcXHYwc2F2ZXByb2pldHNcXFxcQ2hhdF9Db21tc1xcXFxzcmNcXFxcYXBwJ1xuICBjb25zdCBuZXh0Q2FjaGVEaXIgPSAnZTpcXFxcdjByZXBvbnNlc1xcXFx2MC1tb3RldXItZWxlY3Ryb25cXFxcdjBzYXZlcHJvamV0c1xcXFxDaGF0X0NvbW1zXFxcXC5uZXh0J1xuICBcbiAgaWYgKGZzLmV4aXN0c1N5bmMoYmFkQXBwRGlyKSkge1xuICAgIGNvbnNvbGUubG9nKCdbQVVUTy1GSVhdIERvc3NpZXIgYXBwLyBkXHUwMEU5dGVjdFx1MDBFOSwgZnVzaW9uLi4uJylcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMoZ29vZFNyY0FwcERpcikpIGZzLm1rZGlyU3luYyhnb29kU3JjQXBwRGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KVxuICAgIGZzLmNwU3luYyhiYWRBcHBEaXIsIGdvb2RTcmNBcHBEaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pXG4gICAgZnMucm1TeW5jKGJhZEFwcERpciwgeyByZWN1cnNpdmU6IHRydWUsIGZvcmNlOiB0cnVlIH0pXG4gICAgY29uc29sZS5sb2coJ1tBVVRPLUZJWF0gRG9zc2llciBhcHAvIHN1cHByaW1cdTAwRTkuJylcbiAgfVxuICBcbiAgaWYgKGZzLmV4aXN0c1N5bmMobmV4dENhY2hlRGlyKSkge1xuICAgIGZzLnJtU3luYyhuZXh0Q2FjaGVEaXIsIHsgcmVjdXJzaXZlOiB0cnVlLCBmb3JjZTogdHJ1ZSB9KVxuICAgIGNvbnNvbGUubG9nKCdbQVVUTy1GSVhdIENhY2hlIC5uZXh0IHN1cHByaW1cdTAwRTkgcG91ciBmb3JjZXIgbGUgcmUtcmVuZHUgTmV4dC5qcyAhJylcbiAgfVxufSBjYXRjaCAoZSkge1xuICBjb25zb2xlLmxvZygnW0FVVE8tRklYXSBFcnJldXI6JywgZSlcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlIsU0FBUyxvQkFBb0I7QUFDeFQsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQTJCeEIsT0FBTyxRQUFRO0FBN0JmLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixPQUFPO0FBQUEsTUFDTCxTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQTRCO0FBQUEsUUFDNUI7QUFBQSxRQUF1QjtBQUFBLFFBQ3ZCO0FBQUEsUUFBMEI7QUFBQSxNQUM1QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxNQUFNLFFBQVEsa0NBQVcsWUFBWTtBQUFBLFFBQ3JDLGFBQWEsUUFBUSxrQ0FBVyxtQkFBbUI7QUFBQSxNQUNyRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQztBQUtELElBQUk7QUFDRixRQUFNLFlBQVk7QUFDbEIsUUFBTSxnQkFBZ0I7QUFDdEIsUUFBTSxlQUFlO0FBRXJCLE1BQUksR0FBRyxXQUFXLFNBQVMsR0FBRztBQUM1QixZQUFRLElBQUksa0RBQTRDO0FBQ3hELFFBQUksQ0FBQyxHQUFHLFdBQVcsYUFBYSxFQUFHLElBQUcsVUFBVSxlQUFlLEVBQUUsV0FBVyxLQUFLLENBQUM7QUFDbEYsT0FBRyxPQUFPLFdBQVcsZUFBZSxFQUFFLFdBQVcsS0FBSyxDQUFDO0FBQ3ZELE9BQUcsT0FBTyxXQUFXLEVBQUUsV0FBVyxNQUFNLE9BQU8sS0FBSyxDQUFDO0FBQ3JELFlBQVEsSUFBSSxzQ0FBbUM7QUFBQSxFQUNqRDtBQUVBLE1BQUksR0FBRyxXQUFXLFlBQVksR0FBRztBQUMvQixPQUFHLE9BQU8sY0FBYyxFQUFFLFdBQVcsTUFBTSxPQUFPLEtBQUssQ0FBQztBQUN4RCxZQUFRLElBQUksc0VBQW1FO0FBQUEsRUFDakY7QUFDRixTQUFTLEdBQUc7QUFDVixVQUFRLElBQUksc0JBQXNCLENBQUM7QUFDckM7IiwKICAibmFtZXMiOiBbXQp9Cg==
