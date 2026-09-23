import { useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

// El almacenamiento puede estar bloqueado (modo privado, cookies de terceros).
// Una excepcion aqui reventaria el render, asi que se degrada en silencio.
function readStored(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'dark' || stored === 'light' ? stored : null
  } catch {
    return null
  }
}

function persist(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Sin persistencia: el tema dura lo que dure la pagina.
  }
}

function systemTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// El tema real ya lo escribio el script inline de index.html antes del primer paint.
// Sin eleccion guardada manda el sistema: esa regla vive en los dos sitios y tienen que
// coincidir, o hay parpadeo en el primer render.
function readTheme(): Theme {
  const applied = document.documentElement.dataset.theme
  if (applied === 'dark' || applied === 'light') return applied

  return readStored() ?? systemTheme()
}

export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>(readTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      persist(next)
      return next
    })
  }, [])

  return { theme, toggle }
}
