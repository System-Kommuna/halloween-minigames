const SYMBOLS = ['🎃', '👻', '🦇', '🕷️'];

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

export function mount(container, { onWin }) {
  const game = document.createElement('section');
  game.className = 'mini-game memory-game';
  game.setAttribute('aria-label', 'Encuentra las parejas');

  const title = document.createElement('h2');
  title.className = 'mini-game-title';
  title.textContent = 'Encuentra las parejas';

  const grid = document.createElement('div');
  grid.className = 'memory-grid';
  grid.setAttribute('role', 'group');
  grid.setAttribute('aria-label', 'Ocho cartas, cuatro parejas');
  game.append(title, grid);

  const cards = shuffle([...SYMBOLS, ...SYMBOLS]).map((symbol, index) => {
    const button = document.createElement('button');
    button.className = 'memory-card';
    button.type = 'button';
    button.setAttribute('aria-label', `Carta ${index + 1}, boca abajo`);
    button.innerHTML = `
      <span class="memory-card-inner">
        <span class="memory-card-back" aria-hidden="true">🎃</span>
        <span class="memory-card-front" aria-hidden="true">${symbol}</span>
      </span>
    `;
    grid.append(button);
    return { button, symbol, matched: false };
  });

  let revealed = [];
  let locked = false;
  let matchedPairs = 0;
  let finished = false;
  function flip(card, isUp) {
    card.button.classList.toggle('is-flipped', isUp);
    card.button.setAttribute(
      'aria-label',
      isUp ? `Carta descubierta: ${card.symbol}` : 'Carta boca abajo',
    );
  }

  function handleCardTap(card) {
    if (finished || locked || card.matched || revealed.includes(card)) return;

    flip(card, true);
    revealed.push(card);
    if (revealed.length !== 2) return;

    const [first, second] = revealed;
    if (first.symbol === second.symbol) {
      first.matched = true;
      second.matched = true;
      first.button.classList.add('is-matched');
      second.button.classList.add('is-matched');
      first.button.setAttribute('aria-label', `Pareja encontrada: ${first.symbol}`);
      second.button.setAttribute('aria-label', `Pareja encontrada: ${second.symbol}`);
      revealed = [];
      matchedPairs += 1;

      if (matchedPairs === SYMBOLS.length) {
        finished = true;
        window.setTimeout(onWin, 500);
      }
      return;
    }

    locked = true;
    window.setTimeout(() => {
      flip(first, false);
      flip(second, false);
      revealed = [];
      locked = false;
    }, 700);
  }

  for (const card of cards) {
    card.button.addEventListener('click', () => handleCardTap(card));
  }

  container.replaceChildren(game);
}