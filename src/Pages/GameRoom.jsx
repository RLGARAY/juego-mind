import React, { useState } from 'react';
import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Chat from '../Components/Chat';
import PlayerHand from '../Features/PlayerHand';
import GameStats from '../Features/GameStats';
import HandCard from '../Features/HandCard/HandCard';

import useGameContext from '../Context/GameContext';

const GameRoom = () => {
  const { gameState, startGame, nextRound, playCard } = useGameContext();

  const [messages, setMessages] = useState([]);
  const [round, setRound] = useState(0);
  const [gameIsActive, setGameIsActive] = useState(false);
  const [roundIsActive, setRoundIsActive] = useState(false);

  const [tableCards, setTableCards] = useState([]);
  const [localPlayerCards, setLocalPlayerCards] = useState([
    { id: 99 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
    { id: 12 },
  ]); // Ejemplo de cartas del jugador
  const [otherPlayerCards, setOtherPlayerCards] = useState([
    { id: 99 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
    { id: 12 },
  ]); // Ejemplo de cartas del jugador

  const handleCardClick = (card) => {
    // Mueve la carta seleccionada desde la mano del jugador a la mesa
    setTableCards([...tableCards, card]);
    setLocalPlayerCards(localPlayerCards.filter((c) => c !== card));
  };

  const handleSendMessage = (nick, message) => {
    const newMessage = {
      nick,
      message,
    };
    setMessages([...messages, newMessage]);
  };

  const handleStartGame = () => {
    setGameIsActive(true);
    setRound(1);
    setRoundIsActive(true);
    //Repartir Cartas
  };

  const handleNextRound = () => {
    setRound(round + 1);
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Opponent Hand*/}
        <Box
          sx={{
            width: '20%',
            height: '20%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4">Player</Typography>
          <PlayerHand local={false} cards={otherPlayerCards} onCardClick={handleCardClick} />
        </Box>

        {/* Game Table */}
        <Box
          sx={{
            mt: '20px',
            position: 'relative',
            height: '150px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <motion.div layout>
            {tableCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  left: `calc(50% - ${index * 20}px)`,
                }}
              >
                <HandCard card={card} playable={false} />
              </motion.div>
            ))}
          </motion.div>
        </Box>
        {/*Player Hand */}
        <Box
          sx={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <PlayerHand local={true} cards={localPlayerCards} onCardClick={handleCardClick} />
        </Box>
      </Box>

      {/* Game Info left column */}
      <GameStats
        round={round}
        gameIsActive={gameIsActive}
        roundIsActive={roundIsActive}
        handleNextRound={handleNextRound}
        handleStartGame={handleStartGame}
        setGameIsActive={setGameIsActive}
      />

      {/* Chat Component */}
      <Chat messages={messages} onSendMessage={handleSendMessage} />
    </div>
  );
};

export default GameRoom;
