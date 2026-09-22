import { type JSX, useMemo } from 'react'
import { SpecGrid, SpecCell } from '../components/Spec'
import { IndexGrid } from '../components/IndexGrid'
import { Ledger } from '../components/Ledger'
import { buildIndex } from '../lib/index-items'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { snippets } from '../data/snippets'
import { useLang } from '../i18n/useLang'


/**
 * La hoja. Cabecera en cajas, titular enorme, aire, y despues los bloques de contenido,
 * cada uno precedido por su propia caja de especificacion.
 *
 * El aire tras el titular es deliberado y grande: en la referencia el vacio es lo que
 * separa la portada de la ficha, y es lo unico que le da peso al titular sin subirle el
 * cuerpo. Rellenarlo lo desactivaria.
 */
export function Home(): JSX.Element {
  const { lang, t, tr } = useLang()
  // El indice se aplana ya traducido, asi que depende del idioma: se recalcula solo
  // cuando este cambia, no en cada render.
  const items = useMemo(() => buildIndex(projects, snippets, lang), [lang])
  const bioParagraphs = tr(profile.bio).trim().split(/\n{2,}/)
  const proyectos = items.filter((i) => i.kind === 'proyecto').length
  const notas = items.length - proyectos

  return (
    <>
      <SpecGrid>
        <SpecCell label={t('indice')}>
          {items.length} {t('piezas')} · {proyectos} {t('proyectos')} · {notas} {t('notas')}
        </SpecCell>
        <SpecCell label={t('periodo')}>2023 — 2026</SpecCell>
      </SpecGrid>

      <h2 className="mt-8 text-h1 text-ink" id="indice">
        {t('indice')}
      </h2>
      <p className="spec-tag mt-1 mb-6 text-ink-muted">
        01 — {String(items.length).padStart(2, '0')}
      </p>

      <IndexGrid items={items} />

      {/* Aqui NO va una caja de especificacion. Hubo una —"Perfil / como decido" y
          "Trayectoria / 4 puestos"— y se quito: no contenia ningun dato. La primera era un
          resumen vago de la seccion que viene justo debajo y la segunda contaba las filas de
          una tabla que esta al lado. Existia por simetria con la caja del indice.

          La del indice si se gana el sitio: "9 piezas · 5 proyectos · 4 notas" y el periodo
          te dicen el tamano y el alcance de lo que vas a mirar ANTES de mirarlo. Ese es el
          criterio — una caja entra si adelanta algo que el contenido no dice por si solo. */}
      <h2 className="mt-24 mb-6 text-h1 text-ink" id="perfil">
        {t('perfil')}
      </h2>

      <div className="border border-rule bg-rule">
        <div className="grid gap-px bg-rule lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <div className="flex flex-col gap-4 bg-bg px-5 py-5">
            {bioParagraphs.map((paragraph: string) => (
              <p key={paragraph.slice(0, 32)} className="max-w-prose text-body text-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="bg-bg px-5 py-5">
            <p className="spec-tag mb-2 text-ink-muted">{t('trayectoria')}</p>
            <Ledger />
          </div>
        </div>
      </div>
    </>
  )
}
