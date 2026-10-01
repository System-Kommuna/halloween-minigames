const ROUNDS = [
  { columns: 3, rows: 3, matching: '🎃', odd: '🍎' },
  { columns: 4, rows: 3, matching: '👻', odd: '😶' },
  { columns: 4, rows: 4, matching: '🦇', odd: '🕊️' },
];

export function mount(container, { onWin, onFail }) {
  const game = document.createElement('section');
  game.className = 'mini-game intruder-game';
  game.setAttribute('aria-label', 'Encuentra al intruso');

  const title = document.createElement('h2');
  title.className = 'mini-game-title';
  title.textContent = 'Encuentra al intruso';

  const roundStatus = document.createElement('p');
  roundStatus.className = 'intruder-round';
  roundStatus.setAttribute('aria-live', 'polite');

  const grid = document.createElement('div');
  grid.className = 'intruder-grid';
  grid.setAttribute('role', 'group');
  grid.setAttribute('aria-label', 'Cuadrícula de emojis');
  game.append(title, roundStatus, grid);
  container.replaceChildren(game);

  let roundIndex = 0;
  let previousPosition = -1;
  let locked = false;
  let finished = false;
  function randomPosition(size) {
    const hasPrevious = previousPosition >= 0 && previousPosition < size;
    let position = Math.floor(Math.random() * (hasPrevious ? size - 1 : size));
    if (hasPrevious && position >= previousPosition) position += 1;
    previousPosition = position;
    return position;
  }

  function renderRound() {
    if (finished) return;
    locked = false;
    const round = ROUNDS[roundIndex];
    const size = round.columns * round.rows;
    const intruderPosition = randomPosition(size);
    roundStatus.textContent = `Ronda ${roundIndex + 1} de ${ROUNDS.length}`;
    grid.style.setProperty('--intruder-columns', round.columns);
    grid.replaceChildren();

    for (let index = 0; index < size; index += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'intruder-tile';
      button.textContent = index === intruderPosition ? round.odd : round.matching;
      button.setAttribute(
        'aria-label',
        `Emoji ${index + 1}: ${button.textContent}`,
      );
      button.addEventListener('click', () => {
        if (finished || locked) return;
        if (index === intruderPosition) {
          locked = true;
          button.classList.add('is-correct');
          if (roundIndex === ROUNDS.length - 1) {
            finished = true;
            window.setTimeout(onWin, 250);
            return;
          }
          window.setTimeout(() => {
            roundIndex += 1;
            renderRound();
          }, 260);
          return;
        }

        locked = true;
        onFail();
        button.classList.add('is-wrong');
        window.setTimeout(() => {
          button.classList.remove('is-wrong');
          renderRound();
        }, 360);
      });
      grid.append(button);
    }
  }

  renderRound();
}