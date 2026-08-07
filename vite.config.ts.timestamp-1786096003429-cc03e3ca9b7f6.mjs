// vite.config.ts
import { defineConfig } from "file:///C:/Users/Redwan/Desktop/FazeSoft/NeoScape/NeoScape-Frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Redwan/Desktop/FazeSoft/NeoScape/NeoScape-Frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\Redwan\\Desktop\\FazeSoft\\NeoScape\\NeoScape-Frontend";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    sourcemap: false,
    // Disable sourcemaps to eliminate warnings
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === "SOURCEMAP_ERROR" || warning.message.includes("sourcemap")) {
          return;
        }
        defaultHandler(warning);
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxSZWR3YW5cXFxcRGVza3RvcFxcXFxGYXplU29mdFxcXFxOZW9TY2FwZVxcXFxOZW9TY2FwZS1Gcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcUmVkd2FuXFxcXERlc2t0b3BcXFxcRmF6ZVNvZnRcXFxcTmVvU2NhcGVcXFxcTmVvU2NhcGUtRnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1JlZHdhbi9EZXNrdG9wL0ZhemVTb2Z0L05lb1NjYXBlL05lb1NjYXBlLUZyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIlxyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCJcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIHNvdXJjZW1hcDogZmFsc2UsIC8vIERpc2FibGUgc291cmNlbWFwcyB0byBlbGltaW5hdGUgd2FybmluZ3NcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb253YXJuKHdhcm5pbmcsIGRlZmF1bHRIYW5kbGVyKSB7XHJcbiAgICAgICAgaWYgKHdhcm5pbmcuY29kZSA9PT0gJ1NPVVJDRU1BUF9FUlJPUicgfHwgd2FybmluZy5tZXNzYWdlLmluY2x1ZGVzKFwic291cmNlbWFwXCIpKSB7XHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdEhhbmRsZXIod2FybmluZylcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpWCxTQUFTLG9CQUFvQjtBQUM5WSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBSXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUE7QUFBQSxJQUNYLGVBQWU7QUFBQSxNQUNiLE9BQU8sU0FBUyxnQkFBZ0I7QUFDOUIsWUFBSSxRQUFRLFNBQVMscUJBQXFCLFFBQVEsUUFBUSxTQUFTLFdBQVcsR0FBRztBQUMvRTtBQUFBLFFBQ0Y7QUFDQSx1QkFBZSxPQUFPO0FBQUEsTUFDeEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
