import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { theme } from "./src/theme";
import { pigment } from "@pigment-css/vite-plugin";

const pigmentConfig = {
  theme,
  transformLibraries: ["@mui/material"],
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pigment(pigmentConfig)],
});
