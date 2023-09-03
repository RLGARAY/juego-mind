export const usersCollection = 'users';
export const roomCollection = 'rooms';
export const gamesCollection = 'games';
export const lives = 3;
export const jokers = 3;
export const max_round = 3;
export const gameRules = `The Mind es un juego en el que los jugadores forman un equipo y deben superar niveles sin poder intercambiar información ni ponerse de acuerdo; simplemente deben conectar sus mentes. En cada ronda se repartirá el número de cartas correspondiente al número de ronda a cada jugador (por ejemplo para ronda 2 son 2 cartas a cada uno), y el objetivo es ordenar las cartas de menor a mayor. Cada jugador puede jugar carta cuando lo desee; no hay turnos. Además, dispondréis de ${lives} vidas y ${jokers} comodines hasta superar la ronda ${max_round}.`;
export const hostInfo =
  'Eres el anfitrión y deberás gestionar el estado de la partida. Una vez que estén los 2 jugadores, podrás comenzar la partida e iniciar cada ronda. Las cartas se barajan y reparten automáticamente, y en el momento en el que tengais las cartas ya las podréis jugar. También eres el encargado de utilizar el comodín. En este juego, el comodín jugará automáticamente vuestras 2 cartas más pequeñas siempre y cuando haya 2 cartas disponibles para jugar.';
