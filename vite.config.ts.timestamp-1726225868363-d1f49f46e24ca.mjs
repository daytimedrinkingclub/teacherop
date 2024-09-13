// vite.config.ts
import { getDirname } from "file:///C:/Users/patil/OneDrive/Desktop/teacherop-next/node_modules/@adonisjs/core/build/src/helpers/main.js";
import inertia from "file:///C:/Users/patil/OneDrive/Desktop/teacherop-next/node_modules/@adonisjs/inertia/build/src/plugins/vite.js";
import adonisjs from "file:///C:/Users/patil/OneDrive/Desktop/teacherop-next/node_modules/@adonisjs/vite/build/src/client/main.js";
import react from "file:///C:/Users/patil/OneDrive/Desktop/teacherop-next/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///C:/Users/patil/OneDrive/Desktop/teacherop-next/node_modules/vite/dist/node/index.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/patil/OneDrive/Desktop/teacherop-next/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    inertia({ ssr: { enabled: true, entrypoint: "inertia/app/ssr.tsx" } }),
    react(),
    adonisjs({ entrypoints: ["inertia/app/app.tsx"], reload: ["resources/views/**/*.edge"] })
  ],
  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      "~/": `${getDirname(__vite_injected_original_import_meta_url)}/inertia/`,
      "@": `${getDirname(__vite_injected_original_import_meta_url)}/inertia/lib`
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxwYXRpbFxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXHRlYWNoZXJvcC1uZXh0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxwYXRpbFxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXHRlYWNoZXJvcC1uZXh0XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9wYXRpbC9PbmVEcml2ZS9EZXNrdG9wL3RlYWNoZXJvcC1uZXh0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZ2V0RGlybmFtZSB9IGZyb20gJ0BhZG9uaXNqcy9jb3JlL2hlbHBlcnMnXHJcbmltcG9ydCBpbmVydGlhIGZyb20gJ0BhZG9uaXNqcy9pbmVydGlhL2NsaWVudCdcclxuaW1wb3J0IGFkb25pc2pzIGZyb20gJ0BhZG9uaXNqcy92aXRlL2NsaWVudCdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICBpbmVydGlhKHsgc3NyOiB7IGVuYWJsZWQ6IHRydWUsIGVudHJ5cG9pbnQ6ICdpbmVydGlhL2FwcC9zc3IudHN4JyB9IH0pLFxyXG4gICAgcmVhY3QoKSxcclxuICAgIGFkb25pc2pzKHsgZW50cnlwb2ludHM6IFsnaW5lcnRpYS9hcHAvYXBwLnRzeCddLCByZWxvYWQ6IFsncmVzb3VyY2VzL3ZpZXdzLyoqLyouZWRnZSddIH0pLFxyXG4gIF0sXHJcblxyXG4gIC8qKlxyXG4gICAqIERlZmluZSBhbGlhc2VzIGZvciBpbXBvcnRpbmcgbW9kdWxlcyBmcm9tXHJcbiAgICogeW91ciBmcm9udGVuZCBjb2RlXHJcbiAgICovXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ34vJzogYCR7Z2V0RGlybmFtZShpbXBvcnQubWV0YS51cmwpfS9pbmVydGlhL2AsXHJcbiAgICAgICdAJzogYCR7Z2V0RGlybmFtZShpbXBvcnQubWV0YS51cmwpfS9pbmVydGlhL2xpYmAsXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1UsU0FBUyxrQkFBa0I7QUFDblcsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sY0FBYztBQUNyQixPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBb0I7QUFKa0wsSUFBTSwyQ0FBMkM7QUFNaFEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsUUFBUSxFQUFFLEtBQUssRUFBRSxTQUFTLE1BQU0sWUFBWSxzQkFBc0IsRUFBRSxDQUFDO0FBQUEsSUFDckUsTUFBTTtBQUFBLElBQ04sU0FBUyxFQUFFLGFBQWEsQ0FBQyxxQkFBcUIsR0FBRyxRQUFRLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztBQUFBLEVBQzFGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU1BLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLE1BQU0sR0FBRyxXQUFXLHdDQUFlLENBQUM7QUFBQSxNQUNwQyxLQUFLLEdBQUcsV0FBVyx3Q0FBZSxDQUFDO0FBQUEsSUFDckM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
