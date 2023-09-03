/**
 * This Class is to Generate a Deck with
 * cards with id from 1 to 100
 * shuffle them and a method to
 * deal x cards to x players
 */
function createDeck() {
  const deck = [];

  for (let id = 1; id <= 100; id++) {
    deck.push({ id: id });
  }

  return deck;
}

function shuffleDeck(deck) {
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
}

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
