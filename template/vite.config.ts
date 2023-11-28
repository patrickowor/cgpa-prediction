// @ts-nocheck

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [react(),tailwindcss()],
  resolve : {
    alias : {
      "@assets": path.resolve(__dirname, "./src/assets")
    }
  }
})
