import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // El sitio vive en la RAIZ de alexanderparco.com, servido por nginx en el VPS
  // (Dockerfile + deploy.yml). Si algun dia se sirviera bajo un subdirectorio, esto
  // tiene que cambiar a esa ruta o los assets apuntarian a donde no estan.
  base: '/',
})
