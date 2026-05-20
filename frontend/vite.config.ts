/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Esto hace que 'describe', 'it', 'expect' y 'vi' funcionen sin tener que importarlos
    environment: 'jsdom', // Simula un navegador de mentira para que React pueda renderizar
    setupFiles: './src/setupTests.ts', // Archivo que crearemos a continuación
  }
})