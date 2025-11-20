import { triggerFlipDelay } from "../events/game.js";

const games = new Map();
let currentGameID = 0;

// Opções de cartas
const options = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
  return { face: i, matched: false, flipped: false };
});

// Gerar Tabuleiro (Passo 33)
export const generateBoard = (difficulty) => {
  const cards = [];
  let numPairs = 4;
  if (difficulty === "medium") numPairs = 6;
  if (difficulty === "hard") numPairs = 8;

  const boardOptions = options.slice(0, numPairs);

  let idCounter = 0;
  boardOptions.forEach((option) => {
    cards.push({ id: idCounter++, ...option });
    cards.push({ id: idCounter++, ...option });
  });

  // Lógica de shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
};

// Criação do Jogo (Passo 34)
export const createGame = (difficulty, user) => {
  currentGameID++;
  const game = {
    id: currentGameID,
    difficulty,
    creator: user.id,
    player1: user.id,
    player2: null,
    winner: null,
    currentPlayer: user.id,
    cards: generateBoard(difficulty),
    flippedCards: [],
    matchedPairs: [],
    started: false,
    complete: false,
    moves: 0,
    beganAt: null,
    endedAt: null,
  };
  games.set(currentGameID, game);
  return game;
};

// Lógica de listagem (Ajuste Final para remover jogos completos)
export const getGames = () => {
  // Filtra jogos que ainda não estão completos
  const available = Array.from(games.values()).filter(
    (game) => game.complete === false
  );
  return available;
};

// Entrar no Jogo (Passo 35)
export const joinGame = (gameID, player2ID) => {
  const game = games.get(gameID);

  if (game && !game.player2) {
    game.player2 = player2ID;
  }
  return game;
};

// Lógica de Virar Cartas (Passo 36)
export const flipCard = (gameID, card) => {
  const game = games.get(gameID);

  if (!game) return null; // Retorna null se o jogo não existir

  // Inicia o timer do jogo no primeiro clique
  if (!game.beganAt) {
    game.beganAt = new Date().toISOString();
    game.started = true;
  }

  const gameCard = game.cards.find((c) => c.id === card.id);

  // Regras de bloqueio
  if (game.flippedCards.includes(gameCard.id)) return game;
  if (game.matchedPairs.includes(gameCard.id)) return game;
  if (game.flippedCards.length >= 2) return game;
  if (game.started && game.currentPlayer !== card.userID) return game;

  // Virar a carta
  game.flippedCards.push(gameCard.id);
  gameCard.flipped = true;

  if (game.flippedCards.length === 2) {
    game.moves++;
    checkForMatch(game);
    checkForGameComplete(game);
  }
  return game;
};

// Verifica se houve match
const checkForMatch = (game) => {
  if (game.flippedCards.length !== 2) return;

  const [first, second] = game.flippedCards;
  const firstCard = game.cards.find((c) => c.id === first);
  const secondCard = game.cards.find((c) => c.id === second);

  if (firstCard.face === secondCard.face) {
    // Match
    game.matchedPairs.push(first, second);
    firstCard.matched = true;
    secondCard.matched = true;
    game.flippedCards = [];
  } else {
    // Sem Match: Inicia o delay para desvirar
    setTimeout(() => {
      triggerFlipDelay(game);
    }, 1000);
  }
};

// Verifica se o jogo acabou
const checkForGameComplete = (game) => {
  if (game.matchedPairs.length === game.cards.length) {
    game.complete = true;
    game.winner = game.currentPlayer;
    game.endedAt = new Date().toISOString();
  }
};

// Desvira cartas e alterna jogador (Passo 36 e 37)
export const clearFlippedCard = (game) => {
  if (game.flippedCards.length !== 2) return game;

  const [first, second] = game.flippedCards;
  const firstCard = game.cards.find((c) => c.id === first);
  const secondCard = game.cards.find((c) => c.id === second);

  // Desvirar e Limpar
  firstCard.flipped = false;
  secondCard.flipped = false;
  game.flippedCards = [];

  // Alternar jogador
  game.currentPlayer =
    game.currentPlayer === game.player1 ? game.player2 : game.player1;

  return game;
};

// Ajuste Final: Remover um jogo
export const removeGame = (gameID) => {
  return games.delete(gameID);
};
