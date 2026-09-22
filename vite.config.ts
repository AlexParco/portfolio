import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // El sitio vive en la RAIZ del dominio. Ojo: esto tiene que coincidir con donde se
  // sirve de verdad. En GitHub Pages la raiz solo existe si el repo se llama
  // `alexparco.github.io` o si hay un dominio propio con su CNAME; en un repo de
  // proyecto normal la URL es `/<repo>/` y con `base: '/'` los assets apuntarian a
  // un sitio donde no estan.
  base: '/',
})
