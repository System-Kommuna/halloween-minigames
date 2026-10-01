const TARGET_SCORE = 5;
const HOLE_COUNT = 9;
const HIDE_DELAY = 1200;

export function mount(container, { onWin }) {
  const game = document.createElement('section');
  game.className = 'mini-game ghost-game';
  game.setAttribute('aria-label', 'Atrapa cinco fantasmas');

  const title = document.createElement('h2');
  title.className = 'mini-game-title';
  title.textContent = '¡Atrapa 5 fantasmas!';

  const score = document.createElement('p');
  score.className = 'ghost-score';
  score.setAttribute('aria-live', 'polite');
  score.textContent = 'Fantasmas: 0 / 5';

  const grid = document.createElement('div');
  grid.className = 'ghost-grid';
  grid.setAttribute('role', 'group');
  grid.setAttribute('aria-label', 'Nueve huecos');

  const holes = Array.from({ length: HOLE_COUNT }, (_, index) => {
    const hole = document.createElement('button');
    hole.className = 'ghost-hole';
    hole.type = 'button';
    hole.setAttribute('aria-label', `Hueco ${index + 1}`);
    hole.addEventListener('click', () => {
      if (hole.classList.contains('has-ghost') && !ending) catchGhost(hole);
    });
    grid.append(hole);
    return hole;
  });

  game.append(title, score, grid);
  container.replaceChildren(game);

  let points = 0;
  let previousHole = -1;
  let activeHole = -1;
  let ending = false;
  let locked = false;
  let timers = new Set();

  function schedule(callback, delay) {
    const timer = window.setTimeout(() => {
      timers.delete(timer);
      if (!ending) callback();
    }, delay);
    timers.add(timer);
    return timer;
  }

  function clearTimers() {
    for (const timer of timers) window.clearTimeout(timer);
    timers.clear();
  }

  function hideGhost() {
    if (activeHole < 0) return;
    const hole = holes[activeHole];
    hole.classList.remove('has-ghost');
    hole.classList.add('ghost-leaving');
    hole.setAttribute('aria-label', `Hueco ${activeHole + 1}`);
    schedule(() => {
      hole.classList.remove('ghost-leaving');
      hole.textContent = '';
      activeHole = -1;
      showGhost();
    }, 180);
  }

  function showGhost() {
    if (ending) return;
    let nextHole = Math.floor(Math.random() * HOLE_COUNT);
    if (HOLE_COUNT > 1) {
      while (nextHole === previousHole) {
        nextHole = Math.floor(Math.random() * HOLE_COUNT);
      }
    }
    previousHole = nextHole;
    activeHole = nextHole;

    const hole = holes[nextHole];
    hole.textContent = '👻';
    hole.setAttribute('aria-label', `Fantasma en el hueco ${nextHole + 1}`);
    hole.classList.add('has-ghost');
    schedule(hideGhost, HIDE_DELAY);
  }

  function catchGhost(hole) {
    if (ending || locked || !hole.classList.contains('has-ghost')) return;
    locked = true;
    clearTimers();
    points += 1;
    score.textContent = `Fantasmas: ${points} / ${TARGET_SCORE}`;
    activeHole = -1;
    hole.classList.remove('has-ghost');
    hole.classList.add('ghost-caught');
    hole.setAttribute('aria-label', `Fantasma atrapado. ${score.textContent}`);

    if (points === TARGET_SCORE) {
      ending = true;
      for (const target of holes) target.disabled = true;
      const winTimer = window.setTimeout(() => {
        timers.delete(winTimer);
        clearTimers();
        onWin();
      }, 500);
      timers.add(winTimer);
      return;
    }

    schedule(() => {
      hole.classList.remove('ghost-caught');
      hole.textContent = '';
    }, 180);
    schedule(() => {
      locked = false;
      showGhost();
    }, 300);
  }

  showGhost();
}