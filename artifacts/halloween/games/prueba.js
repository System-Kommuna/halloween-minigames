// Juego temporal: reemplázalo por un juego real cuando el flujo esté validado.
// Los módulos nuevos exportan mount(container, { onWin, onFail }).
export function mount(container, { onWin, onFail }) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'win-button';
  button.textContent = 'Ganar';
  button.addEventListener('click', () => {
    button.disabled = true;
    onWin();
  }, { once: true });

  // Esta prueba no tiene fallos reales; por eso nunca llama a onFail.
  container.replaceChildren(button);
}