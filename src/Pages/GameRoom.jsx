import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Chat from '../Components/Chat';
import PlayerHand from '../Features/PlayerHand';
import GameStats from '../Features/GameStats';
import HandCard from '../Features/HandCard/HandCard';

import { useAuthContext } from '../Context/AuthContext';
import { useRoomContext } from '../Context/RoomContext';
import { useGameContext } from '../Context/GameContext';

const GameRoom = () => {
  const navigate = useNavigate();
  const { authState } = useAuthContext();
  const { roomState, leaveRoom, sendMessage } = useRoomContext();
  const { gameState, startGame, nextRound, playCard, playJoker } = useGameContext();

  /**
   * Method to play the selected card
   */
  const handleCardClick = (card) => {
    if (gameState.gameStatus === 'Derrota') {
      return;
    }
    playCard(card);
  };

  /**
   * Method to play a joker
   * Controls when there are less than 2 cards playable and
   * sends a message to chat as system
   */
  const handleUseJoker = () => {
    const totalCards = gameState.player1Cards.length + gameState.player2Cards.length;

    if (totalCards >= 2) {
      playJoker();
    } else {
      const nick = 'system';
      const message = 'No se puede usar el comodín, no hay suficientes cartas.';
      const newMessage = { nick, message };
      sendMessage(newMessage);
    }
  };

  /**
   * Method to send a message to chat with format {nick, message}
   */
  const handleSendMessage = (message) => {
    const nick = authState.username;
    const newMessage = { nick, message };
    sendMessage(newMessage);
  };

  const handleStartGame = () => {
    startGame();
  };

  const handleNextRound = () => {
    nextRound();
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/Home');
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
          <Typography variant="h4">
            {roomState.host
              ? roomState.player2
                ? roomState.player2
                : 'Waiting...'
              : roomState.player1}
          </Typography>
          <PlayerHand
            local={false}
            cards={roomState.host ? gameState.player2Cards : gameState.player1Cards}
            onCardClick={handleCardClick}
          />
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
            {gameState.playedCardsInRound.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  left: `calc(50% - ${index * 35}px)`,
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
          <PlayerHand
            local={true}
            cards={roomState.host ? gameState.player1Cards : gameState.player2Cards}
            onCardClick={handleCardClick}
          />
        </Box>
      </Box>

      {/* Game Info left column */}
      <GameStats
        handleNextRound={handleNextRound}
        handleStartGame={handleStartGame}
        handleUseJoker={handleUseJoker}
        handleLeaveRoom={handleLeaveRoom}
      />

      {/* Chat Component */}
      <Chat messages={roomState.messages} onSendMessage={handleSendMessage} />
    </div>
  );
};

export default GameRoom;
