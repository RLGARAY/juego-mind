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
    const card = new Card(id);
    deck.push(card);
  }

  return deck;
}

// Función para repartir cartas a los jugadores
function dealCards(deck, numCards) {
  const shuffledDeck = shuffleDeck(deck);
  const hands = [];

  for (let i = 0; i < numCards; i++) {
    hands.push(shuffledDeck.slice(i * 2, (i + 1) * 2)); // Cambia el 2 por el número de cartas por mano
  }

  return hands;
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

// Uso de las funciones para crear cartas, repartir y mostrar las manos de los jugadores
const deck = createDeck();
const numCardsPerHand = 3; // Cambia este valor según lo que necesites

const playerHands = dealCards(deck, numCardsPerHand);

console.log('Mano del Jugador 1:', playerHands[0]);
console.log('Mano del Jugador 2:', playerHands[1]);
