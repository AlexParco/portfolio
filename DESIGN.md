# SPEC DE DISEÑO DEFINITIVO — Portfolio Alexander Parco Flores

**Versión 6.6 · fuente única de verdad · "Hoja de especificación"**

---

## 0. La v6.6 SUSTITUYE al sistema visual Y ESTRUCTURAL de este documento (agosto 2026)

Las secciones **2 (tokens)** y **3 (tipografía)** de abajo están **derogadas**. La tesis de
§1, la retícula de §4, la anatomía de §5, los estados de §6 y la accesibilidad de §8 siguen
vigentes.

### Para quién está diseñado

Para alguien que revisa treinta perfiles en una tarde. **Barre, no lee.** Decide en unos
segundos si sigue. Todo lo de abajo sale de ahí, y cuando una preferencia estética ha
chocado con esa persona, ha ganado esa persona.

### Lo que es ahora

| | v1 | v2.1 |
|---|---|---|
| Familias | Geist + JetBrains Mono, repartidas por "quién escribió el dato" | Geist + JetBrains Mono, repartidas por **qué se hace con el texto** |
| Paleta | inventada (gris azulado + ocre) | **derivada de un paisaje pintado** (ver abajo) |
| Fondo | `oklch(.18 .008 262)` gris azulado | oscuro: **`#040806`, casi negro**; claro: `#F2ECDC` crema |
| Acento | ocre `#98511F` | **ninguno.** `--color-accent` == `--color-ink` |
| Atmósfera | ninguna | **dos veladuras + grano fino**, en `body::before/::after` |
| Etiqueta de canaleta | 11px UPPERCASE a la izquierda | **13px mono, caja de frase, alineada a la DERECHA** |
| Canaleta / contenedor | 7.5rem / 880px | **11rem / 1040px** |
| Separación de secciones | `border-top` + 40/56px | **sin regla**, 36/48px de aire |
| Hero | nombre + rol + redes | nombre + rol + **titular** + **CV en PDF** + enlaces |
| Orden de proyectos | herramientas OSS primero | **producción primero**, herramientas después |
| Tema por defecto | el del sistema | **oscuro** |
| Nav | 6 anclas | **3 anclas**: perfil · proyectos · notas |
| Escala | h1 32→52px | **h1 40→84px**; el lead BAJA a 16→18px |

### Una hoja de especificación

La v5 partía la pantalla en dos paneles con la identidad fija a la izquierda. La referencia
actual es una **ficha técnica de producto**: una sola columna que se lee de arriba abajo, con
cajas de borde visible, rótulos diminutos en versalita y el contenido en rejilla de celdas.
Un panel lateral pegado la convertía en otra cosa.

| | v5 | v6 |
|---|---|---|
| Disposición | dos paneles, rail fijo | **una columna**, cabecera + cuerpo + pie |
| Separadores | filete bajo el rótulo | **cajas con borde**, rejilla de 1px |
| Rótulos | mono 12px caja de frase | **versalita 10px, tracking `.12em`** (`.spec-tag`) |
| El índice | tabla de filas | **rejilla de 9 celdas numeradas** |
| Titular | frase larga a 15–17px | **corto, a cuerpo de display, peso 600** |

**El borde de 1px no se pinta con `border` en cada celda** — eso da líneas dobles donde dos
celdas se tocan. Se pinta con `gap: 1px` sobre un fondo del color del filete: los huecos de
la rejilla *son* las líneas. Una sola línea entre celdas, siempre, sin importar cuántas haya
ni cómo envuelvan.

**El índice pasa de tabla a rejilla, y no es solo aspecto:** en una tabla las nueve piezas se
leen como una cola —una detrás de otra, y la primera parece la más importante—. En rejilla se
leen como un conjunto, que es lo que son. El número sigue dando el orden a quien lo quiera
seguir. Cada celda entera es el enlace: no hay links anidados y el área de pulsación es la
celda completa.

**El titular tuvo que partirse en dos.** A cuerpo de display, la frase de 158 caracteres
ocupaba **siete líneas** y dejaba de funcionar como titular: se leía como un párrafo grande.
Ahora `profile.headline` es corto (lo que construye, dos o tres líneas) y `profile.lead`
lleva el contexto que no cabe arriba. El peso sube a 600: a 500 la frase no sostiene el
tamaño.

El vacío tras el titular es deliberado y grande — en la referencia es lo que separa la
portada de la ficha, y es lo único que da peso al titular sin subirle el cuerpo. El mapa de
puntos lo **sella** sin llenarlo: pequeño y a la derecha, como el cuño de una lámina técnica.

Desaparece `Rail`; entran `SheetHead`, `SheetFoot`, `Spec` (`SpecGrid` / `SpecCell`) e
`IndexGrid`. `Block` y `DecisionRecord` pasan a `.spec-tag` para que el detalle hable el
mismo idioma que la portada.

### Dos paneles, no un documento (v5, derogado)

La v4 movió el rótulo del margen a la cabecera del bloque, pero seguía siendo **lo mismo por
debajo**: cabecera arriba, bloques apilados, un scroll de arriba abajo. Un repintado con
otra retícula.

A partir de 1024px la página deja de ser un documento que se recorre:

```
┌───────────────┬──────────────────────────────────────┐
│ Alexander     │  Índice                     9 piezas │
│ Parco Flores  │  ──────────────────────────────────  │
│               │  01  API Tracking Perú  proyecto …   │
│ full-stack    │  02  Shalom API Perú    proyecto …   │  ← se desplaza
│ Lima, Perú    │  …                                   │
│               │                                      │
│ titular…      │  Perfil                              │
│ CV ↓          │  ──────────────────────────────────  │
│ github ↗      │  bio          │ Trayectoria          │
│               │                                      │
│ índice        │                                      │
│ perfil        │                                      │
│ © 2026 [tema] │                                      │
└───────────────┴──────────────────────────────────────┘
   fijo (sticky)          en movimiento
```

**La identidad no se desplaza nunca.** El rail vive en el shell (`App.tsx`), no en el Home,
así que al abrir un proyecto **solo cambia el panel derecho**: no hay que volver atrás para
encontrar el correo, y la navegación se siente instantánea porque la mitad de la pantalla no
se repinta.

Detalles que no son opcionales:

- **`items-start` en la retícula del shell.** Sin él la columna del rail se estira a la
  altura de la fila y `position: sticky` se queda sin margen donde pegarse: deja de pegarse,
  en silencio.
- **`h-screen` + `overflow-y-auto` en el rail.** En pantallas bajas se desplaza el panel, no
  la página.
- **El nombre del rail NO reusa `--text-h1`.** El `h1` llega a 68px, correcto en el panel
  derecho y desbordado en una columna de 21rem —«Alexander» mide 340px a ese cuerpo—. Tiene
  su propio token `--text-name`, con el techo calculado para que la palabra más larga quepa.

Desaparecen `Nav`, `Footer`, `Masthead` y el contenedor global `.page`: el ancho lo fija el
shell, porque los dos paneles miden distinto.

### El índice es la página (v4, sigue vigente)

Las versiones 2.x cambiaron paleta, tipografía y densidad, pero **todas conservaban el mismo
esqueleto**: retícula `etiqueta | contenido` repetida en cada sección, secciones apiladas en
el mismo orden, y el trabajo en cuarta posición. Eran repintados. Esta versión cambia el
esqueleto.

| | 2.x | 4.0 |
|---|---|---|
| Retícula | `etiqueta \| contenido` en **cada** sección, canaleta lateral de 11rem | **sin canaleta.** Rótulo arriba a todo lo ancho + filete; el contenido usa el ancho completo |
| Orden | hero → perfil → exp → edu → proyectos → notas | **cabecera → índice → perfil** |
| El trabajo | dos listas (proyectos, notas) en posición 4 y 5 | **un índice único, lo primero** |
| Exp / Edu | dos secciones con resumen y viñetas | **una ficha al margen** del perfil |
| Secciones | 5 | **2** |

**Por qué.** La canaleta lateral hacía que el contenido nunca usara más de la mitad del
ancho: la página entera se leía como una columna estrecha con anotaciones al margen. Y el
orden era el de un currículum, no el de un portfolio — quien entra viene a ver el trabajo, y
el trabajo estaba debajo de una biografía y un historial laboral.

**El índice ES la página.** Proyectos y notas se aplanan al mismo tipo (`IndexItem`) y se
pintan en una sola tabla numerada: `nº · título · tipo · tema · año`. En el índice son lo
mismo —cosas que escribió— y separarlos obligaba a leer dos tablas con las mismas columnas.
El orden es explícito, no cronológico: primero producción, luego herramientas, luego notas.

*Precio:* el historial laboral pierde las viñetas de logros, que ahora solo están en el CV.
Es la contrapartida aceptada a que el trabajo propio abra la página.

**Detalle de implementación:** el índice se pinta como tabla pero se marca como `<ul>`. Hacer
clicable una `<tr>` obliga a `position: relative` sobre ella, que es donde los navegadores
divergen; con `<li>` el stretched-link funciona igual en todos. Cada celda que no es el
título lleva su etiqueta en `sr-only`: en pantalla la columna se explica por posición, pero
en un lector no hay columnas y «proyecto 2025» suelto no dice de qué es.

Componentes retirados por quedar huérfanos: `Section`, `Hero`, `ProjectRow`, `SnippetRow`,
`MetaList`, `ExperienceList`, `EducationList`, `StackList`. Los tokens `--gutter-*` y las
clases `.grid-spec` / `.spec-label` salen del CSS.

### El perfil habla de la persona, no de los empleos

La bio tuvo cuatro párrafos y los cuatro hablaban de **trabajos**: dónde estuvo, con qué
stack, qué construyó. Eso ya está en la ficha de trayectoria y en el CV — repetirlo en prosa
no añadía nada sobre quién es.

La versión actual dice **cómo decide**, y cada afirmación se apoya en algo verificable que
está en este mismo sitio: las tres herramientas que escribió para sí mismo, la elección de
texto plano sobre base de datos en `mnemo`, el formato de registro de decisión de cada ficha.

