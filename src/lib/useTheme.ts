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

// El tema real ya lo escribio el script inline de index.html antes del primer paint.
// El default es 'dark' —no el del sistema— y esa decision vive en los dos sitios a la
// vez: si diverge de la del script inline de index.html, hay un parpadeo en el primer
// render, que es justo lo que ese script existe para evitar.
function readTheme(): Theme {
  const applied = document.documentElement.dataset.theme
  if (applied === 'dark' || applied === 'light') return applied

  return readStored() ?? 'dark'
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
