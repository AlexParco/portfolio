import { useLang } from '../i18n/useLang'

/**
 * La silueta de un post mientras llega su codigo: volver, metadato, titular, entradilla y
 * unas lineas de cuerpo. Mismas medidas que `ArticleHead`, para que al llegar el contenido
 * no salte nada.
 *
 * No aparece de golpe: `.skeleton` entra con 150 ms de retraso. Con la precarga de App.tsx
 * lo normal es que el contenido llegue antes y el skeleton no se llegue a ver nunca; solo
 * se muestra cuando la espera es real (red lenta, clic antes de que acabe la precarga).
 */
export function PageSkeleton(): React.JSX.Element {
  const { t } = useLang()
  const bar = 'skeleton-bar rounded-md'

  return (
    <div data-skeleton aria-busy="true" className="skeleton min-h-[70vh]">
      <span className="sr-only">{t('cargando')}</span>
      <div aria-hidden="true">
        <div className={`${bar} h-5 w-20`} />
        <div className={`${bar} mt-10 h-3.5 w-44`} />
        <div className={`${bar} mt-4 h-9 w-3/4`} />
        <div className={`${bar} mt-5 h-4.5 w-full`} />
        <div className={`${bar} mt-2.5 h-4.5 w-2/3`} />
        <div className="mt-6 flex gap-1.5">
          <div className={`${bar} h-5 w-20`} />
          <div className={`${bar} h-5 w-16`} />
          <div className={`${bar} h-5 w-14`} />
        </div>
        <div className={`${bar} mt-12 h-40 w-full rounded-xl`} />
        <div className="mt-12 flex flex-col gap-3">
          <div className={`${bar} h-4 w-full`} />
          <div className={`${bar} h-4 w-11/12`} />
          <div className={`${bar} h-4 w-full`} />
          <div className={`${bar} h-4 w-4/5`} />
        </div>
      </div>
    </div>
  )
}