**Regla: nada de biografía inventada.** Si una frase del perfil no se puede sostener con un
repo o con una decisión documentada, no se escribe. Lo que solo sabe él —por qué empezó, qué
le gusta fuera del código— lo tiene que poner él; no se rellena con plausibilidades.

### La única animación del sitio: el campo de celdas

Una rejilla de 12×12 en la mitad derecha del hero. Las celdas encendidas **se funden entre
sí**: cuando dos contiguas están activas, la unión se resuelve en un filete cóncavo, como una
gota. El patrón muta cada 2,2 s.

**La fusión no se dibuja, se filtra.** `feGaussianBlur` difumina las celdas hasta que las
vecinas se solapan y `feColorMatrix` sube brutalmente el contraste del canal **alfa**, lo que
vuelve a endurecer el borde: donde dos manchas difuminadas se solapaban queda un filete,
donde no, el borde original. Es la única forma de conseguirlo sin resolver metaballs a mano.

Consecuencias que hay que respetar:

- **Las celdas se dibujan sin separación.** El filete nace de que los cuadrados se toquen; si
  se separan, no hay nada que fusionar.
- **El par (desenfoque, contraste) está ajustado contra el radio de la celda.** Con
  `stdDeviation` corto, las esquinas redondeadas de dos celdas contiguas no llegan a
  puentearse y el tramo sale **festoneado** en vez de continuo. Valores actuales: blur 9,
  alfa ×26 −13, radio 22 %.
- **El patrón son TRAZOS de 2–5 celdas, no celdas sueltas.** Un ruido de celdas
  independientes se ve como estática y casi nunca produce vecinas, que es justo lo que la
  fusión necesita para notarse.
- **PRNG con semilla**, no `Math.random`: el mismo patrón en cada visita y nada de aleatorio
  durante el render.
- Anima con `setInterval` + transiciones CSS, **no** `requestAnimationFrame`. Respeta
  `prefers-reduced-motion` (un patrón fijo, sin intervalo) y va `aria-hidden`.

**Trampa de layout:** la columna del campo mide `26rem` FIJO, no `auto`. Con `auto` la pista
se dimensiona por su contenido, y el contenido es `w-full`, que se resuelve contra la propia
pista: la referencia es circular y **la columna colapsa a cero** — la animación desaparece sin
error ninguno.

### Monocromo: una sola tinta

La referencia es un **programa impreso a una tinta**. No hay un solo tono de color en la
página: `--color-accent` es literalmente `--color-ink`. El énfasis lo dan el **brillo**
(papel contra gris), el **tamaño** y el **filete**.

Consecuencias que NO son opcionales:

- **Todos los enlaces llevan subrayado permanente.** Si el color no distingue, el subrayado
  es la única señal que queda, y no puede aparecer solo en `:hover`.
- **El gesto firmado cambia de brillo, no de tono**: la etiqueta de la sección activa pasa de
  gris a papel.
- El token `--color-accent` se conserva en vez de borrarlo de cuarenta sitios, para que
  reintroducir una tinta sea cambiar **una línea**.

La temperatura sigue viniendo del paisaje —oscuros fríos, luces cálidas—, y es lo que evita
que el monocromo se lea como gris de sistema.

**El fondo oscuro es `#070707`: casi negro y NEUTRO.** Una versión anterior tenía el fondo
en `hue 168` y el gris atenuado en `hue 150` con croma 0.009–0.012 — sobre el papel «un
matiz que apenas se nombra», en pantalla **se leía verdoso**. Dos motivos: en superficies
grandes un croma de 0.01 sí se nota, y el texto atenuado está por todas partes.

**Regla: el matiz vive en el texto, nunca en el fondo.** Toda la estructura va a croma 0
—fondo, superficie, filete, estado de fila—; el único calor está en la tinta (crema,
`hue 92`) y en su versión atenuada. Escala medida en el navegador:

| token | hex | contra el fondo |
|---|---|---|
| `bg` | `#070707` | — |
| `surface` | `#101010` | superficie de código |
| `bg-hover` | `#171717` | estado de celda |
| `rule` | `#2C2C2C` | 1,44:1 (decorativo) |
| `ink-muted` | `#8D8B87` | **5,92:1** AA |
| `ink` | `#E8E4D9` | **15,86:1** AAA |

Para comprobar que no queda verde no vale mirarlo: se mide `g − (r+b)/2` sobre el color que
resuelve el navegador. Estructura, **0,0**. La tinta da 3,5 pero con `r > g > b`, que es
crema cálido — el verde exigiría `g > r`.

Al bajar el fondo, la veladura de atmósfera pesa relativamente más sobre él, así que baja a
3,5 % / 3 % y el grano a 2,5 %. Peor caso medido con la veladura encima: muted a **5,71:1**.

### Densidad: capítulos y bloques de metadatos

Las secciones van **numeradas** (`01 Perfil.`, `02 Exp.`) porque en la referencia el número
ordena, no grita: dice cuántas secciones hay y en cuál estás sin contarlas.

Cada entrada de proyecto es una **entrada de programa en dos columnas**: a la izquierda lo
que se lee (título, resumen, coste), a la derecha un `<MetaList>` de pares etiqueta/valor
(`stack`, `repo`, `demo`, `fecha`). Antes eso estaba repartido en tres esquinas de la fila —
tags arriba a la derecha, enlaces abajo a la izquierda, fecha abajo a la derecha—; **un solo
bloque se lee de un barrido, tres esquinas obligan a tres.** Las filas sin valor no se
renderizan: un `demo` vacío no deja etiqueta huérfana.

### Trampa: `opacity` sobre texto ya atenuado

Al hacerlo denso se usó `opacity-70` en las etiquetas de metadato y `opacity-60` en el
numeral. Parece un matiz y **es una pérdida de contraste**: sobre un gris que ya está a
6:1, un 70 % lo deja en **3,57:1**, y el numeral cayó a **2,94:1** — los dos suspenden AA a
11–12 px. Se corrigió separando etiqueta y valor por **brillo** (`ink-muted` contra `ink`),
que distingue igual y no cuesta legibilidad.

**Regla: nunca `opacity` sobre texto.** Si hace falta atenuar, se usa un token de color, que
es medible. Medido en el navegador: todo el texto de la página está en 6,01:1 o 15,13:1.

### Qué se publica de un empleador, y qué no

**Regla dura.** De una empresa donde trabajaste se publica: **nombre, cargo, fechas, dominio
del producto y tecnología**. No se publica **ninguna cifra suya** —clientes, facturación,
número de servicios, tamaño de plantilla— ni nada que describa **una debilidad de sus
sistemas**.

Dónde trabajaste es historial tuyo y omitirlo parece evasivo. Cuántos clientes de pago
tenían es información comercial de ellos, y nadie te autorizó a difundirla.

Lo que se quitó y por qué:

| Se decía | Problema | Ahora |
|---|---|---|
| «+7,000 empresas activas» | métrica **comercial** del empleador | «entorno multi-tenant en producción» |
| «22 microservicios… equipo de 3» | **arquitectura y plantilla** internas | «arquitectura de microservicios, con ownership sobre diseño, despliegue y estabilidad» |
| «…más de 10,000 facturas al mes» | volumen de negocio de un cliente | «un servicio crítico y de alto volumen» |
| «mejorando rendimiento y **seguridad**» | dice que su sistema de facturación corría una versión de Java insegura: **señala una vulnerabilidad** de un antiguo empleador | «migración a una versión mayor de Java… coordinando la puesta en producción» |

**El panel de cifras se reconstruyó entero con trabajo propio** (`3 años`, `2 APIs propias`,
`5 couriers`, `1,574 agencias`), todas verificables en sitios públicos suyos. La regla para
`profile.metrics`: *una cifra entra si describe algo que TÚ construiste u operas, no algo que
tu empleador tenía mientras estabas ahí.* En `projects.ts` no aplica: son proyectos propios y
ahí las cifras van con detalle.

Ojo con los **fragmentos**: el de NestJS repetía «22 microservicios para un equipo de tres»
en el cuerpo del markdown. Al revisar esta regla hay que hacer `grep`, no solo mirar
`experience.ts`.

### El nav tiene tres anclas, y `exp` / `edu` no son dos de ellas

**Dónde trabajaste y dónde estudiaste describen quién eres: son el perfil, no destinos
aparte.** Como anclas sueltas inflaban el nav de 3 entradas a 5 sin añadir ningún sitio nuevo
al que ir. Siguen siendo secciones con su etiqueta en la canaleta —ahí sí son estructura del
documento—, pero al leerlas se enciende `perfil`.

Lo resuelve `Anchor.covers` en `Nav.tsx`: cada ancla declara qué secciones representa, el
observer vigila **todas** (`anchors.flatMap(a => a.covers)`) y la comparación es
`covers.includes(spy)` en vez de `spy === id`. Si se observaran solo las tres del nav, al
entrar en `exp` no se encendería ninguna.

### El diseño lo hace el contraste de escala, no los adornos

Una página sin decoración necesita **una** fuente de jerarquía, y aquí es el salto de tamaño:
`h1` de 40→84px contra un cuerpo de 15px, ~5× en pantalla grande. Por eso el **titular BAJÓ**
a 16→18px: subir titular y nombre a la vez aplana la página y anula el efecto.

Lo que se quitó por la misma lógica: la barra decorativa del hero (`mark-bar`), que ya vive
en el logotipo del nav y sobraba en la única zona que gana quitando cosas.

Detalle tipográfico: el punto de las etiquetas (`Perfil.`, `Proyectos.`) lo pone
`.spec-label::after`, no el dato. Así ninguna etiqueta puede olvidarlo y el texto real de la
sección sigue siendo `Perfil`.

Las filas de experiencia y formación van en **tres columnas alineadas** (empresa · cargo ·
fechas) en ≥768px. Alineadas y no en una frase porque así las entradas se leen en vertical,
columna a columna: primero dónde, luego qué, luego cuándo.

