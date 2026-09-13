// vite.config.ts
import { defineConfig } from "file:///E:/v0reponses/v0-interface-versel/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.43/node_modules/vite/dist/node/index.js";
import react from "file:///E:/v0reponses/v0-interface-versel/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.21_@types+node@20.19.43_/node_modules/@vitejs/plugin-react/dist/index.js";
import { resolve } from "path";
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
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJlOlxcXFx2MHJlcG9uc2VzXFxcXHYwLWludGVyZmFjZS12ZXJzZWxcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcImU6XFxcXHYwcmVwb25zZXNcXFxcdjAtaW50ZXJmYWNlLXZlcnNlbFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vZTovdjByZXBvbnNlcy92MC1pbnRlcmZhY2UtdmVyc2VsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDA1LFxuICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgd2F0Y2g6IHtcbiAgICAgIGlnbm9yZWQ6IFtcbiAgICAgICAgJyoqL3YwLW1vdGV1ci1lbGVjdHJvbi8qKicsICcqKlxcXFxcXFxcdjAtbW90ZXVyLWVsZWN0cm9uXFxcXFxcXFwqKicsXG4gICAgICAgICcqKi92MHNhdmVwcm9qZXRzLyoqJywgJyoqXFxcXFxcXFx2MHNhdmVwcm9qZXRzXFxcXFxcXFwqKicsXG4gICAgICAgICcqKi92MC1tb3RldXItbW9iaWxlLyoqJywgJyoqXFxcXFxcXFx2MC1tb3RldXItbW9iaWxlXFxcXFxcXFwqKidcbiAgICAgIF1cbiAgICB9XG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgbWFpbjogcmVzb2x2ZShfX2Rpcm5hbWUsICdpbmRleC5odG1sJyksXG4gICAgICAgIGFkbWluRGVzaWduOiByZXNvbHZlKF9fZGlybmFtZSwgJ2FkbWluLWRlc2lnbi5odG1sJyksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyUixTQUFTLG9CQUFvQjtBQUN4VCxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBRnhCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixPQUFPO0FBQUEsTUFDTCxTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQTRCO0FBQUEsUUFDNUI7QUFBQSxRQUF1QjtBQUFBLFFBQ3ZCO0FBQUEsUUFBMEI7QUFBQSxNQUM1QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxNQUFNLFFBQVEsa0NBQVcsWUFBWTtBQUFBLFFBQ3JDLGFBQWEsUUFBUSxrQ0FBVyxtQkFBbUI7QUFBQSxNQUNyRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
