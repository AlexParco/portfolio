/**
 * Pez dorado dibujado a mano en SVG.
 *
 * Se abandona el 3D despues de doce construcciones procedurales. El motivo: el encanto de
 * un personaje cartoon sale de decisiones artisticas —como rompe el carrillo, como se ahueca
 * la aleta— y componer primitivas no llega ahi por bien medidas que esten las proporciones.
 * En 2D esas decisiones se dibujan directamente con trazados, y ademas desaparecen los dos
 * problemas que mas peleamos: no hay luz que calibrar ni silueta que aguante desde todos los
 * angulos, porque solo existe uno.
 *
 * Las PROPORCIONES si vienen de la medicion sobre la hoja de referencia, que fue lo unico
 * que salio bien de la fase 3D:
 *   cuerpo largo/alto 1.97 · dorsal +0.47 del alto · ventral -0.35 · ojo a 0.16 del morro
 *
 * Mira a la DERECHA. Para que nade a la izquierda se voltea con scaleX(-1) desde fuera.
 */
export function FishSvg({
  className = "",
  style,
}: {
  className?: string
  style?: React.CSSProperties
}): React.JSX.Element {
  return (
    <svg viewBox="0 0 200 132" className={className} style={style} aria-hidden="true">
      <defs>
        {/* El volumen lo dan los degradados, no la luz: un radial descentrado hacia arriba
            a la izquierda hace de foco, y el borde oscuro hace de sombra propia. */}
        <radialGradient id="pez-cuerpo" cx="0.62" cy="0.3" r="0.85">
          <stop offset="0%" stopColor="#ffe680" />
          <stop offset="45%" stopColor="#ffcf2e" />
          <stop offset="100%" stopColor="#e08a06" />
        </radialGradient>
        <linearGradient id="pez-aleta" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fba33f" />
          <stop offset="100%" stopColor="#e8571c" />
        </linearGradient>
        <linearGradient id="pez-aleta-tras" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8801f" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
      </defs>

      {/* Aletas de detras primero: el orden de pintado ES la profundidad. */}
      <g className="pez-cola">
        <path
          d="M52,66 C38,50 20,34 6,28 C12,46 20,58 27,66 C20,74 12,86 6,104 C20,98 38,82 52,66 Z"
          fill="url(#pez-aleta-tras)"
        />
      </g>

      <g className="pez-dorsal">
        <path
          d="M124,34 C116,8 94,-4 66,8 C56,22 50,42 47,60 C70,40 98,32 124,34 Z"
          fill="url(#pez-aleta)"
        />
      </g>

      <g className="pez-pect-lejos">
        <path
          d="M104,92 C98,106 88,116 74,120 C78,106 86,96 96,89 Z"
          fill="url(#pez-aleta-tras)"
        />
      </g>

      {/* El cuerpo: largo/alto 1.97, con el vientre mas hondo que el lomo alto. */}
      <path
        d="M176,62 C174,42 158,28 128,26 C98,24 68,34 48,56 C46,58 45,60 45,62
           C45,64 46,66 48,68 C68,92 98,104 128,100 C158,96 174,82 176,62 Z"
        fill="url(#pez-cuerpo)"
      />

      {/* Agalla: un arco fino que separa la cabeza del cuerpo. Detalle pequeno y es lo que
          hace que la cabeza se lea como cabeza y no como el extremo de un huevo. */}
      <path
        d="M138,32 C130,46 130,74 140,94"
        fill="none"
        stroke="#d68a12"
        strokeOpacity="0.55"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <g className="pez-pect">
        <path
          d="M126,88 C122,104 110,118 92,124 C96,108 106,95 118,86 Z"
          fill="url(#pez-aleta)"
        />
      </g>

      {/* Boca: una hendidura corta en el morro, no un agujero. */}
      <path
        d="M170,76 C165,79 160,79 156,77"
        fill="none"
        stroke="#c2740a"
        strokeOpacity="0.75"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Ojo: centro a 0.16 del largo desde el morro, como se midio. */}
      <g>
        <circle cx="150" cy="52" r="16" fill="#fffdf8" />
        <circle cx="154" cy="53" r="10" fill="#17120d" />
        <circle cx="158" cy="48" r="3.4" fill="#ffffff" />
      </g>
    </svg>
  )
}