### Sin sección de stack

Se eliminó `Stack` (sección, ancla, `StackList` y el export `stack`). Una lista de
tecnologías es una **afirmación**; los tags de proyectos reales y las descripciones de
experiencia son **evidencia**, y ya cubren la misma información. El nav baja a 5 anclas.

### La paleta viene de un cuadro, y lo que se toma no es el color

La referencia es un paisaje pintado: cielo verde-azulado en sombra, luz cálida de atardecer
sobre las nubes, campo salvia, neblina. **Lo que se toma de ahí no es "verde": es el
contraste de temperatura.** Los oscuros son fríos (verde-azulados) y las luces son cálidas
(crema y oro). Esa sola relación es lo que hace que algo se lea como atmósfera en vez de
como una interfaz oscura — y pasar los oscuros a gris neutro rompe el efecto entero aunque
los acentos no cambien.

**El tema base es el CLARO**, y no es una preferencia: la referencia es una escena de día.
Una versión oscura acierta la paleta y falla el ánimo. El oscuro existe, es fiel a las
sombras del mismo cuadro, y se elige.

**La atmósfera son dos veladuras y grano**, en `body::before` / `::after`, fijos y con
`z-index: -1`: luz cálida entrando por arriba a la derecha, bruma fría por la izquierda, y
un `feTurbulence` inline (~250 B) al 3 %. *Las opacidades están calculadas, no elegidas a
ojo:* la veladura cálida sube la luminancia del fondo y hunde el contraste del texto muted
que cae encima. **A 9 % el muted baja a 3,8:1 y suspende AA; a 5 % se queda en 5,5:1.** Quien
suba ese número tiene que rehacer la cuenta.

> **El cuadro NO se incrusta.** Es obra de alguien y publicarla sería redistribuirla sin
> licencia. Del cuadro sale la paleta y la calidad de luz, nada más.

### Las cuatro decisiones, con su precio

