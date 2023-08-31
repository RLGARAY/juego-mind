// Clase para crear cartas
class Card {
  constructor(id) {
    this.id = id;
  }
}

// Función para crear un mazo de cartas numeradas del 1 al 100
function createDeck() {
  const deck = [];

  for (let id = 1; id <= 100; id++) {
    deck.push({ id: id });
  }

  return deck;
}

// Función para mezclar el mazo de cartas
function shuffleDeck(deck) {
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
}

// Función para repartir cartas a los jugadores
export function dealCards(players, numCards) {
  const deck = createDeck();
  const shuffledDeck = shuffleDeck(deck);
  const hands = [];

  for (let i = 0; i < players; i++) {
    const playerHand = [];
    for (let j = 0; j < numCards; j++) {
      playerHand.push(shuffledDeck.pop());
    }
    hands.push(playerHand);
  }
  return hands;
}
