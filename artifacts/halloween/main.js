// Edita esta lista para autorizar nuevos sitios padre.
export const ALLOWED_PARENT_ORIGINS = [
  'https://promocionesoxxogas.com/',
  'https://oxxogas-empresas.webflow.io/',
].map((url) => new URL(url).origin);

import { mount as mountPrueba } from './games/prueba.js';
import { mount as mountMemorama } from './games/memorama.js';
import { mount as mountFantasma } from './games/fantasma.js';
import { mount as mountIntruso } from './games/intruso.js';

// Cada partida selecciona un solo juego al azar al cargar.
const games = [mountMemorama, mountFantasma, mountIntruso, mountPrueba];

function resolveParentOrigin() {
  if (window.parent === window) return null;
  // ancestorOrigins funciona incluso si el padre oculta el referrer (Chromium).
  const ancestorOrigin = window.location.ancestorOrigins?.[0];
  if (ancestorOrigin) {
    return ALLOWED_PARENT_ORIGINS.includes(ancestorOrigin) ? ancestorOrigin : null;
  }
  try {
    const origin = new URL(document.referrer).origin;
    return ALLOWED_PARENT_ORIGINS.includes(origin) ? origin : null;
  } catch {
    // No adivinar el destinatario ni usar '*'.
    return null;
  }
}

const PARENT_ORIGIN = resolveParentOrigin();
const container = document.querySelector('#game-container');
const winOverlay = document.querySelector('#win-overlay');
const failMessage = document.querySelector('#fail-message');
const deliveryStatus = document.querySelector('#delivery-status');
let won = false;
let messageSent = false;
let failTimer;

function onWin() {
  if (won) return;
  won = true;
  clearTimeout(failTimer);
  failMessage.hidden = true;
  winOverlay.hidden = false;
  container.inert = true;

  window.setTimeout(() => {
    if (messageSent) return;
    if (deliveryStatus) deliveryStatus.hidden = false;
    if (!PARENT_ORIGIN) {
      if (deliveryStatus) {
        deliveryStatus.textContent = 'Prueba completada. El mensaje solo se envía dentro de un sitio autorizado.';
      }
      return;
    }
    messageSent = true;
    window.parent.postMessage({ type: 'GAME_WON' }, PARENT_ORIGIN);
    if (deliveryStatus) deliveryStatus.textContent = 'Prueba completada.';
  }, 1200);
}

function onFail() {
  if (won) return;
  clearTimeout(failTimer);
  failMessage.hidden = false;
  failTimer = window.setTimeout(() => {
    failMessage.hidden = true;
  }, 1500);
}

const mount = games[Math.floor(Math.random() * games.length)];
mount(container, { onWin, onFail });