**1. El reparto de familias es funcional, no semántico.** La regla vieja ("mono si es
catalogable, sans si lo escribió un humano") obligaba a decidir en cada elemento y se
decidía mal. La nueva es de una sola pregunta: **¿esto se lee o se escanea?** Sans para lo
que se lee (titulares, prosa, títulos de fila); mono para lo que se escanea (etiquetas,
cifras, fechas, tags, código). *Precio:* dos familias que cargar (~46 kB extra en woff2).

> **Nota de una reversión.** Entre medias el sitio estuvo **100% en mono**, y quedaba bien
> en captura. Era un error: un párrafo largo en monoespaciado le cuesta a quien barre el
> doble de tiempo, y ese tiempo es justo el que no tiene. La coherencia de una sola familia
> era una preferencia; la velocidad de lectura es del que revisa. No repetir.

**2. NO hay panel de cifras en el hero.** Hubo uno y se retiró. Merece quedar escrito
porque la idea vuelve sola:

- *Primera versión:* `+7,000 empresas`, `22 microservicios`. Retiradas por confidencialidad
  (ver arriba): no eran cifras suyas.
- *Segunda versión:* `5 couriers`, `1,574 agencias`. **Error de categoría.** Son métricas de
  **un proyecto** (API Tracking Perú); puestas en el hero fingen ser estadísticas de
  carrera. Ese dato pertenece a la ficha del proyecto, donde tiene contexto.
- *Lo que quedaba:* `3 años`, `2 APIs propias`. **Ya lo dice el titular**, dos líneas más
  arriba. En cuerpo grande no destacaban nada: duplicaban.

La lección: **un portfolio personal no es un dashboard.** Antes de dar a una cifra el tamaño
de un titular hay que responder dos preguntas — *¿es mía?* y *¿no la digo ya en otro sitio?*
Si falla cualquiera, no va. El impulso original (que los hechos se escaneen) era correcto; el
sitio donde se resolvió, no: se resuelve en el **titular**, que es una sola frase densa.

**3. El CV en PDF es un enlace de primera clase**, en el hero y marcado en acento. Quien
revisa necesita adjuntarlo a su proceso; esconderlo en el pie le obliga a pedirlo por
correo, y a veces no lo pide. *Precio:* hay que reponer `public/cv-alexander-parco.pdf` cada
vez que cambie el CV, y nada avisa si se olvida.

**4. Producción antes que open-source.** Se leen dos o tres filas y se decide; en ese
espacio pesa más una API pública con usuarios que una herramienta de desarrollo, por buena
que sea. *Precio:* las herramientas OSS, que son el trabajo más personal, quedan más abajo.

### ~~Bilingüe: el idioma vive en la URL~~ (v6.4, DEROGADO por la v6.6)

> **Derogado.** Se eligió lo contrario: el idioma vive en el navegador y las URLs no lo
> llevan. Se conserva el razonamiento porque el precio que se paga ahora es exactamente lo
> que esta sección defendía, y conviene tenerlo delante si algún día se revierte.

El sitio se publica en **español e inglés**. La decisión que lo ordena todo es **dónde vive
el idioma**, y hay dos opciones reales.

**Estado en memoria** (un `<select>` que reescribe los textos). Es lo fácil: una ruta, un
`context`, cero trabajo de enrutado. Y rompe tres cosas a la vez: no puedes **compartir** la
versión inglesa de una nota, un buscador solo indexa **una** de las dos, y volver atrás con
el navegador no deshace el cambio de idioma. Un portfolio existe para que alguien mande un
enlace a otra persona; un idioma que no cabe en el enlace es un idioma que no existe.

**El idioma en la URL**, que es lo que se hizo. El español cuelga de la raíz y el inglés de
`/en`, y **los segmentos también se traducen**:

| Español | Inglés |
|---|---|
| `/` | `/en` |
| `/proyectos/:slug` | `/en/projects/:slug` |
| `/notas/:slug` | `/en/notes/:slug` |

El `:slug` **no** se traduce. Es la identidad de la pieza, y traducirlo significaría que un
enlace muere al cambiar de idioma o que hay dos identidades para una sola cosa.

*Precio:* dos árboles de rutas y un conmutador que tiene que saber calcular la **ruta
equivalente** (`rutaEquivalente`), no limitarse a mandarte al inicio. A cambio, cada página
es compartible e indexable en los dos idiomas.

El conmutador es un **enlace**, no un botón: cambiar de idioma es navegar. Siendo enlace se
puede abrir en otra pestaña y lo sigue un buscador. Su texto visible es el **endónimo**
—"English" dentro del español— porque un idioma escrito en su propia lengua solo puede
significar "ir ahí"; su `aria-label` va completo y también en el idioma destino.

`<html lang>` lo reescribe `DocumentMeta` en cada navegación. No es cosmético: es lo que
decide con qué fonética lee un lector de pantalla. Con `lang="es"` fijo, la versión inglesa
se oiría con fonética española y sería incomprensible. Lo mismo con `<title>`, la
descripción y los `<link rel="alternate" hreflang>` —incluido `x-default`—, que se inyectan
en tiempo de ejecución porque apuntan a la ruta equivalente de la página actual y el HTML
estático, siendo una SPA, no sabe cuál se pidió.

### El diccionario es propio, y la prosa larga va en un fichero por idioma

**No hay librería de i18n.** `react-i18next` son ~15 kB para resolver plurales,
interpolación y carga diferida de namespaces; aquí son **~40 rótulos** sin ninguna de esas
tres cosas. El diccionario es un objeto plano con `satisfies Record<string, L>`: si a un
rótulo le falta un idioma, **no compila**. Esa es toda la garantía que hacía falta.

Los **textos cortos** (rótulos, resúmenes, títulos, el perfil) van intercalados como
`{ es, en }` en el propio registro. Los **cuerpos largos** —600 palabras por proyecto— van
en `data/projects/es.ts` y `data/projects/en.ts`, uno por idioma: alternar idioma cada
párrafo hace imposible releer la prosa de corrido, que es justo lo que hay que hacer para
escribirla bien. `Record<SlugProyecto, …>` obliga a que ambos ficheros tengan **todos** los
slugs.

*Traducir es traducir el registro, no las palabras.* El original está en primera persona,
seco y sin adjetivos de venta; una traducción literal suena a folleto y deja de sonar a la
persona que lo escribió.

### El peso: `index.ts` es el metadato, `full.ts` es la prosa

La portada pinta **título, resumen, tags y fecha**. La ficha de detalle es la única que
necesita cuerpo, diagrama y registro de decisión, y ya va en un chunk diferido.

Con un solo módulo de datos, importar el índice arrastraba los **cinco cuerpos completos en
los dos idiomas** al bundle inicial (103 kB gzip, contra los ~91 kB de cuando el sitio era
monolingüe). Separando `data/projects/index.ts` (metadato + resumen) de
`data/projects/full.ts` (la prosa cosida), el bundle inicial baja a **84 kB gzip**: por
debajo de lo que pesaba con **un solo idioma**.

Corolario: `Snippet.draft` pasa a ser un dato explícito. Antes se derivaba de
`content.trim() === ''`, y el índice ya no carga los cuerpos — no puede mirar lo que no
tiene.

### Trampa: una barrera que deja de mirar donde miraba

`scripts/check-placeholders.mjs` impide publicar marcas `[CONTEXTO]`. Barría
`src/data/*.ts` **plano**. Al mover la prosa a `data/projects/` y `data/snippets/`, seguía
pasando en verde sin mirar ni una sola línea de lo que vigila. Ahora es recursivo.

La forma general: **cuando mueves ficheros, comprueba que las barreras se movieron con
ellos.** Una barrera rota no falla — aprueba.

### Ortografía: dónde llevan tilde las cosas, y dónde no (v6.5)

Tres zonas con tres reglas distintas, y confundirlas es lo que produjo el desorden que la
auditoría encontró:

| Zona | Regla |
|---|---|
| Texto que se **renderiza** (datos, rótulos, `index.html`) | Ortografía completa. Sin excepciones. |
| **Comentarios** de código | ASCII, sin tildes ni `ñ`. Es la convención del repo (104 líneas contra 27). |
| Interior de un **bloque de código** | Se traduce el comentario, nunca el código. |

El fallo de origen: los cuerpos largos en español se escribieron **con la convención de los
comentarios** —sin tildes— siendo texto publicado. Convivían "decisión" y "decision",
"código" y "codigo", "más" y "mas" en la misma página. 22 palabras aparecían escritas de las
dos formas a la vez.

Los homógrafos **no se arreglan con buscar-y-reemplazar**: `esta`/`está`, `cual`/`cuál`,
`si`/`sí`, `tu`/`tú`, `publica`/`pública`, `termino`/`terminó`, `que`/`qué` dependen de la
frase. Se resolvieron uno a uno; lo que sobrevive escrito de dos formas está bien así.

`solo` va **sin** tilde (la RAE ya no la exige), y los plurales de `-ción` la pierden:
`decisiones`, `sesiones`, `opciones`.

### Trampa: acentuar el castellano y pisar el inglés

Los ficheros bilingües (`profile.ts`, `experience.ts`, los `index.ts`) llevan los dos idiomas
en el mismo sitio. Una pasada de acentuación sobre "el español" los trató enteros como
españoles y metió **"decisión" tres veces dentro de la bio inglesa**. No rompe el build, no
rompe los tipos, y no se ve hasta que alguien lee la página en inglés.

`scripts/check-placeholders.mjs` lo detecta ahora: ningún valor `en:` puede llevar tilde,
salvo la lista blanca —`Perú` (nombre propio de producto) y `Español` (el endónimo del
conmutador)—. La forma general es la misma que la de la barrera recursiva: **un error que
no rompe nada es el que hay que automatizar**, porque es el único que nadie va a ver.

### Los diagramas ASCII también son texto

Sus rótulos se traducen y se acentúan. Acentuar **no descuadra** la caja: en monoespaciada
`á` y `a` ocupan una columna, siempre que el fichero esté en NFC y no en NFD —macOS produce
NFD en algunas rutas, y ahí `á` son dos code points—. Tras cada cambio se comprueba que toda
línea que abre con `│` cierra en la columna del techo.

### Apóstrofos: `’` en prosa, `'` en código

En inglés convivían `courier's` y `courier’s`, la misma palabra de dos formas. La prosa lleva
el tipográfico `’`; dentro de un bloque de código el apóstrofo es **sintaxis** y se queda
recto. El español no usa ninguno.

### El idioma vive en el navegador, no en la URL (v6.6)

Una sola URL sirve las dos versiones. La elección se guarda en `localStorage`, y en la
primera visita se toma del idioma del navegador.

**El precio es real y es el que la v6.4 quería evitar:** no se puede compartir el enlace de
una nota "en inglés", un buscador solo indexa una de las dos versiones, y el botón atrás no
deshace un cambio de idioma. Se acepta a cambio de URLs limpias: `alexparco.dev/notes/mnemo`
y no `alexparco.dev/en/notes/mnemo`.

Las **rutas van siempre en inglés**, también cuando la página se lee en castellano:

| | |
|---|---|
| `/` | portada |
| `/projects/:slug` | ficha de proyecto |
| `/notes/:slug` | nota |

Y los **slugs también**: `tmux-varias-sesiones` pasó a `tmux-many-sessions`, y
`memoria-persistente-agentes` a `agent-persistent-memory`. Una pieza tiene una URL y solo
una; que no dependa del idioma es lo que hace que un enlace compartido siga vivo.

`<html lang>` lo fija un script **bloqueante** en `index.html`, igual que el tema. Tiene que
replicar la lógica del detector de i18next —misma clave, mismo orden— o el atributo diría una
cosa mientras la página se pinta en otra durante el primer frame.

**No hay `hreflang`.** Solo tiene sentido cuando cada idioma tiene su URL; apuntando los dos
a la misma dirección le estaríamos afirmando al buscador algo que no es cierto.

### `react-i18next` en vez del diccionario propio (v6.6)

Cuesta **17 kB gzip** — el bundle inicial pasa de 84 a 102 kB. Lo que se compra: el detector
de idioma con persistencia, que ahora hace falta de verdad porque la URL ya no dice el
idioma, y plurales e interpolación disponibles el día que hagan falta.

Dos cosas se conservan **a propósito**:

1. **Los rótulos se siguen escribiendo agrupados por clave**, con los dos idiomas juntos, y
   `recursos` deriva de ahí la forma por idioma que i18next quiere. Mantener las dos formas a
   mano serían dos fuentes de verdad para lo mismo. Y `satisfies Record<string, L>` sigue
   siendo lo que impide publicar un rótulo sin traducir: i18next por su cuenta cae al
   `fallbackLng` y sirve el idioma equivocado **sin decir nada**.
2. **Los cuerpos largos NO entran en i18next.** 5.000 palabras de markdown dentro de un JSON
   de traducciones son inmanejables; siguen en `es.ts`/`en.ts` y `tr()` elige la rama.

`load: 'languageOnly'` no es opcional: sin él un navegador en `en-US` no encuentra `en`, cae
al fallback y ve el sitio en castellano teniendo su idioma traducido.

### Trampa: la inversión aplicada dos veces

`cambiarIdioma` guardaba los endónimos **ya invertidos** (`es: 'English'`) para leerse con el
idioma actual. Al pasar a leerse con el idioma destino, la inversión se aplicó otra vez y el
botón anunciaba el idioma **en el que ya estabas**. Compila, no rompe nada y se ve sola en
cuanto miras el botón.

Ahora cada idioma va en su casilla (`es: 'Español'`) y la inversión la hace una sola vez
quien lee. La forma general: **un dato no se guarda pre-transformado para un consumidor
concreto**; se guarda como es y transforma quien lo usa.

### Lo que NO cambia

El **registro de decisión** (problema / decisión / trade-off) sigue siendo el eje del sitio
y su única diferencia real: casi ningún portfolio dice qué precio pagó. Y la **marginalia
viva** sigue siendo el único movimiento de color: la etiqueta de la sección que estás
leyendo pasa a amarillo, vía CSS (`section[data-active] > .page > .spec-label`) para que el
mismo selector cubra `:focus-within`.

### Trampa a no repetir

`last:border-b-0` sobre el `<article>` de `ProjectRow` / `SnippetRow` **acierta siempre**: el
`<article>` es hijo único de su `<li>`, así que borraba TODOS los separadores, no el último.

### Correcciones heredadas que siguen en pie

- `FRAGMENTOS` → **`NOTAS`** (etiqueta, ancla y ruta `/notas/:slug`): medía 76px y la
  canaleta móvil son 72px.
- Sección **`Edu`** (`#formacion`) con su ancla. El nav tiene 6 anclas.
- `Job` gana `summary` y `highlights[]` y pierde `logo`; no se renderizan logos.
- `NotFound` va dentro de `.page`.

---

## 1. Tesis

El portfolio es una ficha técnica: una canaleta de metadatos en mono que **nunca colapsa** (ni en 320px), una columna de contenido en sans, hairlines de 1px como única línea del diseño — y un solo gesto firmado: **la etiqueta de la sección en la canaleta se enciende en ocre mientras la lees**, porque las etiquetas no son ornamento, son el índice navegable del documento.

### Correcciones obligatorias respecto al concepto ganador (no negociables)

| # | Crítica | Corrección aplicada |
|---|---|---|
| 1 | La retícula colapsa <768px → el concepto muere en móvil | **La retícula de 2 columnas NUNCA colapsa.** `4.5rem 1fr` en móvil, `7.5rem 1fr` en ≥768px. La etiqueta mono sigue siendo canaleta, no subtítulo huérfano. Móvil es la forma primaria. |
| 2 | Los números `01–05` son ornamento | **Eliminados.** Las etiquetas ganan función real: cada una es un `id` de ancla (`#perfil`, `#proyectos`…), el nav navega a ellas, y el scroll-spy las enciende. Son un TOC, no decoración. |
| 3 | No hay gesto memorable | **Marginalia viva**: la etiqueta de la sección visible es lo único de la página que cambia de color al hacer scroll. Idéntico en teclado (`:focus-within`). Único, barato, sobrevive a `reduced-motion`. |
| 4 | El repo/demo están enterrados a 1 click + 1 scroll | **Los links `code ↗` / `demo ↗` viven EN la fila del listado** y en el hero del detalle, sobre el fold. |
| 5 | `/works` es idéntica al home; `/snippets` tiene 1 item | **Se eliminan las rutas de listado.** Home lista los 4 proyectos y el fragmento completos. El nav son anclas. Rutas: `/`, `/proyectos/:slug`, `/fragmentos/:slug`. |
| 6 | Code blocks / markdown fuera del sistema | **Sección 5.8 completa**: token `--color-surface` (superficie ≠ estado), reglas para code block, inline code, listas, tablas, blockquote. Y la regla que desambigua mono-dato vs mono-código. |
| 7 | Empty state, overflow de tags, imágenes de experiencia sin spec | Especificados en §6.4, §5.4 y §5.3. |
| 8 | Focus ring en `--accent-mark` (~3.2:1) | Focus ring usa **`--color-accent`** (6.3:1 / 9.1:1). `--accent-mark` solo para la marca de hover (decorativa, redundante con el cambio de fondo). |
| 9 | El borde izquierdo de hover causa layout shift | Se implementa con **`::before` absoluto**, nunca con `border`. |
| 10 | `img[data-loaded]` se queda en opacity 0 si está cacheada | Se chequea `ref.current.complete` en `useEffect`. |
| 11 | Typo "Fronted Developer" en el dato más visible | **Corregir el dato**: `Frontend Developer` en `experience.ts` y en el rol del hero. |
| 12 | Sin regla de idioma | **Regla dura**: toda la UI y la prosa en español. Solo son inglés los nombres propios técnicos (TypeScript, Spring-Boot, ReactJS) y el código. Nav: `perfil · stack · experiencia · proyectos · fragmentos`. Rol: `Desarrollador Fullstack`. |

---

## 2. Design tokens — `src/styles/theme.css` (literal, copiable)

```css
@import "tailwindcss";

/* Dark mode por atributo en <html>. Obligatorio en Tailwind v4. */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme {
  /* ─── Color (light es el default) ─────────────────────────────────── */
  --color-bg:          oklch(0.980 0.003 95);   /* #FAF9F6  papel cálido  */
  --color-surface:     oklch(0.955 0.004 95);   /* #F1EFE9  code blocks, marcos de imagen */
  --color-bg-hover:    oklch(0.940 0.005 95);   /* #E9E6DF  estado hover/focus de fila     */
  --color-ink:         oklch(0.240 0.012 262);  /* #2B2F36  13.2:1 sobre bg   (AAA)        */
  --color-ink-muted:   oklch(0.500 0.012 262);  /* #6E7480   5.1:1 sobre bg   (AA)         */
  --color-rule:        oklch(0.885 0.005 95);   /* #DEDBD4  hairline 1px                   */
  --color-accent:      oklch(0.500 0.140 50);   /* #98511F   6.3:1 sobre bg   (AA) + focus */
  --color-accent-mark: oklch(0.620 0.160 55);   /* #C06B2C  marca 2px decorativa (no texto)*/

  /* ─── Tipografía ──────────────────────────────────────────────────── */
  --font-sans: "Geist Variable", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace;

  --text-label: 0.6875rem;              /* 11px  — etiquetas de canaleta, uppercase */
  --text-label--line-height: 1.4;
  --text-label--letter-spacing: 0.09em;
  --text-label--font-weight: 500;

  --text-meta: 0.8125rem;               /* 13px  — tags, fechas, nav, links mono */
  --text-meta--line-height: 1.6;

  --text-sm: 0.875rem;                  /* 14px  — apoyo, empresa, subtítulos */
  --text-sm--line-height: 1.65;

  --text-body: 1rem;                    /* 16px  — prosa */
  --text-body--line-height: 1.7;

  --text-h3: 1.125rem;                  /* 18px  — título de fila, cargo */
  --text-h3--line-height: 1.4;
  --text-h3--font-weight: 500;

  --text-h2: 1.5rem;                    /* 24px  — título de detalle */
  --text-h2--line-height: 1.3;
  --text-h2--font-weight: 500;

  --text-h1: clamp(1.75rem, 1.4rem + 1.75vw, 2.75rem);
  --text-h1--line-height: 1.1;
  --text-h1--letter-spacing: -0.02em;
  --text-h1--font-weight: 500;

  /* ─── Espaciado (base 4px) ────────────────────────────────────────── */
  --spacing: 4px;                       /* p-1 = 4px … p-6 = 24px … p-16 = 64px */

  /* ─── Medidas del sistema ─────────────────────────────────────────── */
  --container-page:   880px;            /* max-width del contenedor          */
  --container-prose:  68ch;             /* measure de la prosa               */
  --gutter-sm:        4.5rem;           /* canaleta mono <768px  (72px)      */
  --gutter-lg:        7.5rem;           /* canaleta mono ≥768px  (120px)     */

  --radius-sharp: 2px;                  /* radius global, único              */

  /* ─── Motion ──────────────────────────────────────────────────────── */
  --ease-out: cubic-bezier(0.2, 0, 0, 1);
  --dur-state: 120ms;                   /* hover / focus / spy               */
  --dur-enter: 160ms;                   /* entrada de ruta                   */
  --dur-image: 200ms;                   /* fade-in de imagen                 */
}

/* ─── Override dark. Mismos nombres de token, otros valores. ────────── */
[data-theme="dark"] {
  --color-bg:          oklch(0.180 0.008 262);  /* #17191C */
  --color-surface:     oklch(0.220 0.009 262);  /* #1F2226 */
  --color-bg-hover:    oklch(0.250 0.009 262);  /* #25282D */
  --color-ink:         oklch(0.930 0.004 95);   /* #E8E6E1  14.1:1 (AAA) */
  --color-ink-muted:   oklch(0.680 0.008 262);  /* #9BA0A6   6.6:1 (AA)  */
  --color-rule:        oklch(0.300 0.008 262);  /* #33373C */
  --color-accent:      oklch(0.780 0.120 62);   /* #EDA76A   9.1:1 (AAA) */
  --color-accent-mark: oklch(0.700 0.140 58);   /* #D8874A */
}

/* ─── Base ────────────────────────────────────────────────────────── */
:root            { color-scheme: light; }
[data-theme="dark"] { color-scheme: dark; }   /* scrollbars, inputs nativos */

html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

body {
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: var(--text-body);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Focus: nunca se suprime. Siempre --color-accent (AA). */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: var(--radius-sharp);
}

::selection { background: var(--color-accent-mark); color: var(--color-bg); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Contraste verificado (WCAG 2.1):**

| Par | Light | Dark |
|---|---|---|
| ink / bg | 13.2:1 AAA | 14.1:1 AAA |
| ink-muted / bg | 5.1:1 AA | 6.6:1 AA |
| ink-muted / bg-hover | 4.7:1 AA | 5.9:1 AA |
| accent / bg | 6.3:1 AA | 9.1:1 AAA |
| accent (focus ring) / bg | 6.3:1 ✔ ≥3:1 no-textual | 9.1:1 ✔ |
| rule / bg | 1.3:1 — decorativo, nunca porta información |

`--color-accent-mark` **jamás lleva texto** ni es el único indicador de un estado.

---

## 3. Tipografía

### Familias y carga

```bash
pnpm add @fontsource-variable/geist @fontsource-variable/jetbrains-mono
```

```ts
// src/main.tsx — antes de importar los estilos propios
import "@fontsource-variable/geist/index.css";        // wght 400–500 usados
import "@fontsource-variable/jetbrains-mono/index.css";
import "./styles/theme.css";
```

Solo subset `latin`. `font-display: swap` (default de fontsource). Sin CDN, sin `@import` de Google Fonts (rompería el build offline y añade una petición bloqueante).

### La ley (una sola, sin excepciones)

> **Si el dato es catalogable o lo produjo una máquina → mono.
> Si lo escribió un humano para ser leído → sans.**

Aplicación literal:

| Mono | Sans |
|---|---|
| etiquetas de canaleta, nav, tags, fechas, `autor · fecha`, rutas, links `code ↗`/`demo ↗`, footer, empty states, **código** | h1, h2, h3, prosa, títulos de proyecto, cargo, nombre de empresa |

### Desambiguación mono-dato vs mono-código (el agujero del concepto original)

El código también es mono. Se distinguen por **tres señales simultáneas**, nunca por la familia:

| | mono-**dato** (metadato) | mono-**código** (contenido) |
|---|---|---|
| color | `--color-ink-muted` | `--color-ink` |
| caja | `text-transform: uppercase` + `tracking .09em` (solo etiquetas de canaleta) o normal para tags/fechas | siempre `lowercase`/literal, `tracking: 0` |
| superficie | **ninguna** (sobre `--color-bg`) | **siempre** `--color-surface` + hairline |

**Regla operativa:** el metadato nunca tiene fondo; el código siempre lo tiene. La superficie es la señal semántica.

### Escala (7 escalones, cerrada)

| Token | Tamaño / interlínea | Peso | Uso |
|---|---|---|---|
| `text-label` | 11px / 1.4, `.09em`, UPPER | mono 500 | etiqueta de canaleta (`PERFIL`, `STACK`) |
| `text-meta` | 13px / 1.6 | mono 400 | tags, fechas, nav, links, footer |
| `text-sm` | 14px / 1.65 | sans 400 | empresa, texto de apoyo |
| `text-body` | 16px / 1.7, **68ch** | sans 400 | bio, body de proyecto/fragmento |
| `text-h3` | 18px / 1.4 | sans 500 | título de fila, cargo |
| `text-h2` | 24px / 1.3 | sans 500 | título de página de detalle |
| `text-h1` | clamp(28→44px) / 1.1, `-.02em` | sans 500 | nombre en el hero |

Sin cursivas. Sin 600/700 en ninguna parte: `<strong>` de markdown renderiza como **Geist 500**. Los headings de sección son `<h2>` reales, tipografiados como `text-label` (semántica correcta, jerarquía por retícula).

---

## 4. Layout

### Contenedor y retícula

```css
.page {                       /* un solo contenedor en todo el sitio */
  max-width: var(--container-page);   /* 880px */
  margin-inline: auto;
  padding-inline: 24px;
}
@media (min-width: 768px) { .page { padding-inline: 40px; } }

/* LA retícula. Gobierna TODAS las secciones y páginas. NUNCA colapsa. */
.grid-spec {
  display: grid;
  grid-template-columns: var(--gutter-sm) 1fr;   /* 4.5rem 1fr — móvil */
  column-gap: 16px;
  align-items: start;
}
@media (min-width: 768px) {
  .grid-spec {
    grid-template-columns: var(--gutter-lg) 1fr; /* 7.5rem 1fr */
    column-gap: 32px;
  }
}
```

**Presupuesto móvil (320px, el peor caso):** 320 − 48 (padding) = 272 útiles → 72 canaleta + 16 gap + **184px de contenido**. `text-label` a 11px con tracking `.09em` mide ~55px en `PERFIL` y ~62px en `STACK` → cabe con holgura. Etiquetas de **máximo 7 caracteres**, sin excepción. Si una etiqueta no cabe en 7 caracteres, se renombra el concepto, no se ensancha la canaleta.

**Único breakpoint del sistema: `768px`.** No hay más.

Cualquier bloque que no encaje en `etiqueta | contenido` (imagen ancha, code block largo) rompe explícitamente con `grid-column: 1 / -1` y lo declara en su componente. No hay ruptura implícita.

### Ritmo vertical

- Sección: `padding-block: 40px` (móvil) / `56px` (≥768px), separadas por `border-top: 1px solid var(--color-rule)`. **La regla es el separador; nunca hay margin doble.**
- Hero: `padding-top: 64px` (móvil) / `96px`; `padding-bottom: 48px` / `64px`.
- Fila de proyecto/fragmento: `padding-block: 16px`, `min-height: 56px` (target ≥44px), hairline inferior entre filas.
- Prosa: separación entre párrafos `1em`.

### Nav (estático, no sticky)

```
alexparco                perfil · stack · exp · proyectos · fragmentos   [☀/☾]
────────────────────────────────────────────────────────────────────── hairline
```

- `padding-block: 20px`, hairline inferior, ancho de `.page`.
- Izquierda: `alexparco` en mono 500, `--color-ink`, link a `/`.
- Derecha: 5 anclas mono 400 (`text-meta`) + toggle de tema. Separador `·` en `--color-rule`.
- **En móvil (<768px)**: el nav es dos filas. Fila 1: `alexparco` + toggle. Fila 2: las anclas en `overflow-x: auto; scrollbar-width: none;` con `scroll-snap`. **Sin hamburguesa. Sin menú. Nunca.**
- Estado activo (scroll-spy): `color: var(--color-accent)` + `text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px`.
- En rutas de detalle, ningún ancla está activa; se muestra un link mono `← volver` a la izquierda, bajo el nav.

### Rutas

> **Derogado por la v6.4.** El sitio es bilingüe y el idioma vive en la URL: hay un árbol
> de rutas por idioma, con los segmentos traducidos (`/proyectos/:slug` ↔
> `/en/projects/:slug`). Ver §0, "Bilingüe: el idioma vive en la URL". Los slugs de abajo
> son además los del catálogo antiguo.

| Ruta | Página |
|---|---|
| `/` | Home (hero + 5 secciones ancladas) |
| `/proyectos/:slug` | Detalle de proyecto |
| `/fragmentos/:slug` | Detalle de fragmento |
| `*` | 404 mínimo: `404 — no existe esa ruta` en mono + `← inicio` |

`slug = slugify(title)` → `spring-login`, `pokeapp`, `todoapp`, `task-api-typescript`, `expo-react-eas-apk-build`. Resolución por slug contra `WorksData` / `SnippetsData`; si no hay match → `<Navigate to="/404" replace />`.

React Router 7 con `basename={import.meta.env.BASE_URL}`, que sigue a `base` de Vite. Desde la v6.6 `base` es `/` y el sitio se sirve en **alexparco.dev** (dominio propio, `public/CNAME`), no en `alexparco.github.io/portfolio/`. Para deep-links en GitHub Pages, el script `build` copia `dist/index.html` a `dist/404.html`, y `public/.nojekyll` evita que Pages se coma `assets/`.

---

## 5. Componentes

Todos en `src/components/`. TSX + clases Tailwind. Cero librerías de UI.

### 5.1 `<SpecRow label content anchorId>` — el átomo del sistema

Propósito: la retícula `etiqueta | contenido` como componente único. Todo lo demás la consume.

```
Anatomía:
<section id={anchorId} class="grid-spec section">
  <h2 data-spy-label class="text-label uppercase text-ink-muted">{label}</h2>
  <div class="min-w-0">{children}</div>
</section>
```

- `min-w-0` en la columna derecha es obligatorio (si no, un code block sin wrap revienta la grid).
- `data-spy-label`: lo consume el scroll-spy (§7).
- En móvil la etiqueta **sigue en la canaleta**. No hay variante apilada.

### 5.2 `<Hero>`

Propósito: identidad + los 3 metadatos que un reclutador busca en 5 segundos.

```
<h1>Alexander Parco Flores</h1>                    sans 500
<p class="text-meta font-mono text-ink-muted">Desarrollador Fullstack · Lima, Perú</p>
<dl class="grid-spec">                             ← la misma retícula
  LUGAR   Lima, Perú
  EXP     2 años
  REDES   linkedin ↗  github ↗  email ↗  instagram ↗    ← mono, accent, underline
</dl>
```

- `<dl>` con `<dt class="text-label">` en la canaleta y `<dd>` en la derecha. Semántica correcta.
- **Rol corregido a `Desarrollador Fullstack`** (el dato `Fronted` es un typo y se arregla en origen).
- Sin foto, sin avatar, sin blob decorativo.

### 5.3 `<Experience>` — sección `EXP`

```
Frontend Developer                      may. 2023 — actualidad · 4 meses
Zites Company
───────────────────────────────────────────────────────────── hairline
FullStack Developer                     ene. 2023 — actualidad · 7 meses
PetroAmerica
```

- Cargo `text-h3` sans 500. Empresa `text-sm` sans, `--color-ink-muted`. Fecha `text-meta` mono muted, alineada a la derecha en ≥768px; en móvil **debajo del cargo**, alineada a la izquierda (no se comprime).
- Orden: descendente por fecha de inicio.
- **Los logos de empresa (`petroamerica.png`, `zites.svg`) NO se renderizan.** Decisión explícita, no un olvido: un logo es branding ajeno, no es un dato del CV; además obligaría a resolver logos oscuros sobre fondo oscuro con hacks (`invert`, chips blancos) que violan "cero superficies decorativas". Se elimina `src` de `ExperienceData`. Los archivos se borran de `public/`.
- Se elimina `ModalExp.tsx` (un modal para mostrar un logo es la definición de ceremonia).

### 5.4 `<Stack>` — sección `STACK`

```
TypeScript   JavaScript   Git   Java   Golang   Python   Linux
```

- Mono `text-meta`, `--color-ink-muted`, `display: flex; flex-wrap: wrap; gap: 8px 24px`.
- **Sin píldoras, sin bordes, sin fondo, sin iconos SVG remotos.** Se elimina la dependencia de `devicon` en `raw.githubusercontent.com` (petición externa, no cacheable, se ve mal en dark). Un stack es una lista de palabras.
- `stack.ts` se reduce a `export const StackData: string[]`.

### 5.5 `<ProjectRow>` — la fila-índice (sustituye a las cards)

**El componente más importante del sitio.** 4 proyectos en cards gritan "está vacío"; 4 proyectos en un índice se leen como un sumario completo.

```
Anatomía (≥768px):
┌─────────────────────────────────────────────────────────────────────┐
│ Spring-Login                        ReactJs Java Spring-Boot        │
│ code ↗  demo ↗                                          oct. 2022   │
└─────────────────────────────────────────────────────────────────────┘
```

- El contenedor es **un `<article>`**, no un `<a>` — porque contiene links propios (`code`, `demo`) y anidar `<a>` es HTML inválido.
- El título es el `<a>` al detalle, con **stretched-link**: `::after { position:absolute; inset:0; content:"" }` sobre el `article` (`position: relative`). Los links `code`/`demo` llevan `position: relative; z-index: 1` para quedar por encima. Resultado: fila entera clickable (target 100%×≥56px) **y** links directos al repo/demo accesibles sin entrar al detalle.
- **`code ↗` y `demo ↗` son mono `text-meta` en `--color-accent`, siempre visibles.** `href[0]` = demo, `href[1]` = github. **Si el string está vacío o es `" "`, el link NO se renderiza** (bug corregido en origen: limpiar `works.ts`).
- Tags: mono `text-meta` muted, `flex-wrap: wrap; justify-content: flex-end`. **Overflow: se renderizan como máximo 4 tags; si hay más, el cuarto se sustituye por `+n`.** En móvil los tags van en su propia línea bajo el título, alineados a la izquierda (nunca comprimidos a la derecha).
- Fecha: mono muted, `Intl.DateTimeFormat("es", { month: "short", year: "numeric" })`. **Se elimina `moment`.**
- Hover/focus: §6.

### 5.6 `<ProjectDetail>` — `/proyectos/:slug`

La evidencia **sobre el fold**:

```
← volver
Spring-Login                                              ← h2, grid-column 1/-1
Alexander Parco Flores · 28 de octubre de 2022            ← mono muted
code ↗   demo ↗                                           ← mono accent, ARRIBA
─────────────────────────────────────────────────────────
TAGS      ReactJs  Java  Spring-Boot
IMG       [ imagen enmarcada, hairline 1px, radius 2px ]
NOTAS     prosa 68ch (react-markdown + remark-gfm)
```

- Los links de repo/demo van **antes** de la imagen y del body. Innegociable.
- Imagen: `<figure>` con `border: 1px solid var(--color-rule); border-radius: 2px; background: var(--color-surface); padding: 8px`. `max-width: min(100%, {size}px)` respetando el campo `size` de los datos. `width`/`height` intrínsecos o `aspect-ratio` para evitar CLS. `loading="lazy"`, `decoding="async"`.
- Fade-in **con el fix del cacheado**:

```tsx
const ref = useRef<HTMLImageElement>(null);
const [loaded, setLoaded] = useState(false);
useEffect(() => { if (ref.current?.complete) setLoaded(true); }, []);
<img ref={ref} onLoad={() => setLoaded(true)} data-loaded={loaded || undefined} ... />
```

```css
img { opacity: 0; transition: opacity var(--dur-image) var(--ease-out); }
img[data-loaded] { opacity: 1; }
```

- Fecha larga: `Intl.DateTimeFormat("es", { dateStyle: "long" })`.

### 5.7 `<SnippetDetail>` — `/fragmentos/:slug`

Misma plantilla que el detalle de proyecto, sin imagen ni tags.

- **Se elimina `EasBuild.tsx`** (componente Chakra hardcodeado) y los `console.log`. El contenido del fragmento pasa a `snippets.ts` como campo `body: string` en **markdown**, renderizado por el mismo `<Prose>` que los proyectos. El hardcode `<EasBuild />` desaparece del router.
- Migración del contenido de EasBuild a markdown: párrafos + bloques ```` ```bash ```` / ```` ```json ```` + links a `expo.dev`. Es literalmente el mismo texto.

### 5.8 `<Prose>` — el renderer de markdown (el agujero tapado)

`react-markdown` + `remark-gfm`, con un mapa de componentes explícito. **Todo el markdown está dentro del sistema, sin excepciones:**

```css
.prose            { max-width: var(--container-prose); }  /* 68ch */
.prose p          { margin-block: 0 1em; }
.prose a          { color: var(--color-accent);
                    text-decoration: underline; text-underline-offset: 3px;
                    text-decoration-thickness: 1px; }
.prose strong     { font-weight: 500; }                    /* nunca 700 */
.prose em         { font-style: normal; color: var(--color-ink-muted); } /* sin cursivas */

/* Inline code — mono-CÓDIGO: siempre superficie, nunca uppercase */
.prose :not(pre) > code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  color: var(--color-ink);
  background: var(--color-surface);
  border-radius: var(--radius-sharp);
  padding: 0.1em 0.35em;
}

