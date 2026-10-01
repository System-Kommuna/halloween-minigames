# Prueba Halloween

App estática en HTML, CSS y JavaScript vanilla. No necesita frameworks, npm ni compilación: publica `index.html`, `styles.css`, `main.js` y `games/` en cualquier hosting HTTPS. Los módulos ES requieren servir los archivos por HTTP/HTTPS, no abrirlos mediante `file://`.

## Integración

Inserta la URL publicada en un iframe de unos 400 × 600 píxeles, con ancho máximo de 100%. No apliques un sandbox que convierta el origen en opaco.

El padre debe validar tanto `event.origin` (el origen donde alojas esta app) como `event.source === iframe.contentWindow` antes de actuar sobre `event.data.type === 'GAME_WON'`.

Los sitios autorizados se editan arriba de `main.js`. Sus URLs se normalizan a origins sin barra final. El destino se obtiene del origen del padre inmediato o de `document.referrer`; si no puede verificarse, no se envía nada. En navegadores sin `ancestorOrigins`, el iframe debe conservar el referrer, por ejemplo `referrerpolicy="origin"`.

## Juegos

Cada juego exporta `mount(container, { onWin, onFail })`. En cada carga, el shell selecciona un juego al azar entre memorama, atrapa fantasmas y encuentra al intruso. Memorama y fantasma nunca llaman a `onFail`.

- **Memorama:** cuatro parejas, cartas volteadas con CSS, sin límite de intentos.
- **Fantasma:** cinco capturas, con fantasmas visibles 1200 ms y sin penalizaciones.
- **Intruso:** tres rondas; un error regenera solo la ronda actual.

Todo el estado vive en memoria: recargar reinicia la partida. `onWin` muestra el overlay y después de 1200 ms envía un único mensaje al padre autorizado. `onFail` muestra “Sigue intentando 👻” durante 1500 ms; el juego gestiona su continuación.

`server.mjs` solo sirve para la vista previa de desarrollo; no es necesario para un hosting estático.