/* Code block — rompe la retícula explícitamente y hace scroll propio */
.prose pre {
  grid-column: 1 / -1;
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  line-height: 1.7;
  color: var(--color-ink);
  background: var(--color-surface);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-sharp);
  padding: 16px;
  margin-block: 24px;
  overflow-x: auto;            /* el body NUNCA scrollea horizontal */
  max-width: 100%;
  tab-size: 2;
}
.prose pre code { background: none; padding: 0; font-size: inherit; }

/* Listas: marcador mono muted, sin bullets de sistema */
.prose ul, .prose ol { padding-left: 1.25em; margin-block: 0 1em; }
.prose li            { margin-block: 0.25em; }
.prose li::marker    { color: var(--color-ink-muted);
                       font-family: var(--font-mono); font-size: 0.8125rem; }

/* Tabla: hairlines, cero zebra, cero superficie */
.prose table   { width: 100%; border-collapse: collapse; font-size: var(--text-sm);
                 display: block; overflow-x: auto; }
.prose th      { font: 500 var(--text-label)/1.4 var(--font-mono);
                 text-transform: uppercase; letter-spacing: 0.09em;
                 color: var(--color-ink-muted); text-align: left; }
.prose th, .prose td { padding: 10px 12px 10px 0;
                       border-bottom: 1px solid var(--color-rule); }

/* Blockquote: una sola regla vertical, sin superficie, sin comillas */
.prose blockquote {
  border-left: 2px solid var(--color-rule);
  padding-left: 16px; margin-block: 24px;
  color: var(--color-ink-muted);
}
.prose h2, .prose h3 { font-weight: 500; margin-block: 32px 8px; }
```

**Sin syntax highlighting.** Ni Shiki ni Prism: el código se muestra en `--color-ink` monocromo. Coherente con "un solo acento" y ahorra ~200 KB. El resaltado es coloreado decorativo; la ficha técnica no lo necesita.

### 5.9 `<Nav>`, `<Footer>`, `<ThemeToggle>`

**Nav** — §4. `<nav aria-label="Principal">`, anclas `<a href="#perfil">` con `aria-current="true"` en la activa.

**Footer** — una línea, hairline superior, mono `text-meta` muted, `padding-block: 32px`:
```
Lima, Perú · 2026 · alexparco16@gmail.com
```
El email es un `mailto:` en `--color-accent`.

**ThemeToggle** — `<button>` de 44×44px, `aria-label="Cambiar a tema oscuro"` (dinámico), contenido: `☀` / `☾` en mono (`text-meta`, `--color-ink-muted`; en hover → `--color-accent`). Sin animación de icono, sin switch, sin track deslizante.

```ts
// Inline en index.html, ANTES del bundle — evita el flash de tema (FOUC).
(function () {
  var t = localStorage.getItem("theme");
  if (!t) t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = t;
})();
```
Estado en `<html data-theme>`, persistido en `localStorage.theme`. Dos estados (`light`/`dark`); el primer valor lo decide el sistema. Sin estado "auto" visible: es complejidad sin recompensa para un portfolio.

---

## 6. Estados

### 6.1 Fila (`ProjectRow`, `SnippetRow`) — hover / focus-within

```css
.row { position: relative; transition: background-color var(--dur-state) linear; }

/* La marca de 2px: ::before absoluto. CERO layout shift. */
.row::before {
  content: "";
  position: absolute;
  inset-block: 0;
  left: -12px;                 /* invade el gap, no desplaza el contenido */
  width: 2px;
  background: var(--color-accent-mark);
  opacity: 0;
  transition: opacity var(--dur-state) linear;
}
.row:hover, .row:focus-within        { background: var(--color-bg-hover); }
.row:hover::before,
.row:focus-within::before            { opacity: 1; }
.row:hover .row-title                { color: var(--color-accent); }
```

- **Nada se mueve**: no hay `transform`, ni `translate`, ni `scale`.
- El estado se comunica por **dos señales redundantes** (fondo + marca), así que la marca de bajo contraste nunca es el único indicador.
- **Teclado === ratón**: `:focus-within` produce exactamente el mismo aspecto que `:hover`.

### 6.2 Links

```css
a { color: var(--color-accent); text-decoration: none;
    transition: color var(--dur-state) linear; }
a:hover { text-decoration: underline; text-underline-offset: 4px;
          text-decoration-thickness: 1px; }
```
Links mono (`code ↗`, `demo ↗`, redes): idéntico. `:active` → `opacity: 0.7`, sin transición.

### 6.3 Focus-visible

`outline: 2px solid var(--color-accent); outline-offset: 2px`. **Nunca `outline: none`.** Instantáneo, sin transición. Visible en light y dark (6.3:1 / 9.1:1).

### 6.4 Estados vacíos (especificados, no improvisados)

| Caso | Qué se ve |
|---|---|
| **0 fragmentos** | La sección `FRAGMENTOS` **no se renderiza en absoluto** (ni etiqueta, ni hairline, ni hueco) y el ancla desaparece del nav. Una sección vacía entre dos hairlines se lee como un bug. Regla: `if (SnippetsData.length === 0) return null`. |
| **0 proyectos** | Idem. (No va a pasar, pero la regla es la misma y el código la implementa.) |
| **Proyecto sin `demo`** | El link `demo ↗` simplemente no existe. Sin placeholder, sin `demo (próximamente)`, sin link muerto. |
| **Proyecto sin imagen** | El bloque `IMG` completo (etiqueta + figure) no se renderiza. |
| **Fragmento sin `body`** | El detalle no se enlaza: la fila no es clickable, el título va en `--color-ink-muted` con un tag mono `borrador` a la derecha. |
| **Ruta inexistente** | `404 — no existe esa ruta` en mono muted + `← inicio` en accent. Nada más. |
| **Imagen que falla** | `onError` → se oculta el `<figure>` entero. Sin icono de imagen rota. |

---

## 7. Motion

**Cinco animaciones en todo el sitio. Ninguna más. Cero librerías — `framer-motion` se desinstala.**

| # | Qué | Cómo |
|---|---|---|
| 1 | Hover/focus de fila y link | `transition: background-color 120ms linear, color 120ms linear, opacity 120ms linear`. Sin `transform`. |
| 2 | Entrada de ruta | `@keyframes enter { from { opacity:0; transform: translateY(4px) } to { opacity:1; transform:none } }` — `160ms var(--ease-out)`, **una sola vez**, en el contenedor de página, con `key={location.pathname}`. |
| 3 | Foco | Instantáneo. Sin transición. |
| 4 | Imagen del detalle | `opacity 0→1` en `200ms`, con el fix de `complete` (§5.6). |
| 5 | **Marginalia viva (el gesto firmado)** | La etiqueta de la sección visible pasa de `--color-ink-muted` a `--color-accent` en `120ms linear`. Nada más cambia. |

**Implementación del gesto firmado:**

```ts
// useScrollSpy.ts — IntersectionObserver, cero dependencias
const observer = new IntersectionObserver(
  (entries) => { /* la entry visible con mayor intersectionRatio gana */ },
  { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
);
// La sección activa recibe data-active en su <section>; el CSS hace el resto:
```

```css
[data-spy-label]              { color: var(--color-ink-muted);
                                transition: color var(--dur-state) linear; }
section[data-active] [data-spy-label],
section:focus-within [data-spy-label] { color: var(--color-accent); }
```

Y el nav refleja el mismo estado (`aria-current`). La banda es la franja central del viewport (10% de alto), así que en móvil **también funciona** — es el único portfolio donde la canaleta de metadatos te dice dónde estás.

`prefers-reduced-motion: reduce` → las 5 se anulan con el bloque global de §2 (`duration: 0.01ms`). El estado final se aplica al instante y **todo sigue siendo perceptible**, porque cada señal es de color o superficie, nunca de movimiento.

**Prohibido:** parallax, scroll-reveal, stagger, skeletons, cursor custom, magnetic buttons, texto que se escribe solo, `blur` de fondo.

---

## 8. Accesibilidad — reglas no negociables

1. **`:focus-visible` nunca se suprime.** Ring de 2px en `--color-accent` (≥6.3:1), `offset: 2px`. Cualquier PR que escriba `outline: none` sin reemplazo se rechaza.
2. **Target táctil ≥ 44px** en filas, links del nav y toggle de tema.
3. **Ningún estado se comunica solo con color.** Hover = fondo + marca. Nav activo = color + `underline` + `aria-current`. Spy = color + `aria-current` en el nav.
4. **Contraste:** texto ≥ 4.5:1, no-textual ≥ 3:1. Verificado en §2 para light y dark.
5. **Landmarks:** `<header>` con `<nav aria-label="Principal">`, `<main id="main">`, `<footer>`. **Skip-link** `Saltar al contenido` como primer elemento focusable (`sr-only` hasta `:focus`).
6. **Jerarquía de headings sin saltos:** un `<h1>` por página. Las etiquetas de canaleta son `<h2>` reales (tipografiados como label, no `sr-only`). En el detalle, el título es `<h1>`.
7. **`<a>` nunca dentro de `<a>`.** La fila usa stretched-link (§5.5).
8. **`lang="es"`** en `<html>`. Los tramos en inglés (`ReactJS`, `Spring-Boot`) son nombres propios y no necesitan `lang`.
9. **Links externos:** `target="_blank" rel="noopener noreferrer"`, y el `↗` es `aria-hidden`; el nombre accesible lo da el texto (`code`, `demo`) más un `<span class="sr-only">(se abre en una pestaña nueva)</span>`.
10. **Imágenes:** `alt` descriptivo (`Captura de la pantalla de login de Spring-Login`). Nunca `alt=""` en imágenes de contenido.
11. **`prefers-reduced-motion`** anula las 5 animaciones. Sin excepciones.
12. **`color-scheme`** declarado en ambos temas (scrollbars y controles nativos correctos).
13. **Navegable 100% por teclado**, en el orden visual del DOM. Sin trampas de foco: no hay modales (se elimina `ModalExp`).
14. **El body nunca scrollea horizontalmente.** Todo contenido ancho (`pre`, `table`) scrollea dentro de su propio `overflow-x: auto`.

---

## 9. Wireframes ASCII

### 9.1 Home — móvil 375px (**la forma primaria**; la canaleta no colapsa)

```
┌───────────────────────────────────┐
│ alexparco                     ☀   │
│ perfil·stack·exp·proyectos·frag→  │ ← scroll-x, sin hamburguesa
├───────────────────────────────────┤ ← hairline
│                                   │
│  Alexander Parco                  │  h1 clamp
│  Flores                           │
│  Desarrollador Fullstack ·        │  mono muted
│  Lima, Perú                       │
│                                   │
│ LUGAR │ Lima, Perú                │  ← la retícula SIGUE VIVA
│ EXP   │ 2 años                    │     canaleta 4.5rem · gap 16px
│ REDES │ linkedin ↗  github ↗      │
│       │ email ↗  instagram ↗      │
├───────────────────────────────────┤
│ PERFIL│ Soy un desarrollador web  │  ← etiqueta OCRE (estás aquí)
│       │ con más de 2 años de      │
│       │ experiencia. Mi enfoque   │
│       │ es desarrollar software   │
│       │ escalable con metodolo-   │
│       │ gías ágiles.              │
├───────────────────────────────────┤
│ STACK │ TypeScript  JavaScript    │
│       │ Git  Java  Golang         │
│       │ Python  Linux             │
├───────────────────────────────────┤
│ EXP   │ Frontend Developer        │
│       │ Zites Company             │
│       │ may. 2023 — actual · 4 m  │  ← fecha DEBAJO en móvil
│       │ ────────────────────────  │
│       │ FullStack Developer       │
│       │ PetroAmerica              │
│       │ ene. 2023 — actual · 7 m  │
├───────────────────────────────────┤
│PROYEC.│▏Spring-Login              │ ← marca 2px + bg-hover
│       │ ReactJs Java Spring-Boot  │
│       │ code ↗            oct 22  │
│       │ ────────────────────────  │
│       │ PokeApp                   │
│       │ Go ReactJS TypeScript     │
│       │ code ↗            oct 22  │
│       │ ────────────────────────  │
│       │ TodoApp                   │
│       │ ReactJS TypeScript        │
│       │ code ↗ demo ↗     may 22  │  ← el demo, en el listado
│       │ ────────────────────────  │
│       │ Task Api - TypeScript     │
│       │ NodeJs TypeScript         │
│       │ code ↗            ene 23  │
├───────────────────────────────────┤
│FRAGM. │ Expo React | eas APK build│
│       │ React Native      mar 23  │
├───────────────────────────────────┤
│ Lima, Perú · 2026 ·               │
│ alexparco16@gmail.com             │
└───────────────────────────────────┘
```

### 9.2 Home — desktop ≥768px (880px máx)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  alexparco            perfil · stack · exp · proyectos · fragmentos   ☀  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Alexander Parco Flores                                                 │  h1
│   Desarrollador Fullstack · Lima, Perú                                   │  mono muted
│                                                                          │
│   LUGAR      │ Lima, Perú                                                │
│   EXP        │ 2 años                                                    │
│   REDES      │ linkedin ↗   github ↗   email ↗   instagram ↗             │
├──────────────────────────────────────────────────────────────────────────┤
│   PERFIL     │ Soy un desarrollador web con más de 2 años de experiencia │  ← OCRE si
│  (7.5rem)    │ en programación. Mi enfoque principal es desarrollar      │    estás aquí
│              │ software altamente escalable mediante la aplicación de    │
│              │ metodologías ágiles. Además, tengo habilidades en la      │  68ch
│              │ resolución de problemas, la gestión de proyectos y la     │
│              │ capacidad de trabajar en equipo.                          │
├──────────────────────────────────────────────────────────────────────────┤
│   STACK      │ TypeScript  JavaScript  Git  Java  Golang  Python  Linux  │
├──────────────────────────────────────────────────────────────────────────┤
│   EXP        │ Frontend Developer            may. 2023 — actual · 4 meses│
│              │ Zites Company                                             │
│              │ ───────────────────────────────────────────────────────── │
│              │ FullStack Developer           ene. 2023 — actual · 7 meses│
│              │ PetroAmerica                                              │
├──────────────────────────────────────────────────────────────────────────┤
│   PROYECTOS  │ Spring-Login                   ReactJs Java Spring-Boot   │
│              │ code ↗                                          oct. 2022 │
│              │ ───────────────────────────────────────────────────────── │
│             ▏│ PokeApp                        Go ReactJS TypeScript      │ ← hover:
│              │ code ↗                                          oct. 2022 │   marca+bg
│              │ ───────────────────────────────────────────────────────── │
│              │ TodoApp                        ReactJS TypeScript         │
│              │ code ↗  demo ↗                                  may. 2022 │
│              │ ───────────────────────────────────────────────────────── │
│              │ Task Api - TypeScript          NodeJs TypeScript          │
│              │ code ↗                                          ene. 2023 │
├──────────────────────────────────────────────────────────────────────────┤
│   FRAGMENTOS │ Expo React | eas APK build                   React Native │
│              │                                                 mar. 2023 │
├──────────────────────────────────────────────────────────────────────────┤
│  Lima, Perú · 2026 · alexparco16@gmail.com                               │
└──────────────────────────────────────────────────────────────────────────┘
```

*(No existe una página `/proyectos` de listado. Este listado ES el listado. Cuando haya >8 proyectos se promueve a ruta propia — y solo entonces.)*

### 9.3 Detalle de proyecto — `/proyectos/spring-login`

```
┌──────────────────────────────────────────────────────────────────────────┐
│  alexparco            perfil · stack · exp · proyectos · fragmentos   ☀  │
├──────────────────────────────────────────────────────────────────────────┤
│  ← volver                                                                │  mono accent
│                                                                          │
│  Spring-Login                                                            │  h1
│  Alexander Parco Flores · 28 de octubre de 2022                          │  mono muted
│  code ↗                                                                  │  ← SOBRE EL FOLD
├──────────────────────────────────────────────────────────────────────────┤
│   TAGS       │ ReactJs   Java   Spring-Boot                              │
├──────────────────────────────────────────────────────────────────────────┤
│   IMG        │ ┌──────────────────────┐                                  │
│              │ │                      │  hairline 1px, radius 2px,       │
│              │ │   spring.png         │  bg = --color-surface,           │
│              │ │   max-width: 220px   │  padding 8px, fade-in 200ms      │
│              │ └──────────────────────┘                                  │
├──────────────────────────────────────────────────────────────────────────┤
│   NOTAS      │ Este proyecto tiene como objetivo mostrar cómo funciona   │
│              │ la dependencia Spring Boot Security mediante la           │  68ch
│              │ implementación de un sistema de autenticación y           │
│              │ autorización para el inicio de sesión y el registro de    │
│              │ usuarios.                                                 │
│              │                                                           │
│              │ ┌─────────────────────────────────────────────────────┐   │ ← code block:
│              │ │ mvn spring-boot:run                                 │   │   surface +
│              │ └─────────────────────────────────────────────────────┘   │   hairline,
│              │                                                           │   scroll-x
├──────────────────────────────────────────────────────────────────────────┤
│  Lima, Perú · 2026 · alexparco16@gmail.com                               │
└──────────────────────────────────────────────────────────────────────────┘
```

El detalle de fragmento (`/fragmentos/expo-react-eas-apk-build`) es idéntico sin los bloques `TAGS` e `IMG`: h1 + `autor · fecha` + `NOTAS` con el markdown completo (párrafos + code blocks + links).

---

## 10. Limpieza obligatoria (parte del spec, no opcional)

**Desinstalar:** `@chakra-ui/react`, `@chakra-ui/icons`, `@emotion/react`, `@emotion/styled`, `framer-motion`, `moment`, `react-icons`, `@dnd-kit/core`, `@dnd-kit/sortable` (no se usan para nada).
**Instalar:** `tailwindcss@4`, `@tailwindcss/vite`, `@fontsource-variable/geist`, `@fontsource-variable/jetbrains-mono`.
**Mantener:** `react-markdown`, `remark-gfm`, `gh-pages`.

**Borrar:** `src/pages/snippetDetail/details/EasBuild.tsx`, `src/components/Experience/ModalExp.tsx`, `src/pages/works.tsx`, `src/pages/snippets.tsx`, `src/components/WorksGrid/`, `src/components/SnippetsGrid/`, `src/components/Work/`, `src/components/snippet/`, `src/App.css`, `public/petroamerica.png`, `public/zites.svg`.

**Arreglar en los datos (`src/data/`):**
- `experience.ts`: `Fronted Developer` → `Frontend Developer`; eliminar `src` y `id`.
- `works.ts`: eliminar los `href: [""]` vacíos (usar `demo?: string; repo?: string`); añadir `slug`; `date` en formato ISO (`2022-10-28`).
- `snippets.ts`: añadir `slug`, `tags: string[]` y `body: string` (markdown, con el contenido migrado de EasBuild).
- `stack.ts`: `string[]` plano, sin URLs remotas.
- Eliminar todos los `console.log`.